import asyncio

from agents.logistics_agent import logistics_agent


async def main():

    result = await logistics_agent.run(
        "Estimate delivery for Order #10482"
    )

    print(result)


if __name__ == "__main__":
    asyncio.run(main())