from datetime import datetime
from typing import ClassVar, Optional
from typing_extensions import Annotated
from pydantic import AnyHttpUrl, BaseModel, Field, StringConstraints

from schemas.base import ProductCategoryEnum, ProductOptionalBase, ReturnBaseModel


class VendorLocationInfo(BaseModel):
    """Vendor location info for product display"""
    id: int
    username: str
    address: str
    state: str
    country: str
    order_time: Optional[str] = None


class ProductImageCreate(BaseModel):
    product_image: str
    product_id: int


class ProductCategoryCreate(BaseModel):
    category_name: ProductCategoryEnum


class ProductImageReturn(ReturnBaseModel):
    product_image: str
    product_id: int


class ProductCategoryReturn(ReturnBaseModel):
    category_name: ProductCategoryEnum


class ProductCreate(ProductOptionalBase):
    PRODUCT_STATUS: ClassVar[str] = "product_status"

    vendor_id: Optional[int] = None
    product_name: str
    product_images: list[str]
    category: ProductCategoryEnum
    short_description: Annotated[str, StringConstraints(max_length=50)]
    product_status: bool = True
    long_description: str
    stock: int
    price: int = Field(gt=0)
    pickup_time: Optional[str] = None  # e.g., "10:00-14:00" or "After 5PM"


class ProductReturn(ReturnBaseModel, ProductCreate):
    CREATED_TIMESTAMP: ClassVar[str] = "created_timestamp"

    product_images: list[ProductImageReturn]
    category: ProductCategoryReturn


class ProductsReturn(ProductReturn):
    reviews: Optional[list["ProductReviewReturn"]] = []
    vendor: Optional[VendorLocationInfo] = None


class ProductUpdate(ProductOptionalBase):
    product_name: Optional[str] = None
    short_description: Optional[str] = None
    category: Optional[ProductCategoryEnum] = None
    product_status: Optional[bool] = None
    long_description: Optional[str] = None
    stock: Optional[int] = None
    price: Optional[float] = None
    pickup_time: Optional[str] = None


class ProductImageUpdate(BaseModel):
    product_image: AnyHttpUrl


class ProductImageUpdateReturn(ProductImageUpdate):
    updated_timestamp: datetime


class ProductUpdateReturn(ProductUpdate):
    created_timestamp: Optional[datetime] = None
    updated_timestamp: Optional[datetime] = None


class ProductReviewCreate(BaseModel):
    product_id: int
    review: str
    rating: float = Field(ge=0, le=5)


class ProductReviewUpdate(BaseModel):
    review: Optional[str] = None
    rating: Optional[float] = Field(default=None, ge=0, le=5)


class ProductReviewUpdateReturn(BaseModel):
    review: Optional[str] = None
    rating: Optional[float] = Field(default=None, ge=0, le=5)
    updated_timestamp: datetime


class ProductReviewReturn(ReturnBaseModel):
    product_id: int
    review: str
    rating: float = Field(ge=0, le=5)


class ProductTemplateCreate(BaseModel):
    template_name: str
    product_name: str
    short_description: Annotated[str, StringConstraints(max_length=50)]
    long_description: Optional[str] = None
    price: int = Field(gt=0)
    category_id: Optional[int] = None
    template_image: Optional[str] = None
    is_default: bool = False


class ProductTemplateUpdate(BaseModel):
    template_name: Optional[str] = None
    product_name: Optional[str] = None
    short_description: Optional[Annotated[str, StringConstraints(max_length=50)]] = None
    long_description: Optional[str] = None
    price: Optional[int] = Field(default=None, gt=0)
    category_id: Optional[int] = None
    template_image: Optional[str] = None
    is_default: Optional[bool] = None

class ProductTemplateReturn(ReturnBaseModel):
    vendor_id: int
    template_name: str
    product_name: str
    short_description: str
    long_description: Optional[str] = None
    price: int
    category_id: Optional[int] = None
    template_image: Optional[str] = None
    is_default: bool