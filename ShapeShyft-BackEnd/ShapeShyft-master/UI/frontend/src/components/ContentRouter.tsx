import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UserLayout from "./pages/UserLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/user/Dashboard";
import FoodAndCalories from "./pages/user/FoodAndCalories";
import Exercise from "./pages/user/Exercise";
import HealthAndWellness from "./pages/user/HealthAndWellness";
import Recipes from "./pages/user/Recipes";
import { ILoginModel, ITokenModel } from "../models/ITokenModel";

const defaultLogin: ITokenModel = {
  success: false,
  access_token: "",
  refresh_token: "",
  token_type: "",
};

export const UserContext = createContext({} as ILoginModel);

export function ContentRouter() {

  const [login, setLogin] = useState(() => {
    const savedLogin = localStorage.getItem('userLogin');
    return savedLogin ? JSON.parse(savedLogin) : defaultLogin;
  });

  useEffect(() => {
    localStorage.setItem('userLogin', JSON.stringify(login));
  }, [login]);

  return (
    <UserContext.Provider value={{ login: login, setLogin: setLogin }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={login.success ? <Navigate to="user/dashboard" /> : <Login />} />
          <Route path="*" element={<Navigate to="/" />} />
          {login.success ? (
            <Route path="user" element={<UserLayout />}>
              <Route path="*" element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="food-and-calories" element={<FoodAndCalories />} />
              <Route path="exercise" element={<Exercise />} />
              <Route
                path="health-and-wellness"
                element={<HealthAndWellness />}
              />
              <Route path="recipes" element={<Recipes />} />
            </Route>
          ) : null}
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default ContentRouter;
