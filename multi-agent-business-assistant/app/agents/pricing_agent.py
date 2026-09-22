import json
import os

from dotenv import load_dotenv
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

from azure.ai.projects.models import (
    PromptAgentDefinition,
    FunctionTool,
)

from openai.types.responses.response_input_param import (
    FunctionCallOutput,
)

from app.tools.pricing_tools import (
    get_product_price,
    get_discount_rule,
    calculate_price,
)

# ENVIRONMENT

load_dotenv()

PROJECT_ENDPOINT = os.getenv("FOUNDRY_PROJECT_ENDPOINT")
FOUNDRY_MODEL_NAME = os.getenv("FOUNDRY_MODEL_NAME")

# The name of our Pricing Agent in Microsoft Foundry
PRICING_AGENT_NAME = "pricing-agent"


if not PROJECT_ENDPOINT:
    raise ValueError(
        "FOUNDRY_PROJECT_ENDPOINT is missing from .env"
    )

if not FOUNDRY_MODEL_NAME:
    raise ValueError(
        "FOUNDRY_MODEL_NAME is missing from .env"
    )

# AZURE / MICROSOFT FOUNDRY CONNECTION

credential = DefaultAzureCredential()

project_client = AIProjectClient(
    endpoint=PROJECT_ENDPOINT,
    credential=credential,
)

openai_client = project_client.get_openai_client()


# TOOL 1: GET PRODUCT PRICE

get_product_price_tool = FunctionTool(
    name="get_product_price",

    description=(
        "Get the current unit price and product information "
        "for a product from the e-commerce product catalog."
    ),

    parameters={
        "type": "object",

        "properties": {
            "product_name": {
                "type": "string",
                "description": "Name of the product.",
            }
        },

        "required": [
            "product_name"
        ],

        "additionalProperties": False,
    },

    strict=True,
)


# TOOL 2: GET DISCOUNT RULE

get_discount_rule_tool = FunctionTool(
    name="get_discount_rule",

    description=(
        "Determine the applicable volume discount based "
        "on the product and requested quantity."
    ),

    parameters={
        "type": "object",

        "properties": {
            "product_name": {
                "type": "string",
                "description": "Name of the product.",
            },

            "quantity": {
                "type": "integer",
                "description": "Number of units requested.",
            },
        },

        "required": [
            "product_name",
            "quantity",
        ],

        "additionalProperties": False,
    },

    strict=True,
)


# TOOL 3: CALCULATE FINAL PRICE

calculate_price_tool = FunctionTool(
    name="calculate_price",

    description=(
        "Calculate the exact final product price including "
        "subtotal, discount, taxable amount, tax, and final total."
    ),

    parameters={
        "type": "object",

        "properties": {
            "product_name": {
                "type": "string",
                "description": "Name of the product.",
            },

            "quantity": {
                "type": "integer",
                "description": "Number of units.",
            },

            "discount_percent": {
                "type": [
                    "number",
                    "null"
                ],
                "description": (
                    "Discount percentage. Use null when the "
                    "automatic volume discount should be used."
                ),
            },

            "tax_percent": {
                "type": "number",
                "description": (
                    "Tax percentage. Use 18 for GST when "
                    "the user does not specify another rate."
                ),
            },
        },

        "required": [
            "product_name",
            "quantity",
            "discount_percent",
            "tax_percent",
        ],

        "additionalProperties": False,
    },

    strict=True,
)


# ALL TOOLS

TOOLS = [
    get_product_price_tool,
    get_discount_rule_tool,
    calculate_price_tool,
]


# EXECUTE PYTHON TOOL

def execute_tool(
    tool_name: str,
    arguments: dict,
) -> dict:

    if tool_name == "get_product_price":

        return get_product_price(
            product_name=arguments["product_name"]
        )

    if tool_name == "get_discount_rule":

        return get_discount_rule(
            product_name=arguments["product_name"],
            quantity=arguments["quantity"],
        )

    if tool_name == "calculate_price":

        return calculate_price(
            product_name=arguments["product_name"],
            quantity=arguments["quantity"],
            discount_percent=arguments["discount_percent"],
            tax_percent=arguments["tax_percent"],
        )

    return {
        "success": False,
        "message": f"Unknown tool: {tool_name}",
    }


# CREATE PRICING AGENT

