from fastapi import APIRouter, HTTPException, Security
from app.schemas.food import (
    Food,
    FoodSearchResponse,
    FoodCreateRequest,
    FoodModel as FoodModelSchema,
    CalorieModel as CalorieModelSchema,
    MealModel as MealModelSchema,
    TotalCaloriesResponse,
    CaloriePredictionResponse,
    PredictCaloriesRequest,
    MealPlan,
    MealRecommendationResponse,
)
from typing import Annotated
from app.services.auth.utils import get_current_user
from app.models.food import (
    FoodType,
    Food as FoodModel,
    Calories as CalorieModel,
    Meals as MealModel,
)
from app.utils.response import responses
from app.utils.exception import ShapeShyftException
from app.services.auth import hash_password
from app.services.predictions.meal_recommender import meal_recommendor
from fatsecret import Fatsecret
from app.models.user import UserAccount
from decimal import Decimal
from datetime import datetime
from app.services.predictions import Calorie_Intake
import pytz

fs = Fatsecret("0047da412ebd469c9dd1895c7d3159d8", "2f91d6bcbaa94e72bea327eb4d6b0546")
# create a search endpoint

router = APIRouter(
    tags=["Food & Calories"],
)


# create foood
@router.post("/", response_model=FoodModelSchema, responses=responses)
async def create_food_for_user(
    data: FoodCreateRequest, current_user: UserAccount = Security(get_current_user)
):
    """
    This endpoint creates a food item for the user
    """
    # get today's date from system
    date = datetime.now(pytz.timezone('America/Toronto')).strftime("%Y-%m-%d")
    food = await FoodModel.create(**data.dict(), user=current_user, date=date)
    return food


# delete food by uuid
@router.delete("/{uuid}", response_model=FoodModelSchema, responses=responses)
async def delete_food_by_uuid(
    uuid: str, current_user: UserAccount = Security(get_current_user)
):
    """
    This endpoint deletes a food item by uuid
    """
    food = await FoodModel.filter(uuid=uuid, user=current_user).first()
    if food:
        await food.delete()
        return food
    else:
        raise ShapeShyftException("E1023", 400)




@router.post("/createMealEntry", response_model=MealModelSchema, responses=responses)
async def create_meal_plan_for_user(
    data: MealPlan, current_user: UserAccount = Security(get_current_user)
):
    """
    This endpoint creates a meal plan entry for the user
    """
    meal = await MealModel.create(**data.dict(), user=current_user)
    return meal



@router.get(
    "/mealRecommendaton", response_model=MealRecommendationResponse, responses=responses
)
async def recommend_meals(calories: int):
    """
    This endpoint returns a meal plan recommendation for the user
    """
    if calories <= 9000 and calories >= 400:
        meals = meal_recommendor.recommend_meal(calories)
        calories = meals["calorie_intake"]
        breakfast = meals["meals"]["breakfast"]
        lunch = meals["meals"]["lunch"]
        dinner = meals["meals"]["dinner"]
        snack = meals["meals"]["snacks"]
        return {
            "breakfast": breakfast,
            "lunch": lunch,
            "dinner": dinner,
            "snack": snack,
            "calories": str(calories),
        }
    else:
        raise ShapeShyftException("E1055", 400)


@router.get("/getMealRecommendations", responses=responses)
async def get_meal_plan_from_database(
    current_user: UserAccount = Security(get_current_user),
):
    meals = await MealModel.filter(user=current_user)

    return meals


@router.get("/search", response_model=FoodSearchResponse, responses=responses)
async def search_food_database(
    query: str, current_user: UserAccount = Security(get_current_user)
):
    """
    This endpoint searches for food items based on the query string
    """
    foods = fs.foods_search(query)
    foods_array = []
    for food in foods:
        food_description = food["food_description"]
        food_description_array = food_description.split("-")
        unit = food_description_array[0].strip()
        food_nutrients = food_description_array[1].split("|")
        calories = food_nutrients[0].strip().split(":")[1].strip()[:-4]
        fat = food_nutrients[1].strip().split(":")[1].strip()[:-1]
        carbs = food_nutrients[2].strip().split(":")[1].strip()[:-1]
        protein = food_nutrients[3].strip().split(":")[1].strip()[:-1]

        link = food["food_url"]
        name = food["food_name"]
        food = Food(
            name=name,
            unit=unit,
            calories=calories,
            fat=fat,
            carbs=carbs,
            protein=protein,
            link=link,
        )
        foods_array.append(food)

    foods = FoodSearchResponse(items=foods_array)
    return foods


# get sum of all calories for user
@router.get("/totalCalories", response_model=TotalCaloriesResponse, responses=responses)
async def get_sum_of_calories_for_user(
    current_user: UserAccount = Security(get_current_user),
    date: str = datetime.now(pytz.timezone('America/Toronto')).strftime("%Y-%m-%d"),
):
    """
    This endpoint gets the sum of all calories for the user
    """
    foods = await FoodModel.all().filter(user=current_user, date=date)
    calories = Decimal(0.0)
    for food in foods:
        try:
            calories += Decimal(food.calories) * Decimal(food.number_of_units)
        except Exception as e:
            print(e)
    return TotalCaloriesResponse(total_calories=calories)


# get all by type
@router.get("/{type}", response_model=list[FoodModelSchema], responses=responses)
async def get_food_by_type_for_user(
    type: FoodType,
    current_user: UserAccount = Security(get_current_user),
    date: str = "",
):
    """
    This endpoint gets all food items by type for the user
    """
    if date == "":
        date = datetime.now(pytz.timezone('America/Toronto')).strftime("%Y-%m-%d")
    foods = await FoodModel.all().filter(user=current_user, type=type, date=date)
    return foods
