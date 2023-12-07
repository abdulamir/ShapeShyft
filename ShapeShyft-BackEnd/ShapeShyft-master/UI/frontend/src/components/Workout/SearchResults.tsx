import React from 'react';
import ExerciseCard from './ExerciseCard'; // Adjust the import path as necessary
import {ExerciseCardProps} from "./ExerciseCard";

interface SearchResultsProps {
  exercises: ExerciseCardProps[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ exercises }) => {
  return (
    <div className="flex flex-wrap justify-center gap-8 mt-4">
      {exercises.map((exercise, index) => (
        <ExerciseCard key={index} {...exercise} />
      ))}
    </div>
  );
};

export default SearchResults;