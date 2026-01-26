from arq import ArqRedis
from typing import Optional

from core.errors import InvalidRequest, MissingResources
from crud import (
    CRUDAuthUser,
    CRUDProduct,
    CRUDProductCategory,
    CRUDProductImage,
    CRUDProductReview,
    CRUDProductTemplate
)
from models import AuthUser, ProductCategory
from schemas import (
    ProductCreate,
    ProductImageUpdate,
    ProductReviewCreate,
    ProductReviewUpdate,
    ProductUpdate,
    ProductImageCreate,
    ProductTemplateCreate,
    ProductTemplateUpdate
)
from utils.generate_sku import generate_random_sku


class ProductService:

    def __init__(
        self,
        crud_auth_user: CRUDAuthUser,
        crud_product: CRUDProduct,
        crud_product_category: CRUDProductCategory,
        crud_product_image: CRUDProductImage,
        crud_product_review: CRUDProductReview,
        crud_product_template: CRUDProductTemplate,
        queue_connection: ArqRedis,
    ):
        self.crud_auth_user = crud_auth_user
        self.crud_product = crud_product
        self.crud_product_category = crud_product_category
        self.crud_product_image = crud_product_image
        self.crud_product_review = crud_product_review
        self.crud_product_template = crud_product_template
        self.queue_connection = queue_connection

    async def get_product_categories(self):
        categories = self.crud_product_category.get_multi(limit=1000)
        return categories

    async def create_product(
        self,
        data_obj: ProductCreate,
        current_user: AuthUser,
    ):
        category = self.crud_product_category.get_by_category_name(
            category_name=data_obj.category
        )
        if not category:
            new_category = await self.crud_product_category.create(
                data_obj={ProductCategory.CATEGORY_NAME: data_obj.category}
            )
            data_obj.product_category_id = new_category.id
        else:
            data_obj.product_category_id = category.id
        data_obj.vendor_id = current_user.role_id
        data_obj.sku = generate_random_sku(data_obj.category[0:4])
        del data_obj.category
        product_images = data_obj.product_images
        del data_obj.product_images

        product = await self.crud_product.create(data_obj)
        images_obj = [
            ProductImageCreate(product_id=product.id, product_image=str(image))
            for image in product_images
        ]
        await self.crud_product_image.bulk_insert(data_objs=images_obj)

        new_product = self.crud_product.get_single_product_by_id(id=product.id)
        return new_product

    async def get_products_customer(
        self,
        search: str,
        skip: int,
        limit: int,
    ):
        products = self.crud_product.get_all_products_public(
            search=search, skip=skip, limit=limit
        )
        if not products:
            raise MissingResources("No Products")
        return products

    async def get_products_vendor(
        self,
        search: str,
        skip: int,
        limit: int,
        vendor_id: int,
    ):

        product = self.crud_product.get_products_for_vendor(
            search=search, vendor_id=vendor_id, skip=skip, limit=limit
        )
        if not product:
            raise MissingResources("You haven't added any products yet")
        return product

    async def sort_product_by_price(
        self,
        skip: int,
        limit: int,
    ):
        product = self.crud_product.sort_product_by_price(skip=skip, limit=limit)
        return product

    async def get_one_product(
        self,
        product_id: int,
    ):
        product = self.crud_product.get_active_products(id=product_id)

        return product

    async def update_product(
        self,
        product_id: int,
        data_obj: ProductUpdate,
        vendor_id: int,
    ):

        product = self.crud_product.get_active_products(id=product_id)
        if product.vendor_id != vendor_id:
            raise InvalidRequest("Product doesn't belong to you")

        if data_obj.category:
            data_obj.sku = generate_random_sku(data_obj.category[0:4])
            prod_cat = await self.crud_product_category.create(
                data_obj={ProductCategory.CATEGORY_NAME: data_obj.category}
            )
            data_obj.product_category_id = prod_cat.id

        del data_obj.category

        updated_product = await self.crud_product.update(
            id=product_id, data_obj=data_obj
        )

        return updated_product

    async def update_product_image(
        self,
        product_image_id: int,
        data_obj: ProductImageUpdate,
        vendor_id: int,
    ):

        product_image = self.crud_product_image.get_or_raise_exception(product_image_id)
        product = self.crud_product.get_active_products(id=product_image.product_id)
        if product.vendor_id != vendor_id.role_id:
            raise InvalidRequest("Product doesn't belong to you")
        data_obj.product_image = str(data_obj.product_image)

        updated_product_image = await self.crud_product_image.update(
            id=product_image_id, data_obj=data_obj
        )

        return updated_product_image

    async def delete_product(
        self,
        product_id: int,
        vendor_id: int,
    ):
        product = self.crud_product.get_active_products(id=product_id)
        if product.vendor_id != vendor_id:
            raise InvalidRequest("Product doesn't belong to you")
        await self.crud_product.delete(product_id)

    async def create_product_review(
        self,
        data_obj: ProductReviewCreate,
    ):
        self.crud_product.get_active_products(id=data_obj.product_id)
        product_review = await self.crud_product_review.create(data_obj)
        return product_review

    async def update_product_review(
        self,
        review_id: int,
        data_obj: ProductReviewUpdate,
    ):
        review = self.crud_product_review.get_or_raise_exception(id=review_id)
        updated_review = await self.crud_product_review.update(
            id=review.id, data_obj=data_obj
        )
        return updated_review

    async def create_template(
        self,
        data_obj: ProductTemplateCreate,
        current_user: AuthUser,
    ):
        # Convert Pydantic model to dict and add vendor_id
        template_data = data_obj.model_dump(exclude_none=True)
        template_data["vendor_id"] = current_user.role_id
        
        if template_data.get("category_id"):
            category = self.crud_product_category.get(id=template_data["category_id"])
            if not category:
                raise InvalidRequest("Category not found")
        
        template = await self.crud_product_template.create(template_data)
        return template

    async def get_vendor_templates(self, vendor_id: int):
        templates = self.crud_product_template.get_templates_by_vendor(vendor_id=vendor_id)
        return templates or []

    async def update_template(
        self,
        template_id: int,
        vendor_id: int,
        data_obj: ProductTemplateUpdate,
    ):
        template = self.crud_product_template.get_template_by_id_and_vendor(
            template_id=template_id, vendor_id=vendor_id
        )
        if not template:
            raise MissingResources
        
        if data_obj.category_id:
            category = self.crud_product_category.get(id=data_obj.category_id)
            if not category:
                raise InvalidRequest("Category not found")
        
        updated_template = await self.crud_product_template.update(
            db_obj=template, obj_in=data_obj
        )
        return updated_template

    async def delete_template(self, template_id: int, vendor_id: int):
        template = self.crud_product_template.get_template_by_id_and_vendor(
            template_id=template_id, vendor_id=vendor_id
        )
        if not template:
            raise MissingResources
        
        await self.crud_product_template.remove(id=template_id)
        return None

    async def create_product_from_template(
        self,
        template_id: int,
        current_user: AuthUser,
        stock: int,
        pickup_time: Optional[str] = None,
    ):
        template = self.crud_product_template.get_template_by_id_and_vendor(
            template_id=template_id, vendor_id=current_user.role_id
        )
        if not template:
            raise MissingResources
        
        # Get or create category
        category = None
        if template.category_id:
            category = self.crud_product_category.get(id=template.category_id)
        
        if not category:
            category = self.crud_product_category.get_by_category_name(
                category_name="food"  # Default category
            )
            if not category:
                category = await self.crud_product_category.create(
                    data_obj={ProductCategory.CATEGORY_NAME: "food"}
                )
        
        # Create product from template
        product_data = ProductCreate(
            vendor_id=current_user.role_id,
            product_name=template.product_name,
            short_description=template.short_description,
            long_description=template.long_description or template.short_description,
            product_images=[template.template_image] if template.template_image else [],
            category=category.category_name,  # Assuming category_name matches ProductCategoryEnum
            stock=stock,
            price=template.price,
            pickup_time=pickup_time or "14:00",
            product_status=True,
        )
        
        return await self.create_product(data_obj=product_data, current_user=current_user)
