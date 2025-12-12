from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.models.base import Base

class Deal(Base):
    __tablename__ = 'deals'
    id = Column(String, primary_key=True)
    vendor_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Shop owner user id
    title = Column(String)
    restaurant_name = Column(String)
    description = Column(String)
    price = Column(Integer)
    quantity = Column(Integer)
    pickup_address = Column(String)
    image_url = Column(String)
    is_active = Column(Boolean, default=True)
    ready_time = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    vendor = relationship("User", backref="deals")
    carts = relationship("Cart", back_populates="product")
