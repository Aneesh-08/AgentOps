from app.tools.pricing_tools import (
    get_product_price,
    get_discount_rule,
    calculate_price,
)


def test_product_price():

    result = get_product_price(
        "wireless keyboard"
    )

    assert result["success"] is True
    assert result["unit_price"] == 1200.0


def test_plural_product_name():

    result = get_product_price(
        "wireless keyboards"
    )

    assert result["success"] is True
    assert result["product"] == "wireless keyboard"


def test_discount_1_to_9():

    result = get_discount_rule(
        "wireless keyboard",
        5,
    )

    assert result["success"] is True
    assert result["discount_percent"] == 0.0


def test_discount_10_to_49():

    result = get_discount_rule(
        "wireless keyboard",
        20,
    )

    assert result["success"] is True
    assert result["discount_percent"] == 5.0


def test_discount_50_to_99():

    result = get_discount_rule(
        "wireless keyboard",
        50,
    )

    assert result["success"] is True
    assert result["discount_percent"] == 10.0


def test_discount_100_plus():

    result = get_discount_rule(
        "wireless keyboard",
        100,
    )

    assert result["success"] is True
    assert result["discount_percent"] == 15.0


def test_final_price():

    result = calculate_price(
        product_name="wireless keyboard",
        quantity=50,
        tax_percent=18,
    )

    assert result["success"] is True

    assert result["unit_price"] == 1200.0
    assert result["subtotal"] == 60000.0
    assert result["discount_percent"] == 10.0
    assert result["discount_amount"] == 6000.0
    assert result["taxable_amount"] == 54000.0
    assert result["tax_amount"] == 9720.0
    assert result["final_total"] == 63720.0


def test_unknown_product():

    result = calculate_price(
        product_name="iphone",
        quantity=10,
    )

    assert result["success"] is False


def test_invalid_quantity():

    result = calculate_price(
        product_name="wireless keyboard",
        quantity=0,
    )

    assert result["success"] is False