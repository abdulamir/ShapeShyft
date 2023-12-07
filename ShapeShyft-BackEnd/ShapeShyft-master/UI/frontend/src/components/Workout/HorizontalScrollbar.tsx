import React, { useContext, useState, useRef } from "react";
import { GET } from "../../composables/api";
import urls from "../../composables/urls.json";
import { UserContext } from "../ContentRouter";
import { ExerciseCardProps } from "./ExerciseCard";
import ExerciseCard from "./ExerciseCard";
import { CSSTransition, TransitionGroup } from "react-transition-group"; 

interface BodyPart {
  name: string;
}

const bodyParts: BodyPart[] = [
  { name: "Arms" },
  { name: "Abs" },
  { name: "Legs" },
  { name: "Chest" },
  { name: "Back" },
  { name: "Cardio" }
];

const HorizontalScrollbar: React.FC = () => {
  const { login } = useContext(UserContext);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [exercises, setExercises] = useState<ExerciseCardProps[]>([]);
  const [displayCount, setDisplayCount] = useState<number>(6);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const fetchExercisesByBodyPart = async (bodyPart: string) => {
    if (selectedBodyPart === bodyPart) return;

    try {
      const queryParams = new URLSearchParams({ body_part: bodyPart.toLowerCase() });
      const response = await GET(`${urls.getExercisesByBodyPart}?${queryParams}`, login);

      if (response.success && Array.isArray(response.items)) {
        setExercises(response.items);
        setSelectedBodyPart(bodyPart);
        setDisplayCount(6); 
      } else {
        console.error("Unexpected data format received from the API:", response);
      }
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const loadMoreExercises = () => {
    setDisplayCount(prevCount => prevCount + 6);
  };

  const renderExerciseCards = () => {
    return exercises.slice(0, displayCount).map((exercise, index) => (
      <CSSTransition key={index} timeout={500} classNames="item">
        <ExerciseCard
          name={exercise.name}
          type={exercise.type}
          difficulty={exercise.difficulty}
          muscle={exercise.muscle}
          equipment={exercise.equipment}
          instructions={exercise.instructions}
        />
      </CSSTransition>
    ));
  };

  return (
    <div className="w-full h-full overflow-hidden relative">
      <h2 className="text-4xl font-bold mt-11">
        Focusing on any specific body part today?
      </h2>
      <div className="flex space-x-5 py-5 px-4">
        <div className="flex-grow relative" style={{ overflow: "hidden" }}>
          <div
            className="scroll-container"
            ref={scrollContainerRef}
            style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            {bodyParts.map((part, index) => (
              <div
                key={part.name}
                onClick={() => fetchExercisesByBodyPart(part.name)}
                className={`flex-none w-1/4 md:w-1/5 lg:w-1/4 rounded-xl p-4 bg-white overflow-hidden shadow-[0px_0px_10px_rgba(0,0,0,0.2)] m-1 hover:m-0 transition-all ease-in-out duration-150 brightness-[0.98] hover:brightness-100 cursor-pointer ${
                  selectedBodyPart === part.name ? "bg-blue-500" : ""
                }`}
              >
                <p className="text-xl">{part.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <TransitionGroup className="flex flex-wrap justify-center mb-4 gap-8">
        {renderExerciseCards()}
      </TransitionGroup>

      {displayCount < exercises.length && (
        <div className="flex justify-center">
          <button
            className="px-4 py-2 bg-gradient-to-t from-indigo-950 to-pink-950 text-white rounded focus:outline-none hover:scale-110 transform transition duration-300 ease-in-out"
            onClick={loadMoreExercises}
          >
            More
          </button>
        </div>
      )}
    </div>
  );
};

export default HorizontalScrollbar;