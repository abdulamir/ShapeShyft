import React, { useState } from "react";
import InstructionsModal from "./InstructionsModal";
import "../../assets/css/WorkoutSection.css";

export type ExerciseCardProps = {
  type: string;
  name: string;
  difficulty: string;
  muscle: string;
  equipment: string;
  instructions: string;
};

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  name,
  type,
  difficulty,
  muscle,
  equipment,
  instructions,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFlip = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  const handleStartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsFlipped(false);
  };

  return (
    <>
      <div
        className={`exercise-card shadow-lg ${isFlipped ? "flipped" : ""}`}
        onClick={handleFlip}
      >
        <div className="exercise-card-inner rounded-xl">
          <div className="exercise-card-front flex justify-center items-center w-[430px] h-96 bg-white rounded-xl shadow-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 my-2 shadow-sm">
                {name}
              </h2>
            </div>
          </div>
          <div className="exercise-card-back flex justify-center items-center w-[430px] h-96 bg-white rounded-xl shadow-lg">
            <div className="text-center">
              <p>Difficulty: {difficulty}</p>
              <p>Muscles: {muscle}</p>
              <p>Equipment: {equipment}</p>
              <button
                onClick={handleStartClick}
                className="start-btn bg-gradient-to-t from-indigo-950 to-pink-950 focus:outline-none hover:scale-110 transform transition duration-300 ease-in-out"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </div>

      <InstructionsModal isOpen={isModalOpen} onClose={handleModalClose}>
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {name} Instructions
          </h3>
          <p className="text-gray-600 text-sm">{instructions}</p>
        </div>
      </InstructionsModal>
    </>
  );
};

export default ExerciseCard;
