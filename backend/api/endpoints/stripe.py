from fastapi import APIRouter, Depends
from services.cart_service import CartService
from api.dependencies.services import get_cart_service
from schemas import PaymentVerified


router = APIRouter(prefix="/stripe", tags=["Stripe"])


@router.get("/verify/{session_id}", response_model=PaymentVerified)
async def verify_stripe_payment(
    session_id: str,
    cart_service: CartService = Depends(get_cart_service),
):
    """Verify Stripe payment after checkout session completion"""
    return await cart_service.verify_stripe_payment(session_id=session_id)