import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

interface DailyStepsDisplayProps {
  stepsTaken: number;
  onEdit: () => void;
}

const DailyStepsDisplay: React.FC<DailyStepsDisplayProps> = ({ stepsTaken, onEdit }) => {
  const STEP_GOAL = 10000;
  const stepsRemaining = STEP_GOAL - stepsTaken;

  let stepsItems = [
    {
      icon: <DirectionsWalkIcon className="w-full h-full text-violet-700" />,
      text: "Steps Taken",
      value: stepsTaken,
    },
    {
      icon: <LocalFireDepartmentIcon className="w-full h-full text-rose-700" />,
      text: "Steps Remaining",
      value: stepsRemaining,
    },
  ];

  const data = [
    {
      name: "Steps Taken",
      value: stepsTaken,
    },
    {
      name: "Steps Remaining",
      value: stepsRemaining,
    },
  ];
  const COLORS = ["rgb(109 40 217)", "rgb(190 18 60)"];

  return (
    <div className="flex justify-center items-center w-full bg-white rounded-xl shadow-lg h-96 mt-16">
      <div className="flex justify-around items-center w-1/2 mr-auto ml-8"> 
        <div className="w-1/2 mr-4"> 
          <ResponsiveContainer aspect={1}>
            <PieChart>
              <Pie
                data={data}
                innerRadius="60%" 
                outerRadius="90%" 
                cornerRadius={15}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/2 flex flex-col justify-center items-start pl-4"> 
          {stepsItems.map((item, index) => (
            <div key={item.text} className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8"> 
                {item.icon}
              </div>
              <div>
                <p className="text-2xl font-medium">{item.text}</p>
                <p className="text-3xl font-semibold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
            <button 
              onClick={onEdit} 
              className="mr-16 mt-64 bg-gradient-to-t from-indigo-950 to-pink-950 text-white rounded focus:outline-none hover:scale-75 transform transition duration-300 ease-in-out hover:shadow-lg font-bold py-2 px-4"
            >
            Edit Steps
            </button>
          </div>
    </div>
  );
};

export default DailyStepsDisplay;
