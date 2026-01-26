from fastapi import Depends, APIRouter, status, Query
from core.tokens import get_current_verified_vendor
from models import AuthUser
from schemas import (
    ProductTemplateCreate,
    ProductTemplateReturn,
    ProductTemplateUpdate,
    ProductReturn,
)
from services.product_service import ProductService
from api.dependencies.services import get_product_service
from core.errors import MissingResources
from typing import Optional

router = APIRouter(prefix="/templates", tags=["Template"])


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
    response_model=ProductTemplateReturn,
)
async def create_template(
    data_obj: ProductTemplateCreate,
    current_user: AuthUser = Depends(get_current_verified_vendor),
    product_service: ProductService = Depends(get_product_service),
):
    return await product_service.create_template(
        data_obj=data_obj, current_user=current_user
    )


@router.get("/me", response_model=list[ProductTemplateReturn])
async def get_my_templates(
    current_user: AuthUser = Depends(get_current_verified_vendor),
    product_service: ProductService = Depends(get_product_service),
):
    templates = await product_service.get_vendor_templates(vendor_id=current_user.role_id)
    return templates


@router.put("/{template_id}", response_model=ProductTemplateReturn)
async def update_template(
    template_id: int,
    data_obj: ProductTemplateUpdate,
    current_user: AuthUser = Depends(get_current_verified_vendor),
    product_service: ProductService = Depends(get_product_service),
):
    return await product_service.update_template(
        template_id=template_id,
        vendor_id=current_user.role_id,
        data_obj=data_obj,
    )


@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_template(
    template_id: int,
    current_user: AuthUser = Depends(get_current_verified_vendor),
    product_service: ProductService = Depends(get_product_service),
):
    await product_service.delete_template(
        template_id=template_id, vendor_id=current_user.role_id
    )
    return None


@router.post(
    "/{template_id}/create-product",
    status_code=status.HTTP_201_CREATED,
    response_model=ProductReturn,
)
async def create_product_from_template(
    template_id: int,
    stock: int = Query(..., description="Stock quantity for the new product"),
    pickup_time: Optional[str] = Query("14:00", description="Pickup time for the product"),
    current_user: AuthUser = Depends(get_current_verified_vendor),
    product_service: ProductService = Depends(get_product_service),
):
    return await product_service.create_product_from_template(
        template_id=template_id,
        current_user=current_user,
        stock=stock,
        pickup_time=pickup_time,
    )

