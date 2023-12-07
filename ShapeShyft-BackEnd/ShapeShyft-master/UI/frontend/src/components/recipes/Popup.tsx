import React, { useState } from "react";

interface PopupProps {
  onClose: () => void;
  index: number | null;
  recipes: Recipe[];
}

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

export function Popup({ onClose, index, recipes }: PopupProps) {
  const [activeTab, setActiveTab] = useState(0);

  const recipe = recipes[index!];

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center relative max-w-md w-full h-auto overflow-y-auto">
        <span className="absolute top-2 right-2 cursor-pointer text-2xl text-gray-700" onClick={onClose}>
          ×
        </span>
        <div className="flex justify-center items-center mb-4 space-x-4">
          <button
            className={`px-4 py-1 rounded-tl rounded-bl border-b-2 border-l-2 border-r-2 border-t-2 border-gray-300 transition-all duration-300 ${activeTab === 0 ? "bg-gray-200 font-semibold" : "bg-white"}`}
            onClick={() => setActiveTab(0)}
          >
            Recipe
          </button>
          <button
            className={`px-4 py-1 rounded-tr rounded-br border-b-2 border-l-2 border-r-2 border-t-2 border-gray-300 transition-all duration-300 ${activeTab === 1 ? "bg-gray-200 font-semibold" : "bg-white"}`}
            onClick={() => setActiveTab(1)}
          >
            Nutritional Information
          </button>
        </div>
        {activeTab === 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{recipe.name}</h2>
            <img src={recipe.image} alt={recipe.name} className="w-32 h-32 object-cover rounded-full mx-auto mb-4" />
            <div>
              <h3 className="text-xl font-bold mb-2 text-gray-700">Description</h3>
              <p className="text-gray-800">{recipe.description}</p>
              <br></br>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-gray-700">Ingredients</h3>
              <div className="max-h-48 overflow-y-auto">
                <p className="text-gray-800">{recipe.ingredients}</p>
              </div>
              <br></br>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-gray-700">Instructions</h3>
              <div className="max-h-48 overflow-y-auto">
                <p className="text-gray-800">{recipe.instructions}</p>
              </div>
              <br></br>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Nutritional Information</h2>
            <div className="text-left">
              <p className="text-gray-800">Calories: {recipe.nutInfo.cals}</p>
              <p className="text-gray-800">Carbs: {recipe.nutInfo.carbs}g</p>
              <p className="text-gray-800">Fat: {recipe.nutInfo.fat}g</p>
              <p className="text-gray-800">Protein: {recipe.nutInfo.protein}g</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Popup;