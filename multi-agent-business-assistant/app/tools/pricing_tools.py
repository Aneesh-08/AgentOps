from decimal import Decimal, ROUND_HALF_UP


# ---------------------------------------------------------
# Product Catalog
# ---------------------------------------------------------

PRODUCTS = {
    "wireless keyboard": {
        "price": Decimal("1200.00"),
        "category": "electronics",
    },
    "wireless mouse": {
        "price": Decimal("600.00"),
        "category": "electronics",
    },
    "usb-c hub": {
        "price": Decimal("1500.00"),
        "category": "electronics",
    },
}


# ---------------------------------------------------------
# Product Name Normalization
# ---------------------------------------------------------

def normalize_product_name(product_name: str) -> str:
    """
    Normalize common variations of product names.

    Example:
        "Wireless Keyboard"
        "wireless keyboards"
        " WIRELESS KEYBOARD "

    all become:

        "wireless keyboard"
    """

    name = product_name.strip().lower()

    # Handle simple plural form.
    if name.endswith("s") and name not in PRODUCTS:
        singular = name[:-1]

        if singular in PRODUCTS:
            return singular

    return name


# ---------------------------------------------------------
# Get Product Price
# ---------------------------------------------------------

def get_product_price(product_name: str) -> dict:
    """
    Look up the current product price.
    """

    requested_product = product_name

    product = normalize_product_name(product_name)

    if product not in PRODUCTS:
        return {
            "success": False,
            "requested_product": requested_product,
            "message": (
                f"Product '{requested_product}' was not found "
                "in the catalog."
            ),
        }

    product_data = PRODUCTS[product]

    return {
        "success": True,
        "requested_product": requested_product,
        "product": product,
        "unit_price": float(product_data["price"]),
        "category": product_data["category"],
        "message": (
            f"The current price of {product} is "
            f"₹{product_data['price']:.2f} per unit."
        ),
    }


# ---------------------------------------------------------
# Discount Rules
# ---------------------------------------------------------

def get_discount_rule(product_name: str, quantity: int) -> dict:
    """
    Determine the applicable volume discount.

    Business rules:
        1-9 units    -> 0%
        10-49 units  -> 5%
        50-99 units  -> 10%
        100+ units   -> 15%
    """

    if quantity <= 0:
        return {
            "success": False,
            "message": "Quantity must be greater than zero.",
        }

    product = normalize_product_name(product_name)

    if product not in PRODUCTS:
        return {
            "success": False,
            "product": product_name,
            "message": f"Product '{product_name}' was not found.",
        }

    if quantity >= 100:
        discount_percent = Decimal("15")
        tier = "100+ units"

    elif quantity >= 50:
        discount_percent = Decimal("10")
        tier = "50-99 units"

    elif quantity >= 10:
        discount_percent = Decimal("5")
        tier = "10-49 units"

    else:
        discount_percent = Decimal("0")
        tier = "1-9 units"

    return {
        "success": True,
        "product": product,
        "quantity": quantity,
        "discount_percent": float(discount_percent),
        "pricing_tier": tier,
        "message": (
            f"Quantity {quantity} qualifies for the "
            f"{tier} pricing tier with a "
            f"{discount_percent}% discount."
        ),
    }


# ---------------------------------------------------------
# Final Price Calculation
# ---------------------------------------------------------

def calculate_price(
    product_name: str,
    quantity: int,
    discount_percent: float | None = None,
    tax_percent: float = 18,
) -> dict:
    """
    Calculate the final product price.

    If discount_percent is not provided, the applicable
    volume discount is automatically determined.
    """

    if quantity <= 0:
        return {
            "success": False,
            "message": "Quantity must be greater than zero.",
        }

    if tax_percent < 0:
        return {
            "success": False,
            "message": "Tax percentage cannot be negative.",
        }

    requested_product = product_name
    product = normalize_product_name(product_name)

    if product not in PRODUCTS:
        return {
            "success": False,
            "requested_product": requested_product,
            "message": (
                f"Product '{requested_product}' was not found."
            ),
        }

    unit_price = PRODUCTS[product]["price"]

    # Automatically determine discount when the caller
    # does not provide one.
    if discount_percent is None:

        discount_result = get_discount_rule(
            product_name=product,
            quantity=quantity,
        )

        if not discount_result["success"]:
            return discount_result

        discount_percent = discount_result["discount_percent"]

        pricing_tier = discount_result["pricing_tier"]

    else:

        if discount_percent < 0 or discount_percent > 100:
            return {
                "success": False,
                "message": (
                    "Discount percentage must be between "
                    "0 and 100."
                ),
            }

        pricing_tier = "custom discount"

    # Convert all financial values to Decimal.
    quantity_decimal = Decimal(str(quantity))
    discount = Decimal(str(discount_percent))
    tax = Decimal(str(tax_percent))

    # Subtotal
    subtotal = unit_price * quantity_decimal

    # Discount
    discount_amount = (
        subtotal * discount / Decimal("100")
    )

    # Amount after discount
    taxable_amount = subtotal - discount_amount

    # Tax
    tax_amount = (
        taxable_amount * tax / Decimal("100")
    )

    # Final total
    final_total = taxable_amount + tax_amount

    # Round monetary values.
    subtotal = subtotal.quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )

    discount_amount = discount_amount.quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )

    taxable_amount = taxable_amount.quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )

    tax_amount = tax_amount.quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )

    final_total = final_total.quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP,
    )

    return {
        "success": True,
        "requested_product": requested_product,
        "product": product,
        "quantity": quantity,
        "unit_price": float(unit_price),
        "subtotal": float(subtotal),
        "discount_percent": float(discount),
        "discount_amount": float(discount_amount),
        "pricing_tier": pricing_tier,
        "tax_percent": float(tax),
        "tax_amount": float(tax_amount),
        "taxable_amount": float(taxable_amount),
        "final_total": float(final_total),
        "currency": "INR",
    }