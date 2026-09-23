import json
from pathlib import Path


PRICING_FILE = (
    Path(__file__).resolve().parent.parent / "data" / "pricing.json"
)


def load_pricing_data():
    with open(PRICING_FILE, "r", encoding="utf-8") as file:
        return json.load(file)


def get_product_price(product_name: str) -> dict:
    """
    Get product price from pricing.json.
    """

    data = load_pricing_data()

    requested_name = product_name.strip().lower()

    for product in data["products"]:
        if product["name"].strip().lower() == requested_name:
            return {
                "success": True,
                "product": product["name"],
                "unit_price": product["unit_price"]
            }

    return {
        "success": False,
        "message": f"Product '{product_name}' not found."
    }


def get_discount_rule(
    product_name: str,
    quantity: int
) -> dict:
    """
    Get the applicable discount from pricing.json.
    """

    data = load_pricing_data()

    product_exists = any(
        product["name"].strip().lower() == product_name.strip().lower()
        for product in data["products"]
    )

    if not product_exists:
        return {
            "success": False,
            "message": f"Product '{product_name}' not found."
        }

    applicable_discount = 0

    for rule in data["discount_rules"]:
        if quantity >= rule["min_quantity"]:
            applicable_discount = rule["discount_percent"]

    return {
        "success": True,
        "product": product_name,
        "quantity": quantity,
        "discount_percent": applicable_discount
    }


def calculate_price(
    product_name: str,
    quantity: int,
    discount_percent=None,
    tax_percent=None
) -> dict:
    """
    Calculate final price using product and discount data
    from pricing.json.
    """

    data = load_pricing_data()

    product = None

    for item in data["products"]:
        if item["name"].strip().lower() == product_name.strip().lower():
            product = item
            break

    if product is None:
        return {
            "success": False,
            "message": f"Product '{product_name}' not found."
        }

    unit_price = product["unit_price"]

    # Get automatic discount from JSON
    if discount_percent is None:
        discount_percent = 0

        for rule in data["discount_rules"]:
            if quantity >= rule["min_quantity"]:
                discount_percent = rule["discount_percent"]

    # Get tax from JSON if not explicitly provided
    if tax_percent is None:
        tax_percent = data["tax_percent"]

    subtotal = unit_price * quantity

    discount_amount = subtotal * (discount_percent / 100)

    taxable_amount = subtotal - discount_amount

    tax_amount = taxable_amount * (tax_percent / 100)

    final_total = taxable_amount + tax_amount

    return {
        "success": True,
        "product": product["name"],
        "quantity": quantity,
        "unit_price": unit_price,
        "subtotal": subtotal,
        "discount_percent": discount_percent,
        "discount_amount": discount_amount,
        "taxable_amount": taxable_amount,
        "tax_percent": tax_percent,
        "tax_amount": tax_amount,
        "final_total": final_total
    }