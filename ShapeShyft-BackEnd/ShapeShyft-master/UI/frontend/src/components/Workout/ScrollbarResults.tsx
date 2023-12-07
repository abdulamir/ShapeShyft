import React from 'react'
import {ExerciseCardProps} from "./ExerciseCard";

interface ScrollbarResultsProps {
  exercises: ExerciseCardProps[];
}

const ScrollbarResults: React.FC<ScrollbarResultsProps> = ({ exercises }) => {
  //console.log("Received exercises:", exercises);
  return (
    <div className="flex flex-wrap justify-center">
    </div>
  );
};

export default ScrollbarResults;
