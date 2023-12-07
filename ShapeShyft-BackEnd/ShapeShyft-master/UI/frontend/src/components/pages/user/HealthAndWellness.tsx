import React, { useContext, useState, useEffect } from "react";
import { POST } from "../../../composables/api";
import { GET } from "../../../composables/api";
import { UserContext } from "../../ContentRouter";
import file from "../../../composables/urls.json";
import { BeakerIcon, BoltIcon } from "@heroicons/react/24/solid";
import HealthSection from "../../dashboard/HealthSection";
import "./HealthAndWellness.css";

export function HealthAndWellness() {
  // For the API
  const { login } = useContext(UserContext);

  // State for counters
  const [waterCount, setWaterCount] = useState(0); // Allow both number and null
  const [waterAmount, setWaterAmount] = useState(0);

  // State for refreshing evryday
  const today = new Date().toISOString().split("T")[0];

  const [sleepDataResponse, setSleepDataResponse] = useState("");

  // State for Sleep Start and End
  const [sleepStart, setSleepStart] = useState("");
  const [sleepEnd, setSleepEnd] = useState("");
  const [sleepAmount, setSleepAmount] = useState(0);
  const [sleepDuration, setSleepDuration] = useState("");

  // State for user information

  const [weight, setWeight] = useState(0); // Initialize weight
  const [height, setHeight] = useState(0); // Initialize height
 // Function to send BMI data to backend
 const sendBmiDataToBackend = async (weight: number, height: number) => {
  const bmi = calculateBMI(weight, height); // Calculate BMI
  try {
    // Replace with your actual API call
    const response = await POST(
      file.post_bmi,
      { weight: weight, height: height }, // Send the calculated BMI
      login
    );
    if (response.success) {
      setBmiResponse(`BMI Data Sent Successfully: ${bmi}`);
      fetchPersonalizedHealthTips(); // Fetch personalized health tips after successful POST
    } else {
      setBmiResponse("Failed to send BMI data.");
    }
  } catch (error) {
    console.error("Error sending BMI data:", error);
    setBmiResponse("Failed to send BMI data.");
  }
};
  useEffect(() => {
    const getHeightAndWeight = async () => {
      const val = await GET(file.me, login);
    if(val && val.success){
      setWeight(val.weight);
      setHeight(val.height);
      await sendBmiDataToBackend(val.weight, val.height);
    }
    }
    getHeightAndWeight();
    
  }, [login]);

  const handleWeightChange = async (newWeight: number) => {
    setWeight(newWeight);
    await sendBmiDataToBackend(newWeight, height);
  };

  const handleHeightChange = async (newHeight: number) => {
    setHeight(newHeight);
    await sendBmiDataToBackend(weight, newHeight);
  };

 

  // State to store the backend response
  const [bmiResponse, setBmiResponse] = useState("");
  const [Bmi, setBmi] = useState(0);

  // Calculate BMI
  const calculateBMI = (weight: number, height: number) => {
    if (weight <= 0 || height <= 0) {
      return "N/A";
    }
    const bmi = weight / (height * height * 0.0001); // Calculate BMI formula
    setBmi(bmi); // Set the BMI state
    return bmi.toFixed(2);
  };

  // Placeholder for personalized health tips fetched from the backend
  const [personalizedHealthTips, setPersonalizedHealthTips] = useState("");

  interface WaterTrackerMessageProps {
    waterCount: number;
  }

  // Function to fetch personalized health tips from the backend
  const fetchPersonalizedHealthTips = async () => {
    try {
      const response = await GET(file.tips, login);
      if (response && response.data) {
        setPersonalizedHealthTips(response.data);
      } else {
        console.error(
          "Error fetching personalized health tips: Invalid response"
        );
        setPersonalizedHealthTips("Failed to load personalized tips.");
      }
    } catch (error) {
      console.error("Error fetching personalized health tips:", error);
      setPersonalizedHealthTips("Failed to load personalized tips.");
    }
  };

  // Function to send user data to the backend
  const sendUserDataToBackend = async () => {
    try {
      // Replace with your actual API endpoint for sending user data
      const postResponse = await POST(file.post_bmi, {weight: weight, height: height}, login);

      if (postResponse.success) {
        console.log("User data sent successfully:", postResponse);
        await fetchPersonalizedHealthTips(); // Fetch personalized tips after sending user data
      } else {
        console.error("Error sending user data:", postResponse);
        setPersonalizedHealthTips("Failed to load personalized tips.");
      }
    } catch (error) {
      console.error("Error sending user data:", error);
      setPersonalizedHealthTips("Failed to load personalized tips.");
    }
  };

  <br></br>;
  function WaterTrackerMessage({ waterCount }: WaterTrackerMessageProps) {
    let message = "";

    switch (waterCount) {
      case 0:
        message = "Let's start the day by drinking some water";
        break;
      case 1:
        message = "Keep going! You're on track";
        break;
      case 2:
        message = "Nice! Staying healthy";
        break;
      case 3:
        message = "Great! Let's get hydrated";
        break;
      case 4:
        message = "Awesome! Halfway to go for the day";
        break;
      case 5:
        message = "Whoohoo!";
        break;
      case 6:
        message = "Let's gooo";
        break;
      case 7:
        message = "One more to go! Couldn't be more proud";
        break;
      case 8:
        message =
          "Perfect, you made it! Congrats for keeping healthy and hydrated";
        break;
      default:
        if (waterCount > 8) {
          message = "Oh, okay dear I think you already made it :)";
        }
        break;
    }

    return <p>{message}</p>;
  }

  useEffect(() => {
    const GetWaterCount = async () => {
      try {
        const val = await GET(file.get_water, login);
        const today = new Date().toISOString().split("T")[0];
        const water = val.find((item: any) => {
          return new Date(item.date).toISOString().split("T")[0] === today;
        });
        if (water && water.amt !== undefined) {
          setWaterCount(water.amt);
        } else {
          setWaterCount(0); // Fallback to 0 if response does not have waterCount
        }
      } catch (e) {
        console.error("Error: fetching water count from backend failed.", e);
        setWaterCount(0);
      }
    };

    // Reminder logic for water consumption
    const checkWaterIntake = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 8 && currentHour <= 23) {
        const hoursPassed = currentHour - 8;
        const glassesShouldHaveDrunk = Math.floor(hoursPassed / 3);
        if (waterCount < glassesShouldHaveDrunk) {
          alert("Remember to drink more water!");
        }
      }
    };
    // Fetch water count from the backend when the component is mounted
    GetWaterCount();

    // Check every hour
    const interval = setInterval(() => {
      checkWaterIntake();
    }, 3600000); // Check every hour (3600000 milliseconds)

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [login, waterCount]);

  useEffect(() => {
    const getWater = async () => {
      const water = await GET(file.get_water, login);
      const val = water.find((item: any) => {
        return new Date(item.date).toISOString().split("T")[0] === today;
      });
      if (val && val.success) {
        setWaterAmount(val.amt);
      }
    };
    getWater();
  }, [login, today]);

  useEffect(() => {
    const getSleep = async () => {
      const sleep = await GET(file.get_sleep, login);
      console.log(sleep);
      const val = sleep.find((item: any) => {
        return new Date(item.date).toISOString().split("T")[0] === today;
      });
      if (val && val.success) {
        setSleepAmount(val.h_slept);
      }
    };

    getSleep();
  }, [login, today]);

  useEffect(() => {
    const savedSleepStart = localStorage.getItem("sleepStart");
    const savedSleepEnd = localStorage.getItem("sleepEnd");

    if (savedSleepStart) {
      setSleepStart(savedSleepStart);
    }

    if (savedSleepEnd) {
      setSleepEnd(savedSleepEnd);
    }
  }, [login, today]);

  useEffect(() => {
    const calculateSleepDuration = () => {
      if (sleepStart && sleepEnd) {
        const startTime: Date = new Date(`01/01/2000 ${sleepStart}`);
        const endTime: Date = new Date(`01/01/2000 ${sleepEnd}`);

        // Check if the dates are valid
        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
          return ""; // Return empty string or handle invalid date
        }

        if (endTime < startTime) {
          // Assumes sleep went overnight to the next day
          endTime.setDate(endTime.getDate() + 1);
        }

        const duration = endTime.getTime() - startTime.getTime();
        const hours = Math.floor(duration / 3600000); // convert milliseconds to hours
        const minutes = Math.floor((duration % 3600000) / 60000); // remaining milliseconds to minutes

        return `${hours} hours and ${minutes} minutes`;
      }
      return "";
    };

    const duration = calculateSleepDuration();
    setSleepDuration(duration);
  }, [sleepStart, sleepEnd]);

  // Function to fetch BMI data from the backend
  const fetchBmiData = async () => {
    try {
      const response = await GET(file.get_bmi, login);
      if (response && response.bmi) {
        setBmi(response.bmi);
      } else {
        setBmi(0); // Set to a default value if no BMI data is available
      }
    } catch (error) {
      console.error("Error fetching BMI data:", error);
      setBmi(0); // Handle error by setting BMI to a default value
    }
  };

  useEffect(() => {
    // Fetch BMI data from the backend when the component is mounted
    fetchBmiData();
  }, [login, fetchBmiData]);

  useEffect(() => {
    sendUserDataToBackend();
  }, [login, waterCount, weight, height, Bmi, sleepStart, sleepEnd]);

  // Fetching data from the backend
  useEffect(() => {
    const fetchPersonalizedHealthTips = async () => {
      try {
        const response = await GET(file.tips, login);
        if (response && response.data) {
          setPersonalizedHealthTips(response.data);
        } else {
          console.error(
            "Error fetching personalized health tips: Invalid response"
          );
          setPersonalizedHealthTips("Failed to load personalized tips.");
        }
      } catch (error) {
        console.error("Error fetching personalized health tips:", error);
        setPersonalizedHealthTips("Failed to load personalized tips.");
      }
    };

    fetchPersonalizedHealthTips();
  }, [login]);

  const PostWaterCount = async (updatedCount: any) => {
    try {
      const val = await POST(file.post_water, { amt: updatedCount }, login);
      setWaterCount(updatedCount);
      setWaterAmount(updatedCount);
      if (val.success) {
        // Successful POST is printed on console
        console.log(val);
      }
    } catch (e) {
      console.error("Error: connection to the backend has failed.", e);
    }
  };

  const handleWaterCountChange = (delta: any) => {
    const updatedCount = waterCount + delta;
    console.log(updatedCount);
    PostWaterCount(updatedCount); // Send the updated count to the backend
  };

  const postSleepData = async () => {
    const s_time = convert12Hour(sleepStart);
    const e_time = convert12Hour(sleepEnd);
    const sleepData = {
      s_time: s_time,
      e_time: e_time,
    };

    try {
      const val = await POST(file.post_sleep, sleepData, login);
      if (val && val.success) {
        console.log("Sleep data posted successfully:", val);
        setSleepAmount(val.h_slept);
        setSleepDataResponse("Sleep data posted successfully");
      }
    } catch (e) {
      console.error("Error posting sleep data:", e);
      setSleepDataResponse("Failed to post sleep data");
    }
  };
  const convert12Hour = (time: any) => {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join("");
  };

  {
    /* ----------------- Health & Welness top page ----------------------- */
  }

  return (
    <div className="container mx-auto p-8 bg-gray-100">
      <h1 className="text-4xl font-semibold mb-6 text-black-700">
        Health and Wellness
      </h1>

      <div className="bg-white p-6 rounded-md shadow-md">
        {/* First Section - Counters */}
        <section className="mb-8 border-b pb-6">
          <h2 className="text-4xl font-semibold mb-4 text-blue-600">
            Track Your Health
          </h2>

          {/* ----------------- Water Tracker ----------------------- */}

          <section className="mb-8 border-b pb-6">
            <h3 className="text-2xl font-semibold mb-4 text-blue-600">
              Water Tracker{" "}
            </h3>
            <div className="flex items-center mb-4 space-x-4">
              <p className="w-1/4 text-lg">Water (Glasses)</p>
              <button
                className={`${
                  waterCount <= 0
                    ? "bg-gray-400 text-gray-200"
                    : "bg-blue-500 text-white"
                } px-3 py-2 rounded-full`}
                onClick={() => handleWaterCountChange(-1)}
                disabled={waterCount <= 0}
              >
                -
              </button>
              <span className="w-1/4 text-center text-xl">{waterCount}</span>
              <button
                className="bg-blue-500 text-white px-3 py-2 rounded-full"
                onClick={() => handleWaterCountChange(1)}
              >
                +
              </button>
            </div>
            <WaterTrackerMessage waterCount={waterCount} />
          </section>
          <section className="mb-8 border-b pb-6">
            <div className="rounded-xl p-4 py-2 bg-white overflow-hidden shadow-[0px_0px_10px_rgba(0,0,0,0.2)] col-span-1  flex items-center justify-evenly flex-wrap xl:flex-nowrap">
              <HealthSection
                actual={waterAmount}
                recommended={8}
                prompt="Glasses of Water Today"
                usedColor="rgb(2 132 199)"
                icon={<BeakerIcon className="w-full h-full" />}
              />
            </div>
          </section>
        </section>

        {/* ----------------- Sleep Tracker ----------------------- */}

        <section className="mb-8 border-b pb-6">
          <div className="mb-4">
            <h3 className="text-2xl font-semibold mb-4 text-blue-600">
              Sleep Tracker{" "}
            </h3>
            <p className="w-1/4">Sleep Start Time</p>
            <input
              type="time"
              value={sleepStart}
              onChange={(e) => setSleepStart(e.target.value)}
              className="w-1/4 border border-gray-300 rounded p-2"
            />
          </div>
          <div className="mb-4">
            <p className="w-1/4">Sleep End Time</p>
            <input
              type="time"
              value={sleepEnd}
              onChange={(e) => setSleepEnd(e.target.value)}
              className="w-1/4 border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            {sleepDataResponse && (
              <p
                className={
                  sleepDataResponse.includes("successfully")
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {sleepDataResponse}
              </p>
            )}
          </div>
          <button
            onClick={postSleepData}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            Submit Sleep Data
          </button>

          <div className="rounded-xl p-4 py-2 bg-white overflow-hidden shadow-[0px_0px_10px_rgba(0,0,0,0.2)] col-span-1 flex items-center justify-evenly flex-wrap xl:flex-nowrap">
            <HealthSection
              actual={parseFloat(sleepAmount.toFixed(2))}
              recommended={8}
              prompt="Hours of Sleep Today"
              icon={<BoltIcon className="w-full h-full" />}
            />
          </div>
        </section>

        {/* ---------------- Second Section - User Information ---------------*/}
        <section className="mt-8">
          <h2 className="text-3xl font-semibold mb-4 text-blue-600">
            User Information
          </h2>
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <p className="text-lg">Weight (Kg)</p>
              <input
                min="0"
                type="number"
                value={weight}
                onChange={(e) => handleWeightChange(Number(e.target.value))}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <p className="text-lg">Height (cm)</p>
              <input
                min="0"
                type="number"
                value={height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className="w-full mt-2 p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">
            BMI
          </h2>
          <div>
            <p className="text-lg">{Bmi}</p>
          </div>
        </section>
        <section className="mt-8">
          {/* BMI Calculator */}
          <div>
            <p className="text-2xl font-semibold mb-4 text-blue-600">
              BMI Chart
            </p>
            <img
              src="https://www.pnbmetlife.com/content/dam/pnb-metlife/images/icons/bmi-calculator/meter.png"
              alt="BMI chart"
              className="mt-4 rounded-md shadow"
            />
          </div>
        </section>
      </div>
      <div>
        {/* ----------------------- Personalized Health & Fitness Tips -----------------------------
        <section className="my-10 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">
            Personalized Health & Fitness Tips
          </h2>
          <button
            onClick={fetchPersonalizedHealthTips}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            Generate Personalized Tips
          </button>
          <div className="space-y-4">
            {personalizedHealthTips ? (
              <p className="text-gray-700">{personalizedHealthTips}</p>
            ) : (
              <p className="text-gray-500">
                Your personalized tips will appear here...
              </p>
            )}
          </div>
        </section> */}
      </div>
    </div>
  );
}

export default HealthAndWellness;
