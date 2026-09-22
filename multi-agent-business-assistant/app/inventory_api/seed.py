from sqlmodel import Session

from app.inventory_api.database import (
    engine,
    create_db_and_tables
)

from app.inventory_api.models import Product


PRODUCTS = [
    Product(
        name="Wireless Keyboard",
        stock=50,
        unit_price=1200
    ),
    Product(
        name="Wireless Mouse",
        stock=100,
        unit_price=600
    ),
    Product(
        name="USB-C Hub",
        stock=30,
        unit_price=1500
    ),
    Product(
        name="Laptop Stand",
        stock=25,
        unit_price=1800
    )
]


def seed_database():

    create_db_and_tables()

    with Session(engine) as session:

        for product in PRODUCTS:
            session.add(product)

        session.commit()

    print("Database seeded successfully.")


if __name__ == "__main__":
    seed_database()