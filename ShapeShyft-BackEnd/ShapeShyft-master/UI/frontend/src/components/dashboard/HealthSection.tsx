import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export interface HealthSectionProps {
  recommended: number;
  actual: number;
  usedColor?: string;
  prompt: string;
  icon?: JSX.Element;
}
export function HealthSection(props: HealthSectionProps) {
  const val = { value: 1 };
  const recommmended = props.recommended;
  const actual = props.actual;
  const prompt = props.prompt;
  const usedColor = props.usedColor ?? "rgb(109 40 217)";
  const emptyColor = "rgb(214 211 209)";

  const data = [] as { value: number }[];
  let COLORS = [] as string[];

  for (let i = 0; i < recommmended; i++) {
    data.push(val);
    if (i < Math.floor(actual)) COLORS.push(usedColor);
    else COLORS.push(emptyColor);
  }

  return (
    <>
      <div className="w-1/3 md:w-full aspect-square md:aspect-[4/2] xl:w-2/5 2xl:w-1/5 xl:aspect-square flex items-center justify-center mx-5">
        <ResponsiveContainer
          width="100%"
          height="100%"
          className="min-h-[135px]"
        >
          <PieChart width={380} height={380}>
            <Pie
              data={data}
              innerRadius="60%"
              outerRadius="90%"
              cornerRadius="100%"
              paddingAngle={5}
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
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="gap-4 flex flex-col justify-center">
        <div className="flex flex-row items-center text-xl lg:text-2xl font-normal hover:animate-pulse">
          {props.icon ? (
            <div
              className="h-8 md:h-10 aspect-square"
              style={{ color: props.usedColor ?? "rgb(109 40 217)" }}
            >
              {props.icon}
            </div>
          ) : null}
          <p className={`py-4 ${props.icon ? "ml-2" : "ml-0"}`}>
            {actual + "/" + recommmended + " " + prompt}
          </p>
        </div>
      </div>
    </>
  );
}

export default HealthSection;
