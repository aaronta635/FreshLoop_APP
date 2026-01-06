from crud import CRUDOrder

from models import Order
from schemas.base import OrderStatusEnum


async def check_order_items_and_update_order_status_to_shipped(ctx):
    crud_order: CRUDOrder = ctx["crud_order"]

    orders = await crud_order.get_all_orders()
    processing_orders = [
        order for order in orders
        if order.status == OrderStatusEnum.PROCESSING
    ]

    for order in processing_orders:
        order_items = order.order_items
        if not order_items:
            continue
        
        status = [item.status for item in order_items]

        if OrderStatusEnum.PROCESSING in status or OrderStatusEnum.REFUNDED in status:
            pass
        else:
            await crud_order.update(
                id=order.id, data_obj={Order.STATUS: OrderStatusEnum.SHIPPED}
            )
