import React from "react";
import { UserFoodItemProps } from "../pages/user/FoodAndCalories";

interface FoodItemProps extends UserFoodItemProps {
  onDelete: () => void;
}

export const FoodItem = (props: FoodItemProps) => {
  const totalCalories = props.calories * props.number_of_units;
  return (
    <div className="relative flex items-center justify-between bg-white p-3 rounded-lg shadow-md my-2 hover:bg-red-200">
      <div className="flex flex-col">
        <p className="text-lg font-semibold">{props.name}</p>
        <p className="text-sm text-gray-500">{props.unit}</p>
        <p className="text-sm text-gray-500">Quantity: {props.number_of_units}</p>
        <div className="text-xs text-gray-600">
          {props.protein !== undefined && (
            <span>Protein: {props.protein}g </span>
          )}
          {props.carbs !== undefined && <span>Carbs: {props.carbs}g </span>}
          {props.fat !== undefined && <span>Fat: {props.fat}g</span>}
        </div>
      </div>
      <div className="text-violet-800 font-bold">{totalCalories} cal</div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100">
        <button
          onClick={props.onDelete}
          className="text-red-500 text-5xl"
          aria-label="Delete"
        >
          &times;
        </button>
      </div>
    </div>
  );
};