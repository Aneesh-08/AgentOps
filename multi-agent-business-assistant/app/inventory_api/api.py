from fastapi import Depends, FastAPI, HTTPException
from sqlmodel import Session, select
from sqlalchemy import func

from app.inventory_api.database import (
    create_db_and_tables,
    get_session
)

from app.inventory_api.models import Product


app = FastAPI(
    title="E-Commerce Inventory API",
    description="Inventory management API for the Multi-Agent Business Assistant",
    version="1.0.0"
)


@app.on_event("startup")
def startup():
    create_db_and_tables()


@app.get("/")
def root():
    return {
        "message": "Inventory API is running"
    }


@app.get("/inventory")
def get_all_products(
    session: Session = Depends(get_session)
):
    products = session.exec(
        select(Product)
    ).all()

    return products


@app.get("/inventory/{product_name}")
def get_product(
    product_name: str,
    session: Session = Depends(get_session)
):
    # Normalize the user's input
    requested_name = product_name.strip().lower()

    # Handle simple plural forms
    if requested_name.endswith("s"):
        singular = requested_name[:-1]

        # Check whether the singular form exists
        singular_product = session.exec(
            select(Product).where(
                func.lower(Product.name) == singular
            )
        ).first()

        if singular_product:
            requested_name = singular

    # Case-insensitive database lookup
    product = session.exec(
        select(Product).where(
            func.lower(Product.name) == requested_name
        )
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail=f"Product '{product_name}' not found"
        )

    return product