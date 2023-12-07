import React, { useContext, useState, useEffect } from "react";
import CaloryItem from "./CaloryItem";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { FireIcon, HeartIcon } from "@heroicons/react/24/solid";
import { UserContext } from "../../ContentRouter";
import { GET } from "../../../composables/api";
import urls from "../../../composables/urls.json";
import Loading from "../../common/Loading";
import { getToday } from "../../../composables/sharedFunction";

export function CalorySection() {
  const { login } = useContext(UserContext);
  const [intake, setIntake] = useState(0 as number);
  const [caloriesToConsume, setCaloriesToConsume] = useState(2500 as number);
  const [loadingCalories, setLoadingCalories] = useState(true);


  // gets and sets intake calories and calories to consume
  useEffect(() => {
    const getCalories = async () => {
      const calToConsume = await GET(urls.me, login);
      if (calToConsume && calToConsume.success) {
        const val = parseInt(calToConsume.suggested_calories);
        await setCaloriesToConsume(val);
      }

      const today = getToday();
      const cal = await GET(urls.total_calories + "?date=" + today , login);
      if (cal && cal.success) {
        const val = parseInt(cal.total_calories);
        await setIntake(val);
        setLoadingCalories(false);
      }
    };

    getCalories();
  }, [login]);

  let caloryItems = [
    {
      icon: <HeartIcon className="w-full h-full text-rose-700" />,
      text: "Calories Consumed",
      value: intake,
    },
    {
      icon: <FireIcon className="w-full h-full text-violet-700" />,
      text: "Calories Left to Consume",
      value: caloriesToConsume - intake > 0 ? caloriesToConsume - intake : 0,
    },
  ];

  const renderPieChart = () => {
    const val = caloriesToConsume - intake > 0 ? caloriesToConsume - intake : 0;
    const data = [] as { name: string; value: number }[];
    if (!loadingCalories) {
      data.push({ name: "Calories Consumed", value: intake });
      data.push({ name: "Calories Left to Consume", value: val });
    }

    const COLORS = ["rgb(190 18 60)", "rgb(109 40 217)"];

    if (!loadingCalories) {
      return (
        <ResponsiveContainer
          width="100%"
          height="100%"
          className="min-h-[270px]"
        >
          <PieChart width={380} height={380}>
            <Pie
              data={data}
              innerRadius="60%"
              outerRadius="90%"
              cornerRadius={15}
              paddingAngle={val === 0 ? 0 : 5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  className="hover:animate-pulse"
                  style={{ outline: "none" }}
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      );
    }
    return null;
  };
  return (
    <>
      <div className="w-full aspect-[3/2] lg:w-2/3 xl:w-1/4 xl:aspect-square flex items-center justify-center mr-10">
        {loadingCalories ? <Loading /> : renderPieChart()}
      </div>

      <div className="gap-4 flex flex-col justify-center">
        {caloryItems.map((val: any) => {
          return (
            <div key={val.text} className="hover:animate-pulse">
              <CaloryItem icon={val.icon} text={val.text} value={val.value} />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default CalorySection;
