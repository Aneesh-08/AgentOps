import json
from typing import Annotated

import requests
from agent_framework import tool
from pydantic import Field


INVENTORY_API_URL = "http://127.0.0.1:8000"


@tool(
    name="check_inventory",
    description=(
        "Check the current stock of a product and determine "
        "whether the requested quantity can be fulfilled."
    ),
    approval_mode="never_require"
)
def check_inventory(
    product_name: Annotated[
        str,
        Field(description="Name of the product to check.")
    ],
    quantity: Annotated[
        int,
        Field(
            description="Number of units requested.",
            gt=0
        )
    ]
) -> str:

    try:

        response = requests.get(
            f"{INVENTORY_API_URL}/inventory/{product_name}",
            timeout=5
        )

        if response.status_code == 404:

            return json.dumps({
                "found": False,
                "product": product_name,
                "message": "Product not found in inventory."
            })

        response.raise_for_status()

        product = response.json()

        available_stock = product["stock"]

        return json.dumps({
            "found": True,
            "product": product["name"],
            "requested_quantity": quantity,
            "available_stock": available_stock,
            "can_fulfill": available_stock >= quantity,
            "unit_price": product["unit_price"]
        })

    except requests.RequestException as error:

        return json.dumps({
            "found": False,
            "error": "Inventory API is unavailable.",
            "details": str(error)
        })