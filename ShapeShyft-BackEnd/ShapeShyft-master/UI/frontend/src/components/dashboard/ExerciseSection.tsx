import React, { useContext, useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import days from "../../composables/days.json";
import { UserContext } from "../ContentRouter";
import { GET } from "../../composables/api";
import file from "../../composables/urls.json";
import { formatDate, getToday } from "../../composables/sharedFunction";

export function ExerciseSection() {
  const { login } = useContext(UserContext);
  const today = new Date();
  const dataset = [];
  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    dataset.push({
      date: days[day.getDay()],
      Steps: 0,
    });
  }
  const [dates, setDates] = useState<any[]>([...dataset]);
  useEffect(() => {
    const getSteps = async () => {
      const data = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        const val = await GET(
          file.steps + "?date=" + formatDate(day.toLocaleDateString()),
          login
        );
        if (val && val.success) {
          data.push({
            date: days[day.getDay()],
            Steps: val.steps,
          });
        } else {
          data.push({
            date: days[day.getDay()],
            Steps: 0,
          });
        }
      }
      setDates(data);
    };
    getSteps();
  }, [login]);
  return (
    <div className="w-full">
      <p className="px-8 mb-3 text-3xl">Number of Steps in the Past Week</p>
      <ResponsiveContainer width="100%" height="100%" className="min-h-[270px]">
        <LineChart
          width={730}
          height={250}
          data={dates}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="Steps" stroke="rgb(109 40 217)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ExerciseSection;
