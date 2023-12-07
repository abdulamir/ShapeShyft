import requests
import random
import os
from fastapi import APIRouter, Security
from app.services.auth.utils import get_current_user
from app.utils.response import responses
from app.utils.exception import ShapeShyftException
from app.models.exercise import Steps
from app.models.user import UserAccount
from app.schemas.exercise import (
    Exercise,
    ExerciseListResponse,
    StepsResponse,
    CreateStepsEntry,
)

import pytz
from datetime import datetime

API_KEY = "cj0WyK592A1TmR69GN0usQ==RYdWYu6qEPH2PsY3"

router = APIRouter(
    tags=["Exercises"],
)


def get_back_exercises():
    api_url = "https://api.api-ninjas.com/v1/exercises?muscle={}".format("lats")
    response1 = requests.get(api_url, headers={"X-Api-Key": API_KEY})
    api_url = "https://api.api-ninjas.com/v1/exercises?muscle={}".format("lower_back")
    response2 = requests.get(api_url, headers={"X-Api-Key": API_KEY})
    api_url = "https://api.api-ninjas.com/v1/exercises?muscle={}".format("middle_back")
    response3 = requests.get(api_url, headers={"X-Api-Key": API_KEY})
    api_url = "https://api.api-ninjas.com/v1/exercises?muscle={}".format("neck")
    response4 = requests.get(api_url, headers={"X-Api-Key": API_KEY})
    api_url = "https://api.api-ninjas.com/v1/exercises?muscle={}".format("traps")
    response5 = requests.get(api_url, headers={"X-Api-Key": API_KEY})

    if (
        response1.status_code == requests.codes.ok
        and response2.status_code == requests.codes.ok
        and response3.status_code == requests.codes.ok
        and response4.status_code == requests.codes.ok
        and response5.status_code == requests.codes.ok
    ):
        data1 = response1.json()
        data2 = response2.json()
        data3 = response3.json()
        data4 = response4.json()
        data5 = response5.json()

        exercises_array = []
        for e in data1:
            name = e["name"]
            exercise_type = e["type"]
            muscle = e["muscle"]
            equipment = e["equipment"]
            difficulty = e["difficulty"]
            instructions = e["instructions"]

            exercise = Exercise(
                name=name,
                type=exercise_type,
                muscle=muscle,
                equipment=equipment,
                difficulty=difficulty,
                instructions=instructions,
            )
            exercises_array.append(exercise)

        for e in data2:
            name = e["name"]
            exercise_type = e["type"]
            muscle = e["muscle"]
            equipment = e["equipment"]
            difficulty = e["difficulty"]
            instructions = e["instructions"]

            exercise = Exercise(
                name=name,
                type=exercise_type,
                muscle=muscle,
                equipment=equipment,
                difficulty=difficulty,
                instructions=instructions,
            )
            exercises_array.append(exercise)

        for e in data3:
            name = e["name"]
            exercise_type = e["type"]
            muscle = e["muscle"]
            equipment = e["equipment"]
            difficulty = e["difficulty"]
            instructions = e["instructions"]

            exercise = Exercise(
                name=name,
                type=exercise_type,
                muscle=muscle,
                equipment=equipment,
                difficulty=difficulty,
                instructions=instructions,
            )
            exercises_array.append(exercise)

        for e in data4:
            name = e["name"]
            exercise_type = e["type"]
            muscle = e["muscle"]
            equipment = e["equipment"]
            difficulty = e["difficulty"]
            instructions = e["instructions"]

            exercise = Exercise(
                name=name,
                type=exercise_type,
                muscle=muscle,
                equipment=equipment,
                difficulty=difficulty,
                instructions=instructions,
            )
            exercises_array.append(exercise)

        for e in data5:
            name = e["name"]
            exercise_type = e["type"]
            muscle = e["muscle"]
            equipment = e["equipment"]
            difficulty = e["difficulty"]
            instructions = e["instructions"]

            exercise = Exercise(
                name=name,
                type=exercise_type,
                muscle=muscle,
                equipment=equipment,
                difficulty=difficulty,
                instructions=instructions,
            )
            exercises_array.append(exercise)
    else:
        ShapeShyftException("E1024", 400)

    return exercises_array


