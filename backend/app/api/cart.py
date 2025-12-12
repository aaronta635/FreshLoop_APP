from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from app.utils.dependencies import get_db
from app.utils.services import get_cart_service
from app.utils.auth_dependencies import get_current_user
from app.schemas.cart import (
    CartCreate,
    CartReturn,
    CartUpdate,
    CartUpdateReturn,
    CartSummary,
    CheckoutCreate,
    PaymentVerified,
)
from app.services.cart_service import CartService
from app.models.user import User
from app.models.cart import Cart, Order, OrderItem
from app.models.deal import Deal
from datetime import datetime
from typing import List


router = APIRouter(tags=["Cart"])


# ============================================
# AUTHENTICATED CART ENDPOINTS
# ============================================

@router.post("/add", status_code=status.HTTP_201_CREATED, response_model=CartReturn)
async def add_to_cart(
    data_obj: CartCreate,
    cart_service: CartService = Depends(get_cart_service),
    current_user: User = Depends(get_current_user),
):
    """Add item to cart for authenticated user"""
    return await cart_service.create_cart(
        data_obj=data_obj, customer_id=current_user.id
    )


@router.put("/", response_model=CartUpdateReturn)
async def update_cart(
    data_obj: CartUpdate,
    cart_service: CartService = Depends(get_cart_service),
    current_user: User = Depends(get_current_user),
):
    """Update cart item quantity"""
    return await cart_service.update_cart(
        data_obj=data_obj, customer_id=current_user.id
    )


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_cart_item(
    product_id: str,
    cart_service: CartService = Depends(get_cart_service),
    current_user: User = Depends(get_current_user),
):
    """Remove item from cart"""
    return await cart_service.delete_cart_item(
        product_id=product_id, customer_id=current_user.id
    )


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def clear_cart(
    cart_service: CartService = Depends(get_cart_service),
    current_user: User = Depends(get_current_user),
):
    """Clear all items from cart"""
    await cart_service.clear_cart(customer_id=current_user.id)


@router.get("/summary", response_model=CartSummary)
async def get_cart_summary(
    cart_service: CartService = Depends(get_cart_service),
    current_user: User = Depends(get_current_user),
):
    """Get cart summary for authenticated user"""
    return await cart_service.get_cart_summary(customer_id=current_user.id)


@router.get("/items")
async def get_cart_items(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all cart items for authenticated user"""
    cart_items = db.query(Cart).filter(Cart.customer_id == current_user.id).all()
    
    items = []
    for cart_item in cart_items:
        deal = db.query(Deal).filter(Deal.id == cart_item.product_id).first()
        if deal:
            items.append({
                "id": cart_item.id,
                "product_id": cart_item.product_id,
                "title": deal.title,
                "restaurant_name": deal.restaurant_name,
                "price": deal.price,
                "quantity": cart_item.quantity,
                "total": deal.price * cart_item.quantity,
                "image_url": deal.image_url,
            })
    
    return {
        "items": items,
        "total_items": sum(item["quantity"] for item in items),
        "total_amount": sum(item["total"] for item in items)
    }


@router.post("/checkout")
async def checkout_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Checkout cart for authenticated user"""
    customer_id = current_user.id
    
    # Get Cart Items
    cart_items = db.query(Cart).filter(Cart.customer_id == customer_id).all()

    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total_amount = 0
    order_items_data = []
    
    for cart_item in cart_items:
        deal = db.query(Deal).filter(Deal.id == cart_item.product_id).first()
        
        if not deal:
            raise HTTPException(status_code=400, detail=f"Deal {cart_item.product_id} not found")

        if deal.quantity < cart_item.quantity:
            raise HTTPException(
                status_code=400, 
                detail=f"Insufficient quantity for {deal.title}. Only {deal.quantity} available."
            )

        total_amount += deal.price * cart_item.quantity
        order_items_data.append({
            "deal": deal,
            "quantity": cart_item.quantity,
            "price": deal.price
        })

    try: 
        # Create order
        order = Order(
            customer_id=customer_id,
            payment_ref=f"pay_{customer_id}_{int(datetime.utcnow().timestamp())}",
            total_amount=total_amount,
            status='confirmed',  # Changed from 'pending' to 'confirmed' for demo
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        db.add(order)
        db.flush()

        # Create order items and update deal quantities
        for item_data in order_items_data:
            deal = item_data["deal"]
            
            order_item = OrderItem(
                order_id=order.id,
                product_id=deal.id,
                quantity=item_data["quantity"],
                price=item_data["price"]
            )
            db.add(order_item)

            # Update deal quantity
            deal.quantity -= item_data["quantity"]
            if deal.quantity <= 0:
                deal.is_active = False

        # Clear cart
        db.query(Cart).filter(Cart.customer_id == customer_id).delete()

        db.commit()
        
        return {
            "message": "Order created successfully!",
            "order_id": order.id,
            "payment_ref": order.payment_ref,
            "total_amount": total_amount,
            "status": order.status
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Order creation failed: {str(e)}")


# ============================================
# ORDER ENDPOINTS
# ============================================

@router.get("/orders")
async def get_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get all orders for authenticated user"""
    orders = db.query(Order).filter(Order.customer_id == current_user.id).order_by(Order.created_at.desc()).all()
    
    result = []
    for order in orders:
        order_items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
        
        items = []
        for item in order_items:
            deal = db.query(Deal).filter(Deal.id == item.product_id).first()
            items.append({
                "product_id": item.product_id,
                "title": deal.title if deal else "Unknown",
                "restaurant_name": deal.restaurant_name if deal else "Unknown",
                "quantity": item.quantity,
                "price": item.price,
                "total": item.price * item.quantity,
                "image_url": deal.image_url if deal else None,
            })
        
        result.append({
            "id": order.id,
            "payment_ref": order.payment_ref,
            "total_amount": order.total_amount,
            "status": order.status,
            "created_at": order.created_at.isoformat() if order.created_at else None,
            "items": items
        })
    
    return result


@router.get("/verify-payment/{payment_ref}", response_model=PaymentVerified)
async def verify_order_payment(
    payment_ref: str,
    cart_service: CartService = Depends(get_cart_service),
):
    """Verify payment status for an order"""
    return await cart_service.verify_order_payment(payment_ref=payment_ref)
