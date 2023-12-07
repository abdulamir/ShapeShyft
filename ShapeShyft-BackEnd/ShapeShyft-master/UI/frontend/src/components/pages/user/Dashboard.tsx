import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../ContentRouter";
import { GET } from "../../../composables/api";
import file from "../../../composables/urls.json";
import UserInfoSection from "../../dashboard/UserInfoSection";
import CalorySection from "../../dashboard/calory/CalorySection";
import ExerciseSection from "../../dashboard/ExerciseSection";
import HealthSection from "../../dashboard/HealthSection";
import { BeakerIcon, BoltIcon } from "@heroicons/react/24/solid";
import { getToday } from "../../../composables/sharedFunction";

export function Dashboard() {
  // const [exuser, setExUser] = useState(
  //   "(example of making api call) click me!"
  // );

  const [waterAmount, setWaterAmount] = useState(0);
  const [sleepAmount, setSleepAmount] = useState(0);

  const { login } = useContext(UserContext);
  // const exampleFunction = async () => {
  //   const val = await GET(file.me, login);
  //   setExUser(JSON.stringify(val));
  // };
  const today = getToday();

  console.log("Today: " + today);
  useEffect(() => {
    const getWater = async () => {
      const water = await GET(file.get_water, login);
      const val = water.find((item: any) => {
        return new Date(item.date).toISOString().split("T")[0] === today;
      });
      if(val && val.success) {
        setWaterAmount(val.amt);
      }
    };
    getWater();
  }, [login, today]);

  useEffect(() => {
    const getSleep = async () => {
      const sleep = await GET(file.get_sleep, login);
      //console.log(sleep)
      const val = sleep.find((item: any) => {
        return new Date(item.date).toISOString().split("T")[0] === today;
      });
      if(val && val.success) {
        setSleepAmount(val.h_slept);
      }
    };

    getSleep();
  }, [login, today])

  return (
    <div className="w-full h-full min-w-[330px] overscroll-x-contain">
      <div className="pb-4 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-xl p-4 bg-white overflow-hidden shadow-[0px_0px_10px_rgba(0,0,0,0.2)] md:col-span-2">
          <UserInfoSection />
        </div>
        <div className="rounded-xl col-span-1 md:col-span-2 p-4 bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.2)] flex flex-col md:flex-row flex-wrap ">
          <CalorySection />
        </div>
        <div className="rounded-xl p-4 bg-white overflow-hidden shadow-[0px_0px_10px_rgba(0,0,0,0.2)] col-span-1 md:col-span-2 xl:col-span-1 row-span-2 min-h-[270px] flex items-center">
          <ExerciseSection />
        </div>
        <div className="rounded-xl p-4 py-2 bg-white overflow-hidden shadow-[0px_0px_10px_rgba(0,0,0,0.2)] col-span-1  flex items-center justify-evenly flex-wrap xl:flex-nowrap">
          <HealthSection
            actual={waterAmount}
            recommended={8}
            prompt="Glasses of Water Today"
            usedColor="rgb(2 132 199)"
            icon={<BeakerIcon className="w-full h-full" />}
          />
        </div>
        <div className="rounded-xl p-4 py-2 bg-white overflow-hidden shadow-[0px_0px_10px_rgba(0,0,0,0.2)] col-span-1 flex items-center justify-evenly flex-wrap xl:flex-nowrap">
          <HealthSection
            actual={parseFloat(sleepAmount.toFixed(2))}
            recommended={8}
            prompt="Hours of Sleep Today"
            icon={<BoltIcon className="w-full h-full" />}
          />
        </div>
        {/* <div
          className="rounded-xl p-4 py-2 bg-white shadow-[0px_0px_10px_rgba(0,0,0,0.2)] hover:cursor-pointer overscroll-contain overflow-auto col-span-1 md:col-span-2"
          onClick={exampleFunction}
        >
          <p>{exuser}</p>
        </div> */}
      </div>
    </div>
  );
}

export default Dashboard;