def get_arms_exercises():
    api_url = "https://api.api-ninjas.com/v1/exercises?muscle={}".format("triceps")
    response1 = requests.get(api_url, headers={"X-Api-Key": API_KEY})
    api_url = "https://api.api-ninjas.com/v1/exercises?muscle={}".format("biceps")
    response2 = requests.get(api_url, headers={"X-Api-Key": API_KEY})
    api_url = "https://api.api-ninjas.com/v1/exercises?muscle={}".format("forearms")
    response3 = requests.get(api_url, headers={"X-Api-Key": API_KEY})

    if (
        response1.status_code == requests.codes.ok
        and response2.status_code == requests.codes.ok
        and response3.status_code == requests.codes.ok
    ):
        data1 = response1.json()
        data2 = response2.json()
        data3 = response3.json()

        exercises_array = []
        for e in data1:
            name = e["name"]
            exercise_type = e["type"]
            muscle = e["muscle"]
            equipment = e["equipment"]
            difficulty = e["difficulty"]
            instructions = e["instructions"]

            exercise = Exercise(
                name=name,
                type=exercise_type,
                muscle=muscle,
                equipment=equipment,
                difficulty=difficulty,
                instructions=instructions,
            )
            exercises_array.append(exercise)

        for e in data2:
            name = e["name"]
            exercise_type = e["type"]
            muscle = e["muscle"]
            equipment = e["equipment"]
            difficulty = e["difficulty"]
            instructions = e["instructions"]

            exercise = Exercise(
                name=name,
                type=exercise_type,
                muscle=muscle,
                equipment=equipment,
                difficulty=difficulty,
                instructions=instructions,
            )
            exercises_array.append(exercise)

        for e in data3:
            name = e["name"]
            exercise_type = e["type"]
            muscle = e["muscle"]
            equipment = e["equipment"]
            difficulty = e["difficulty"]
            instructions = e["instructions"]

            exercise = Exercise(
                name=name,
                type=exercise_type,
                muscle=muscle,
                equipment=equipment,
                difficulty=difficulty,
                instructions=instructions,
            )
            exercises_array.append(exercise)
    else:
        ShapeShyftException("E1024", 400)

    return exercises_array


