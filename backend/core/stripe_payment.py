import stripe

import logging
from core import settings
from models import Customer, Order

logger = logging.getLogger(__name__)

stripe.api_key = settings.STRIPE_SECRET_KEY


class StripeClient:
    async def create_checkout_session(
        self,
        amount: float,
        email: str,
        order: Order,
        customer: Customer,
        success_url: str,
        cancel_url: str
    ):
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[
                    {
                        "price_data": {
                            "currency": "usd",
                            "product_data": {
                                "name": f"Order #{order.customer_order_number}",
                            },
                            "unit_amount": int(amount * 100),
                        },
                        "quantity": 1,
                    }
                ],

                mode="payment",
                customer_email=email,
                success_url=success_url,
                cancel_url=cancel_url,
                metadata={
                    "order_id": str(order.id),
                    "customer_id": str(customer.id),
                    "pickup_code": order.pickup_code
                },

            )
            return {
                "id": session.id,
                "url": session.url,
                "session_id": session.id,
            }
        except Exception as e:
            logger.error(f"Stripe checkout session creation failed: {e}")
            raise ValueError(f"Stripe payment init failed: {str(e)}")
    

    async def verify_payment(self, session_id: str):

        try:
            session = stripe.checkout.Session.retrieve(session_id)


            if session.payment_status == "paid":
                return {
                    "status": "success",
                    "amount": session.amount_total / 100,
                    "reference": session.payment_intent,
                    "channel": "card",
                    "paid_at": session.payment_intent.created if session.payment_intent else None,
                    "metadata": session.metadata,
                }
            elif session.payment_status == "unpaid":
                return {
                    "status": "abandoned",
                }
            else:
                return {
                    "status": "failed",
                }
        except Exception as e:
            logger.error(f"Stripe payment verification failed: {e}")
            raise ValueError(f"Stripe payment verification failed: {str(e)}")


def get_stripe():
    return StripeClient()