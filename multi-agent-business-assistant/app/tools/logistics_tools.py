import json
from pathlib import Path
from datetime import datetime


DATA_FILE = Path(__file__).parent.parent / "data" / "orders.json"


def load_orders():
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def get_order_details(order_id: str):
    orders = load_orders()

    for order in orders:
        if order["order_id"] == str(order_id):
            return order

    return {
        "error": f"Order #{order_id} was not found."
    }


def estimate_delivery(order_id: str):
    order = get_order_details(order_id)

    if "error" in order:
        return order

    return {
        "order_id": order["order_id"],
        "location": order["location"],
        "status": order["status"],
        "estimated_delivery": order["estimated_delivery"],
        "message": (
            f"Order #{order['order_id']} is currently "
            f"{order['status']}. Expected delivery is "
            f"{order['estimated_delivery']}."
        )
    }


def get_shipping_cost(order_id: str):
    order = get_order_details(order_id)

    if "error" in order:
        return order

    return {
        "order_id": order["order_id"],
        "shipping_cost": order["shipping_cost"],
        "currency": "INR"
    }
