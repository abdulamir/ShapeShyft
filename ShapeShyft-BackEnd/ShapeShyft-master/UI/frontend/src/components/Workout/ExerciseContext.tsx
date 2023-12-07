import React from 'react';
import { ExerciseCardProps } from './ExerciseCard';

export const ExerciseContext = React.createContext<{
    exercises: ExerciseCardProps[];
    setExercises: React.Dispatch<React.SetStateAction<ExerciseCardProps[]>>;
  } | undefined>(undefined);
  
  ExerciseContext.displayName = 'ExerciseContext';

export default ExerciseContext;
