from pydantic import UUID4, BaseModel, EmailStr, validator, Field


from .general import Response


from tortoise.contrib.pydantic import pydantic_model_creator
from decimal import Decimal

class NutInfo(BaseModel):
    cals: str
    carbs:str
    fat:str
    protein:str

class Recipe(BaseModel):
    name: str
    image: str
    description: str
    ingredients: str
    instructions: str
    nutInfo: NutInfo

class RecipeSearchResponse(Response):
    items: list[Recipe]