def get_legs_exercises():
    api_url = "https://api.api-ninjas.com/v1/exercises?muscle={}".format("abductors")
    response1 = requests.get(api_url, headers={"X-Api-Key": API_KEY})
    api_url = "https://api.api-ninjas.com/v1/exercises?muscle={}".format("adductors")
    response2 = requests.get(api_url, headers={"X-Api-Key": API_KEY})
    api_url = "https://api.api-ninjas.com/v1/exercises?muscle={}".format("calves")
    response3 = requests.get(api_url, headers={"X-Api-Key": API_KEY})
    api_url = "https://api.api-ninjas.com/v1/exercises?muscle={}".format("quadriceps")
    response4 = requests.get(api_url, headers={"X-Api-Key": API_KEY})
    api_url = "https://api.api-ninjas.com/v1/exercises?muscle={}".format("glutes")
    response5 = requests.get(api_url, headers={"X-Api-Key": API_KEY})
    api_url = "https://api.api-ninjas.com/v1/exercises?muscle={}".format("hamstrings")
    response6 = requests.get(api_url, headers={"X-Api-Key": API_KEY})

    if (
        response1.status_code == requests.codes.ok
        and response2.status_code == requests.codes.ok
        and response3.status_code == requests.codes.ok
        and response4.status_code == requests.codes.ok
        and response5.status_code == requests.codes.ok
        and response6.status_code == requests.codes.ok
    ):
        data1 = response1.json()
        data2 = response2.json()
        data3 = response3.json()
        data4 = response4.json()
        data5 = response5.json()
        data6 = response6.json()

        exercises_array = []
        for e in data1:
            name = e["name"]
            exercise_type = e["type"]
            muscle = e["muscle"]
            equipment = e["equipment"]
            difficulty = e["difficulty"]
            instructions = e["instructions"]

            exercise = Exercise(
                name=name,
                type=exercise_type,
                muscle=muscle,
                equipment=equipment,
                difficulty=difficulty,
                instructions=instructions,
            )
            exercises_array.append(exercise)

        for e in data2:
            name = e["name"]
            exercise_type = e["type"]
            muscle = e["muscle"]
            equipment = e["equipment"]
            difficulty = e["difficulty"]
            instructions = e["instructions"]

            exercise = Exercise(
                name=name,
                type=exercise_type,
                muscle=muscle,
                equipment=equipment,
                difficulty=difficulty,
                instructions=instructions,
            )
            exercises_array.append(exercise)

        for e in data3:
            name = e["name"]
            exercise_type = e["type"]
            muscle = e["muscle"]
            equipment = e["equipment"]
            difficulty = e["difficulty"]
            instructions = e["instructions"]

            exercise = Exercise(
                name=name,
                type=exercise_type,
                muscle=muscle,
                equipment=equipment,
                difficulty=difficulty,
                instructions=instructions,
            )
            exercises_array.append(exercise)

        for e in data4:
            name = e["name"]
            exercise_type = e["type"]
            muscle = e["muscle"]
            equipment = e["equipment"]
            difficulty = e["difficulty"]
            instructions = e["instructions"]

            exercise = Exercise(
                name=name,
                type=exercise_type,
                muscle=muscle,
                equipment=equipment,
                difficulty=difficulty,
                instructions=instructions,
            )
            exercises_array.append(exercise)

        for e in data5:
            name = e["name"]
            exercise_type = e["type"]
            muscle = e["muscle"]
            equipment = e["equipment"]
            difficulty = e["difficulty"]
            instructions = e["instructions"]

            exercise = Exercise(
                name=name,
                type=exercise_type,
                muscle=muscle,
                equipment=equipment,
                difficulty=difficulty,
                instructions=instructions,
            )
            exercises_array.append(exercise)

        for e in data6:
            name = e["name"]
            exercise_type = e["type"]
            muscle = e["muscle"]
            equipment = e["equipment"]
            difficulty = e["difficulty"]
            instructions = e["instructions"]

            exercise = Exercise(
                name=name,
                type=exercise_type,
                muscle=muscle,
                equipment=equipment,
                difficulty=difficulty,
                instructions=instructions,
            )
            exercises_array.append(exercise)
    else:
        ShapeShyftException("E1024", 400)

    return exercises_array


def get_chest_exercises():
    api_url = "https://api.api-ninjas.com/v1/exercises?muscle={}".format("chest")
    response1 = requests.get(api_url, headers={"X-Api-Key": API_KEY})

    if response1.status_code == requests.codes.ok:
        data1 = response1.json()

        exercises_array = []
        for e in data1:
            name = e["name"]
            exercise_type = e["type"]
            muscle = e["muscle"]
            equipment = e["equipment"]
            difficulty = e["difficulty"]
            instructions = e["instructions"]

            exercise = Exercise(
                name=name,
                type=exercise_type,
                muscle=muscle,
                equipment=equipment,
                difficulty=difficulty,
                instructions=instructions,
            )
            exercises_array.append(exercise)

    else:
        ShapeShyftException("E1024", 400)

    return exercises_array


def get_abs_exercises():
    api_url = "https://api.api-ninjas.com/v1/exercises?muscle={}".format("abdominals")
    response1 = requests.get(api_url, headers={"X-Api-Key": API_KEY})

    if response1.status_code == requests.codes.ok:
        data1 = response1.json()

        exercises_array = []
        for e in data1:
            name = e["name"]
            exercise_type = e["type"]
            muscle = e["muscle"]
            equipment = e["equipment"]
            difficulty = e["difficulty"]
            instructions = e["instructions"]

            exercise = Exercise(
                name=name,
                type=exercise_type,
                muscle=muscle,
                equipment=equipment,
                difficulty=difficulty,
                instructions=instructions,
            )
            exercises_array.append(exercise)
    else:
        ShapeShyftException("E1024", 400)

    return exercises_array


