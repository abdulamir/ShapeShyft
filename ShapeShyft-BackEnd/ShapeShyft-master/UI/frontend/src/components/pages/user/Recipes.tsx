import React, { useContext, useEffect, useState } from "react";
import Popup from "../../recipes/Popup";
import { UserContext } from "../../ContentRouter";
import { GET } from "../../../composables/api";
import file from "../../../composables/urls.json";

interface Recipe {
  name: string;
  image: string;
  description: string;
  ingredients: string;
  instructions: string;
  nutInfo: {
    cals: string;
    carbs: string;
    fat: string;
    protein: string;
  };
}

export function Recipes() {
  const { login } = useContext(UserContext);

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");

  const openPopup = (index: number) => {
    setPopupOpen(true);
    setSelectedRecipeIndex(index);
  };

  const closePopup = () => {
    setPopupOpen(false);
    setSelectedRecipeIndex(null);
  };

  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await GET(file.getRecipe + "?query=" + searchText, login);
      setRecipes(response.items);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="flex flex-row justify-between items-center mb-5">
        <h1 className="text-3xl font-bold">Recipes</h1>
        <div className="flex">
          <input
            type="text"
            placeholder="Find a Recipe"
            value={searchText}
            onChange={handleSearchTextChange}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent mr-2"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer"
          >
            Search
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-center text-gray-600">Loading recipes...</div>
      ) : recipes.length === 0 ? (
        <div className="text-center text-gray-600">No recipes found.</div>
      ) : (
        <div className="flex flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {recipes.map((recipe, index) => (
            <div
              key={index}
              onClick={() => openPopup(index)}
              className="rounded-xl overflow-hidden shadow-[0px_0px_10px_rgba(0,0,0,0.2)] hover:shadow-[0px_0px_15px_rgba(0,0,0,0.3)] cursor-pointer bg-gray-300 flex flex-col"
            >
              <img
                src={recipe.image}
                alt={recipe.name}
                className="w-full h-40 object-cover rounded-t-md"
              />
              <div className="bg-opacity-80 bg-black p-2 text-white flex-grow flex flex-col justify-center">
                <div className="text-base font-bold text-center">{recipe.name}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {popupOpen && <Popup onClose={closePopup} index={selectedRecipeIndex} recipes={recipes} />}
    </div>
  );
}

export default Recipes;