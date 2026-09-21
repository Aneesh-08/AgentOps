import os

from agent_framework import Agent, tool
from agent_framework.foundry import FoundryChatClient
from azure.identity import AzureCliCredential

from tools.logistics_tools import (
    get_order_details,
    estimate_delivery,
    get_shipping_cost
)


@tool(approval_mode="never_require")
def order_lookup(order_id: str) -> str:
    """
    Find an e-commerce order using its order ID.
    """

    result = get_order_details(order_id)

    return str(result)


@tool(approval_mode="never_require")
def delivery_estimator(order_id: str) -> str:
    """
    Estimate the delivery date and status of an order.
    """

    result = estimate_delivery(order_id)

    return str(result)


@tool(approval_mode="never_require")
def shipping_calculator(order_id: str) -> str:
    """
    Get the shipping cost of an order.
    """

    result = get_shipping_cost(order_id)

    return str(result)


logistics_agent = Agent(
    client=FoundryChatClient(
        project_endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"],
        model=os.environ["FOUNDRY_MODEL"],
        credential=AzureCliCredential(),
    ),

    name="LogisticsAgent",

    instructions="""
You are the Logistics Agent for an e-commerce business.

Your responsibilities are:

1. Check order details.
2. Estimate delivery dates.
3. Check order shipping status.
4. Calculate shipping costs.
5. Identify delayed orders.

IMPORTANT RULES:

- Never invent order information.
- Always use the available tools when answering questions about actual orders.
- If an order does not exist, clearly say that it was not found.
- Return concise and structured answers.
- Currency is INR.
- If the user asks about delivery, use the delivery estimator.
- If the user asks about shipping cost, use the shipping calculator.
""",

    tools=[
        order_lookup,
        delivery_estimator,
        shipping_calculator
    ]
)