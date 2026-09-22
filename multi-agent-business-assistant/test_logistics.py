import asyncio # this is python built in lib for async operation 

from app.agents.logistics_agent import logistics_agent

async def main():

    result = await logistics_agent.run(  # this is running this logistics_agent object and giving it the user prompt 
        "what is the shipping cost of order #10482"
    )

    print(result) # print the result 


if __name__ == "__main__":
    asyncio.run(main())