def get_cardio_exercises():
    api_url = "https://api.api-ninjas.com/v1/exercises?type={}".format("cardio")
    response1 = requests.get(api_url, headers={"X-Api-Key": API_KEY})
    api_url = "https://api.api-ninjas.com/v1/exercises?type={}&offset={}".format(
        "cardio", "10"
    )
    response2 = requests.get(api_url, headers={"X-Api-Key": API_KEY})

    if (
        response1.status_code == requests.codes.ok
        and response2.status_code == requests.codes.ok
    ):
        data1 = response1.json()
        data2 = response2.json()

        exercises_array = []
        for e in data1:
            name = e["name"]
            exercise_type = e["type"]
            muscle = e["muscle"]
            equipment = e["equipment"]
            difficulty = e["difficulty"]
            instructions = e["instructions"]

            exercise = Exercise(
                name=name,
                type=exercise_type,
                muscle=muscle,
                equipment=equipment,
                difficulty=difficulty,
                instructions=instructions,
            )
            exercises_array.append(exercise)

        for e in data2:
            name = e["name"]
            exercise_type = e["type"]
            muscle = e["muscle"]
            equipment = e["equipment"]
            difficulty = e["difficulty"]
            instructions = e["instructions"]

            exercise = Exercise(
                name=name,
                type=exercise_type,
                muscle=muscle,
                equipment=equipment,
                difficulty=difficulty,
                instructions=instructions,
            )
            exercises_array.append(exercise)
    else:
        ShapeShyftException("E1024", 400)

    return exercises_array


@router.get(
    "/getExercisesByBodyPart", response_model=ExerciseListResponse, responses=responses
)
async def get_exercises_by_body_part(
    body_part: str, current_user: UserAccount = Security(get_current_user)
):
    """
    This endpoint returns exercises that relate to requested body part
    """
    exercises_array = []
    if body_part.lower() == "back":
        exercises_array = get_back_exercises()
    elif body_part.lower() == "arms":
        exercises_array = get_arms_exercises()
    elif body_part.lower() == "legs":
        exercises_array = get_legs_exercises()
    elif body_part.lower() == "chest":
        exercises_array = get_chest_exercises()
    elif body_part.lower() == "abs":
        exercises_array = get_abs_exercises()
    elif body_part.lower() == "cardio":
        exercises_array = get_cardio_exercises()
    else:
        ShapeShyftException("E1006", 400)

    exs = ExerciseListResponse(items=exercises_array)
    return exs


@router.get(
    "/getExercisesBySearch", response_model=ExerciseListResponse, responses=responses
)
async def get_exercises_by_search(
    query: str, current_user: UserAccount = Security(get_current_user)
):
    """
    This endpoint returns exercises that contain the requested query
    """
    exercises_array = []
    api_url = "https://api.api-ninjas.com/v1/exercises?name={}".format(query)
    response1 = requests.get(api_url, headers={"X-Api-Key": API_KEY})

    if response1.status_code == requests.codes.ok:
        data1 = response1.json()

        for e in data1:
            name = e["name"]
            exercise_type = e["type"]
            muscle = e["muscle"]
            equipment = e["equipment"]
            difficulty = e["difficulty"]
            instructions = e["instructions"]

            exercise = Exercise(
                name=name,
                type=exercise_type,
                muscle=muscle,
                equipment=equipment,
                difficulty=difficulty,
                instructions=instructions,
            )
            exercises_array.append(exercise)
    else:
        ShapeShyftException("E1024", 400)

    if (
        "back" in query.lower()
        or "lats" in query.lower()
        or "neck" in query.lower()
        or "traps" in query.lower()
    ):
        exercises_array += get_back_exercises()
    elif (
        "arms" in query.lower()
        or "triceps" in query.lower()
        or "biceps" in query.lower()
    ):
        exercises_array += get_arms_exercises()
    elif (
        "legs" in query.lower()
        or "abductors" in query.lower()
        or "adductors" in query.lower()
        or "calves" in query.lower()
        or "quad" in query.lower()
        or "glute" in query.lower()
        or "hamstrings" in query.lower()
    ):
        exercises_array += get_legs_exercises()
    elif "chest" in query.lower():
        exercises_array += get_chest_exercises()
    elif "abs" in query.lower():
        exercises_array += get_abs_exercises()
    elif "cardio" in query.lower():
        exercises_array += get_cardio_exercises()

    exs = ExerciseListResponse(items=exercises_array)
    return exs


