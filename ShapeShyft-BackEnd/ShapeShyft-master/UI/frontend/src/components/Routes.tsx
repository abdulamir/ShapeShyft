import React from "react";
import {
  HomeIcon,
  FireIcon,
  HeartIcon,
  FaceSmileIcon,
  EyeDropperIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeIconSelected,
  FireIcon as FireIconSelected,
  HeartIcon as HeartIconSelected,
  FaceSmileIcon as FaceIconSelected,
  EyeDropperIcon as EyeDropperIconSelected,
} from "@heroicons/react/24/solid";
import { ISidebarItemModel } from "../models/ISidebarItemModel";

export const Routes: Array<ISidebarItemModel> = [
  {
    icon: <HomeIcon className="w-full h-full" />,
    selectedIcon: <HomeIconSelected className="w-full h-full" />,
    text: "Dashboard",
    href: "/user/dashboard",
    needsLogin: false,
  },
  {
    icon: <FireIcon className="w-full h-full" />,
    selectedIcon: <FireIconSelected className="w-full h-full" />,
    text: "Food and Calories",
    href: "/user/food-and-calories",
    needsLogin: false,
  },
  {
    icon: <HeartIcon className="w-full h-full" />,
    selectedIcon: <HeartIconSelected className="w-full h-full" />,
    text: "Exercise",
    href: "/user/exercise",
    needsLogin: false,
  },
  {
    icon: <FaceSmileIcon className="w-full h-full" />,
    selectedIcon: <FaceIconSelected className="w-full h-full" />,
    text: "Health and Wellness",
    href: "/user/health-and-wellness",
    needsLogin: false,
  },
  {
    icon: <EyeDropperIcon className="w-full h-full" />,
    selectedIcon: <EyeDropperIconSelected className="w-full h-full" />,
    text: "Recipes",
    href: "/user/recipes",
    needsLogin: false,
  },
].filter((value: ISidebarItemModel) => {
  return value.needsLogin === false;
});

export default Routes;
