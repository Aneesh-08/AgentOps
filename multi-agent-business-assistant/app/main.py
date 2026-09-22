# from fastapi import FastAPI
# from pydantic import BaseModel, Field

# from app.tools.pricing_tools import calculate_price


# app = FastAPI(
#     title="Multi-Agent Business Assistant",
#     description="E-commerce AI business assistant",
#     version="1.0.0",
# )


# class PricingRequest(BaseModel):

#     product_name: str

#     quantity: int = Field(
#         gt=0,
#         description="Number of products.",
#     )

#     discount_percent: float | None = Field(
#         default=None,
#         ge=0,
#         le=100,
#         description=(
#             "Optional custom discount. "
#             "If omitted, volume pricing is used."
#         ),
#     )

#     tax_percent: float = Field(
#         default=18,
#         ge=0,
#         description="Tax percentage.",
#     )


# @app.get("/")
# def home():

#     return {
#         "message": "Multi-Agent Business Assistant is running"
#     }


# @app.post("/pricing/calculate")
# def pricing(request: PricingRequest):

#     return calculate_price(
#         product_name=request.product_name,
#         quantity=request.quantity,
#         discount_percent=request.discount_percent,
#         tax_percent=request.tax_percent,
#     )



import asyncio

from dotenv import load_dotenv

from app.agents.inventory_agent import create_inventory_agent


load_dotenv()


async def main():

    agent = create_inventory_agent()

    print("=" * 55)
    print("E-COMMERCE INVENTORY AGENT")
    print("Type 'exit' to stop")
    print("=" * 55)

    while True:

        user_input = input("\nYou: ")

        if user_input.lower() in {"exit", "quit"}:
            print("\nInventory Agent stopped.")
            break

        try:
            result = await agent.run(user_input)

            print(f"\nInventory Agent: {result.text}")

        except Exception as error:
            print(f"\nError: {error}")


if __name__ == "__main__":
    asyncio.run(main())