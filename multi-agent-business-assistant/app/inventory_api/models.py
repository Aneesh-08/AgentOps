from sqlmodel import Field, SQLModel


class Product(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    name: str = Field(index=True, unique=True)

    stock: int = Field(default=0)

    unit_price: float = Field(default=0.0)