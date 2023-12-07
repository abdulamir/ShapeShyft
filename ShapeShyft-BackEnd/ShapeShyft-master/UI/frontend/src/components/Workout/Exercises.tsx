import React, { useState, useRef, useEffect, useContext } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "../../assets/css/index.css";
import ExerciseCard from "./ExerciseCard";
import { UserContext } from "../ContentRouter";
import { GET } from "../../composables/api";
import urls from "../../composables/urls.json";

export interface ExerciseProps {
  key?: number;
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
}

const Exercises = () => {
  const { login } = useContext(UserContext);
  const [exercises, setExercises] = useState<ExerciseProps[]>([]);
  const [rowsOfExercises, setRowsOfExercises] = useState(2);
  const endOfListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await GET(`${urls.getRandomExercises}`, login);
      if (response.success) {
       setExercises(response.items);
      } 
    };
    fetchData();
  }, [login]);

  const scrollToNewExercises = () => {
    if (endOfListRef.current) {
      endOfListRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (rowsOfExercises > 2) {
      scrollToNewExercises();
    }
  }, [rowsOfExercises]);

  const addRowOfExercises = () => {
    if (rowsOfExercises < 5) {
      setRowsOfExercises(rowsOfExercises + 1);
    }
  };

  const generateExerciseCards = () => {
    return exercises.slice(0, rowsOfExercises * 3).map((exercise, i) => (
      <CSSTransition key={i} timeout={500} classNames="item">
        <ExerciseCard
          name={exercise.name}
          type={exercise.type}
          muscle={exercise.muscle}
          equipment={exercise.equipment}
          difficulty={exercise.difficulty}
          instructions={exercise.instructions}
        />
      </CSSTransition>
    ));
  };

  return (
    <div className="mt-12 mb-8 px-16">
      <div className="text-4xl font-bold">
        Today's Top Workouts
      </div>
      <TransitionGroup className="flex flex-row flex-wrap justify-center gap-8 mt-12">
        {generateExerciseCards()}
      </TransitionGroup>
      {rowsOfExercises * 3 < exercises.length && (
        <div className="mt-8 flex justify-center">
          <button
            className="px-6 py-3 text-white rounded-lg shadow-md bg-gradient-to-t from-indigo-950 to-pink-950 transition duration-300 "
            onClick={addRowOfExercises}
          >
            More
          </button>
        </div>
      )}
      <div ref={endOfListRef} aria-hidden="true" />
    </div>
  );
};

export default Exercises;