@router.get(
    "/getRandomExercises", response_model=ExerciseListResponse, responses=responses
)
async def get_random_exercises(current_user: UserAccount = Security(get_current_user)):
    """
    This endpoint returns 20 random exercises
    """
    offset1 = random.randint(0, 50)
    offset2 = random.randint(60, 100)
    api_url = "https://api.api-ninjas.com/v1/exercises?offset={}".format(offset1)
    response = requests.get(api_url, headers={"X-Api-Key": API_KEY})
    api_url2 = "https://api.api-ninjas.com/v1/exercises?offset={}".format(offset2)
    response2 = requests.get(api_url2, headers={"X-Api-Key": API_KEY})

    if (
        response.status_code == requests.codes.ok
        and response2.status_code == requests.codes.ok
    ):
        data = response.json()
        data2 = response2.json()

        exercises_array = []
        for e in data:
            name = e["name"]
            exercise_type = e["type"]
            muscle = e["muscle"]
            equipment = e["equipment"]
            difficulty = e["difficulty"]
            instructions = e["instructions"]

            exercise = Exercise(
                name=name,
                type=exercise_type,
                muscle=muscle,
                equipment=equipment,
                difficulty=difficulty,
                instructions=instructions,
            )
            exercises_array.append(exercise)

        for e in data2:
            name = e["name"]
            exercise_type = e["type"]
            muscle = e["muscle"]
            equipment = e["equipment"]
            difficulty = e["difficulty"]
            instructions = e["instructions"]

            exercise = Exercise(
                name=name,
                type=exercise_type,
                muscle=muscle,
                equipment=equipment,
                difficulty=difficulty,
                instructions=instructions,
            )
            exercises_array.append(exercise)
    else:
        ShapeShyftException("E1024", 400)

    exs = ExerciseListResponse(items=exercises_array)
    return exs


@router.get("/steps", response_model=StepsResponse, responses=responses)
async def get_steps(
    current_user: UserAccount = Security(get_current_user),
    date: str = datetime.now(pytz.timezone('America/Toronto')).strftime("%Y-%m-%d"),
):
    """
    This endpoint returns the number of steps the user has taken for the current day.
    Date param is optional and defaults to the current day. if a date is provided, it will return the steps for that day.
    """
    try:
        steps_log = await Steps.get(user=current_user, date=date)
    except Exception as e:
        steps_log = await Steps.create(user=current_user, date=date, steps=0)

    return steps_log


@router.post("/steps", response_model=StepsResponse, responses=responses)
async def create_steps(
    data: CreateStepsEntry, current_user: UserAccount = Security(get_current_user)
):
    """ 
    This method creates a new steps entry for the user for the current day
    If the user already has a steps entry for the current day, it will update overwriting the previous entry.
    """
    #get today in toronto time  
    today = datetime.now(pytz.timezone('America/Toronto')).strftime("%Y-%m-%d")

    try:
        steps_log = await Steps.get(user=current_user, date=today)
        steps_log.steps = data.steps
        await steps_log.save()
    except Exception as e:
        steps_log = await Steps.create(user=current_user, date=today, steps=data.steps)

    return steps_log
