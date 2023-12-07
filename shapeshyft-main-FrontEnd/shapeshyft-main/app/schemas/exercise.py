from pydantic import BaseModel

from .general import Response

from tortoise.contrib.pydantic import pydantic_model_creator
from app.models.exercise import Steps as StepsModel

StepsModel = pydantic_model_creator(StepsModel, name="StepsModel", exclude=["id"])


class Exercise(BaseModel):
    name: str
    type: str
    muscle: str
    equipment: str
    difficulty: str
    instructions: str


class CreateStepsEntry(BaseModel):
    steps: int


class ExerciseListResponse(Response):
    items: list[Exercise]


class StepsResponse(Response, StepsModel):
    pass
