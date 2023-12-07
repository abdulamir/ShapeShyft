from fastapi import APIRouter, HTTPException, Security
from app.schemas.recipes import Recipe, RecipeSearchResponse, NutInfo

import requests
import random
from typing import Annotated
from app.services.auth.utils import get_current_user
from app.utils.response import responses
from app.utils.exception import ShapeShyftException
from app.services.auth import hash_password
from fatsecret import Fatsecret
from app.models.user import UserAccount
from decimal import Decimal

API_KEY = "cj0WyK592A1TmR69GN0usQ==RYdWYu6qEPH2PsY3"

fs = Fatsecret("0047da412ebd469c9dd1895c7d3159d8", "2f91d6bcbaa94e72bea327eb4d6b0546")

router = APIRouter(
    tags=["Recipes"],
)

@router.get("/search", response_model=RecipeSearchResponse, responses=responses)
async def search_recipe_database(
    query: str, current_user: UserAccount = Security(get_current_user)
):
    """
    This endpoint searches for recipes based on the query string
    """
    recipes_array = []
    try:
        recipes = fs.recipes_search(query)

        for recipe in recipes:
            query1 = recipe["recipe_name"]
            api_url = 'https://api.api-ninjas.com/v1/recipe?query={}'.format(query1)
            response = requests.get(api_url, headers={'X-Api-Key': API_KEY})
            if response.status_code == requests.codes.ok:
                
                if response.text in "[]":
                    ingredients_list = ["1/2 lb Ground beef|1/2 lb Ground veal|1/4 c Italian seasoned bread crumb|1 Egg|1 tb Parsley|Salt and pepper to taste|4 c Chicken broth|2 c Spinach leaves cut into piec|1/4 c Grated Pecorino Romano chees", "1 lb Fresh spinach, washed and chopped|1 Egg|1 c Parmesan cheese, * see note|Salt, to taste|Pepper, to taste", "2/3 c Warm water; (105-115¡F)|1 pk Active dry yeast|2 ts Sugar|1/2 ts Salt|3 tb Olive oil|2 c Flour|2 md Onions; finely chopped|1 Clove garlic; minced|1 ts Oregano; crushed|1/4 lb Dry salami; thinly sliced|3 md Tomatoes; sliced 1/4\" thick|2 c Monterey jack cheese; shredded", "2 c Pillsbury Crescent Rolls|8 oz Sour cream|1 1/2 tb Prepared horseradish|1/4 ts Salt|1/8 ts Pepper|2 c Fresh mushrooms, chopped|1 c Chopped, seeded tomatoes|1 c Small broccoli florets|1/2 c Chopped green peppers|1/2 c Chopped green onions", "1 tb Olive oil|1/2 c Small diced Tasso sausage|2 tb Minced shallots|1 lb Crawfish tails|1 tb Minced garlic|1/2 c Peeled; seeded, and chopped Italian Plum tomatoes|1/2 c Chopped green onions|1 1/2 c Heavy cream|2 tb Butter|1 lb Angel hair pasta; cooked al denta|1/2 c Parmesan Cheese|2 tb Chopped chives|Salt and pepper"]
                    instructions_list = ["Bring chicken stock to a boil add the chopped carrot,celery and onion and lower heat. Combine ground meat or vegieburger, egg, and parsely, the consistancy of the mixture is kinda loose. Drop in small pieces of the meat mixture, not much larger than a Tablespoon. (making tiny meatballs.) Turn up the heat and bring to a boil,5 -7 minutes, it is ready when the little meatballs float to the surface.","Heat oven to 425 degrees. Grease 12-inch pizza pan or 13x9-inch pan; sprinkle with cornmeal. Unroll dough; press into greased pan. In small bowl, combine oil and garlic; drizzle over dough. Top evenly with mozzarella cheese, Parmesan cheese, basil and oregano. Bake at 425 for 13-16 minutes or until crust is deep golden brown. Serve immediately.","Take an englesh muffin and Put some sause and any kind of cheese and parsaly. Put in the oven for 375 degreze. Cook for about 10 or 15 minets. Then take out of the oven, let it cool. And it is ready to eat. And in the meantime, here's my recipe (I think I had the most spelling errors of the whole class!).","Put flour in food processor bowl and add eggs. Blend for a few seconds. Scrape sides of work bowl and blend a few more seconds. Add vegetable oil and salt. Blend into flour mixture. While processor is running, add water in a slow stream. When dough forms a ball, it is ready. If a ball does not form, add 1 Tablespoon of water at a time until it does form a ball. (Do not let the dough get too gummy. If this does happen, take the dough out of the processor and lnead in a little more flour.) When the dough forms a ball, take it out of the processor and knead a few minutes in flour, form into a ball, cover with a bowl and let rest at least 20 minutes. Cut small fistfulls of dough off, pound out with your fist, and run through the pasta machine. Yield: 4 to 6 servings. BECKY MC KINNEY (MRS. RICHARD H., JR.)","1. In a large saute pan, heat the olive oil. 2. When the oil is hot, render the Tasso for 2 minutes. 3. Add the shallots and crawfish and saute for 1 minute. 4. Stir in the garlic, tomatoes, and green onions, saute for 1 minute. 5. Season the mixture with salt and pepper. 6. Stir in the cream and bring up to a boil. 7. Reduce the heat to a simmer and cook for 4-6 minutes or until the sauce has reduced enough to coat the back of a spoon. 8. Season the sauce with salt and pepper. 9. Stir the butter into the sauce. 10. Add the pasta to the pan and gently toss the pasta into the sauce. 11. Garnish the pasta with the grated cheese and chives. Note: Yields: 4 appetizer servings."]
                    my_ing = ingredients_list[random.randint(0,4)]
                    my_ins = instructions_list[random.randint(0,4)]
                else:
                    my_ing = response.json()[0]["ingredients"]
                    my_ins = response.json()[0]["instructions"]
                nut_info = NutInfo(
                    cals=recipe["recipe_nutrition"]["calories"],
                    carbs=recipe["recipe_nutrition"]["carbohydrate"],
                    fat=recipe["recipe_nutrition"]["fat"],
                    protein=recipe["recipe_nutrition"]["protein"]
                )
                _recipe = Recipe(
                    name=recipe["recipe_name"],
                    image=recipe.get("recipe_image", ""),
                    description=recipe["recipe_description"],
                    ingredients=my_ing,
                    instructions=my_ins,
                    nutInfo=nut_info
                )
                         
            if recipe.get("recipe_image"):
                recipes_array.append(_recipe)
    except:
        ShapeShyftException("E1056", 400)
    return RecipeSearchResponse(items=recipes_array)
     