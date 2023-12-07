import React, { useState, useEffect, useContext } from "react";

import SearchWorkout from "../../Workout/SearchWorkout";
import Exercises from "../../Workout/Exercises";
import Welcome from "../../Workout/Welcome";
import DailyStepsModal from "../../Workout/DailyStepsModal";
import DailyStepsDisplay from "../../Workout/DailyStepsDisplay"; 
import ExerciseContext from "../../Workout/ExerciseContext";
import { ExerciseCardProps } from "../../Workout/ExerciseCard";
import SearchResults from "../../Workout/SearchResults";
import { UserContext } from "../../ContentRouter";
import { GET, POST } from "../../../composables/api";
import urls from "../../../composables/urls.json";
import { getToday } from "../../../composables/sharedFunction";

interface ExerciseContextValue {
  exercises: ExerciseCardProps[];
  setExercises: React.Dispatch<React.SetStateAction<ExerciseCardProps[]>>;
  showResults: boolean;
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
}

const Exercise: React.FC = () => {
  const { login } = useContext(UserContext);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [steps, setSteps] = useState<number>(0);
  const [exercises, setExercises] = useState<ExerciseCardProps[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const today = getToday();
        const response = await GET(urls.steps + "?date=" + today, login);
        //console.log(response);
        if(response && response.success) {
          const fetchedSteps = response.steps; 
          setSteps(fetchedSteps);
          setModalOpen(fetchedSteps === 0);
        }
       
      } catch (error) {
        console.error('Error fetching steps:', error);
      }
    };

    fetchSteps();
  }, [login]);

  const handleEditSteps = () => {
    setModalOpen(true); 
  };

  const handleModalClose = async (inputSteps: string) => {
    //console.log('inputSteps:', inputSteps)
    const numericSteps = parseInt(inputSteps, 10);
    if (!isNaN(numericSteps)) {
      try {
        await POST(`${urls.steps}`, { steps: numericSteps }, login); 
        setSteps(numericSteps);
        setModalOpen(false);
      } catch (error) {
        console.error('Error saving steps:', error);
      }
    } else {
      console.error('Input steps is not a valid number');
    }
  };

  interface ExerciseContextValue {
    exercises: ExerciseCardProps[];
    setExercises: React.Dispatch<React.SetStateAction<ExerciseCardProps[]>>;
  }

  const initialExerciseContext: ExerciseContextValue = {
    exercises: [],
    setExercises: () => {},
  };

  return (
    <div className="container mx-auto px-4">
      <Welcome />
      <div className="flex justify-between items-center space-x-4">
        <DailyStepsDisplay stepsTaken={steps} onEdit={handleEditSteps} />
      </div>
      <SearchWorkout />      
      <Exercises />
      <DailyStepsModal open={modalOpen} onClose={handleModalClose} />
      <ExerciseContext.Provider
        value={{ exercises, setExercises } as ExerciseContextValue || initialExerciseContext}
      >
      </ExerciseContext.Provider>
      {showResults && (
        <SearchResults exercises={exercises} />
      )}
    </div>
  );
};

export default Exercise;