def create_pricing_agent():

    agent = project_client.agents.create_version(

        agent_name=PRICING_AGENT_NAME,

        definition=PromptAgentDefinition(

            # Model comes from .env
            model=FOUNDRY_MODEL_NAME,

            instructions="""
You are an AI Pricing Specialist for an e-commerce business.

Your job is to understand natural-language pricing requests,
use the available pricing tools, and provide a clear,
professional and user-friendly pricing response.

============================================================
CORE BEHAVIOR
============================================================

1. Never invent product prices.

2. Use get_product_price whenever product pricing information
   is required.

3. Use get_discount_rule when determining the applicable
   volume discount.

4. Use calculate_price for exact financial calculations.

5. Do not perform complex monetary arithmetic yourself when
   calculate_price can perform it.

6. If the user has not provided enough information to calculate
   a price, ask a short clarification question.

7. Understand natural variations in product names.

8. Never invent information that was not returned by a tool.

9. Python tools are the source of truth for:
   - Product prices
   - Discount rules
   - Financial calculations


============================================================
RESPONSE STYLE
============================================================

Make the final response feel like a professional e-commerce
pricing assistant, not a programmer or debugging tool.

Do NOT expose:
- Tool names
- Function names
- JSON
- Python code
- Internal reasoning
- Agent version
- Technical implementation details

Only show the useful business result to the customer.


============================================================
PRICE RESPONSE FORMAT
============================================================

When a price has been successfully calculated, use this
general structure:

🛒 Pricing Quote

**[Product Name]**

Quantity: [quantity] units

────────────────────────
Unit price:       ₹X,XXX.XX
Subtotal:         ₹X,XXX.XX
Discount:         -₹X,XXX.XX
Taxable amount:    ₹X,XXX.XX
GST ([rate]%):     ₹X,XXX.XX
────────────────────────
**Total:          ₹X,XXX.XX**
────────────────────────

Then provide a short explanation such as:

💡 Your order qualifies for a [X]% volume discount
because it contains [quantity] units.

Do not repeat information unnecessarily.


============================================================
CURRENCY FORMATTING
============================================================

Use Indian Rupee formatting.

Examples:

₹1,200.00
₹12,500.00
₹1,20,000.00

Always include the ₹ symbol for INR amounts.

Do not display raw floating-point values such as:

1200.0
63720.0

Instead display:

₹1,200.00
₹63,720.00


============================================================
WHEN INFORMATION IS MISSING
============================================================

If the user says:

"How much will it cost?"

Do not guess.

Ask:

"Sure! Which product and quantity would you like me
to price?"


============================================================
WHEN A PRODUCT IS NOT FOUND
============================================================

If the product does not exist in the catalog, respond
politely.

Example:

"I couldn't find 'iPhone' in the current product catalog.
Please provide another product name."


============================================================
WHEN THE USER ASKS A SIMPLE QUESTION
============================================================

Do not produce an unnecessarily large response.

For example:

User:
"What is the price of a wireless keyboard?"

Respond naturally:

"The current price of a wireless keyboard is ₹1,200.00
per unit."

Use get_product_price to obtain the price.


============================================================
WHEN THE USER ASKS FOR A COMPLETE QUOTE
============================================================

Provide the complete pricing breakdown.

Example:

User:
"I need 50 wireless keyboards. What is the final price
including GST?"

Return a clean pricing quote with:

- Product
- Quantity
- Unit price
- Subtotal
- Discount
- Taxable amount
- GST
- Final total

Finish with a short helpful explanation.


============================================================
IMPORTANT
============================================================

You are an AI pricing assistant.

Your role is to:
1. Understand the user's request.
2. Determine what information is needed.
3. Select and call the appropriate tools.
4. Use tool results as the source of truth.
5. Present the final result in a clear,
   friendly and professional format.

Never expose internal tool execution to the customer.
""",

            tools=TOOLS,
        ),
    )

    return agent


# RUN PRICING AGENT

def run_pricing_agent(user_message: str):

    # Create / update the agent version
    agent = create_pricing_agent()

    print("Pricing Agent created successfully.")
    print(f"Agent name: {PRICING_AGENT_NAME}")
    print(f"Agent version: {agent.version}")
    print(f"Model: {FOUNDRY_MODEL_NAME}")

    # Send user's request to the agent
    response = openai_client.responses.create(

        input=user_message,

        extra_body={
            "agent_reference": {
                "name": PRICING_AGENT_NAME,
                "type": "agent_reference",
                "version": agent.version,
            }
        },
    )

    # TOOL-CALLING LOOP

    while True:

        function_calls = [
            item
            for item in response.output
            if item.type == "function_call"
        ]

        # No more tools required
        if not function_calls:
            break

        tool_outputs = []

        for call in function_calls:

            print("\nAI requested tool:")
            print(call.name)

            # Convert JSON string to Python dictionary
            arguments = json.loads(call.arguments)

            print("\nArguments:")
            print(
                json.dumps(
                    arguments,
                    indent=2,
                )
            )

            # Execute the corresponding Python function
            result = execute_tool(
                tool_name=call.name,
                arguments=arguments,
            )

            print("\nPython tool result:")
            print(
                json.dumps(
                    result,
                    indent=2,
                )
            )

            # Send the tool result back to the AI agent
            tool_outputs.append(
                FunctionCallOutput(
                    type="function_call_output",
                    call_id=call.call_id,
                    output=json.dumps(result),
                )
            )

        # Ask the agent to continue using the tool results
        response = openai_client.responses.create(

            input=tool_outputs,

            previous_response_id=response.id,

            extra_body={
                "agent_reference": {
                    "name": PRICING_AGENT_NAME,
                    "type": "agent_reference",
                    "version": agent.version,
                }
            },
        )

    # FINAL RESPONSE

    print("\n" + "=" * 60)
    print("FINAL PRICING AGENT RESPONSE")
    print("=" * 60)

    print(response.output_text)

    return response.output_text


# MAIN

if __name__ == "__main__":

    user_request = ( 
        "How much would I pay for twenty wireless keyboards including GST?"
    )

    run_pricing_agent(user_request)