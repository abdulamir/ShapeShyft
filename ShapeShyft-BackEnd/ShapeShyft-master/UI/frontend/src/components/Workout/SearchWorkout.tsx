import React, { useContext, useState } from "react";
import "../../assets/css/index.css";
import HorizontalScrollbar from "./HorizontalScrollbar";
import { GET } from "../../composables/api";
import urls from "../../composables/urls.json";
import { UserContext } from "../ContentRouter";
import ExerciseCard, { ExerciseCardProps } from './ExerciseCard';
import { CSSTransition, TransitionGroup } from "react-transition-group";

interface Exercise {
  name: string;
    difficulty: string;
    muscle: string;
    equipment: string;
    instructions: string;
}

const SearchWorkout = () => {
  const { login } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<ExerciseCardProps[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [displayCount, setDisplayCount] = useState<number>(6);

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    
    if (!value) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      const response = await GET(`${urls.getExercisesBySearch}?query=${encodeURIComponent(value)}`, login);
      if (response && response.items) {
        setSearchResults(response.items);
        setShowDropdown(true); 
        setShowResults(false); 
      } else {
        setSearchResults([]);
        setError("No exercises found.");
      }
    } catch (error) {
      setError("Failed to fetch exercises. Please try again.");
      console.error("Error fetching exercises:", error);
    }
  };

  const handleSearch = () => {
    if (!selectedExercise) {
      setError("Please select an exercise.");
      setShowResults(false);
      return;
    }

    setShowResults(true);
    setShowDropdown(false); 
  };

  const handleSelectExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setSearch(exercise.name); 
    setShowDropdown(false);
    setError(""); 
  };

  const loadMoreResults = () => {
    setDisplayCount(prevCount => prevCount + 6);
  };

  const renderSearchResults = () => {
    return searchResults.slice(0, displayCount).map((exercise, index) => (
      <CSSTransition key={index} timeout={500} classNames="item">
        <ExerciseCard 
        name={exercise.name}
        type={exercise.type}
        difficulty={exercise.difficulty}
        muscle={exercise.muscle}
        equipment={exercise.equipment}
        instructions={exercise.instructions} />
      </CSSTransition>
    ));
  };

  return (
    <div className="flex flex-col items-center mt-2 p-5">
      <h1 className="text-center font-bold mb-12 text-5xl mt-16">Let's Workout!</h1>
      <div className="relative w-full lg:w-[1170px] xs:w-[350px] flex items-center">
  <input
    className="w-full py-3 px-5 bg-white border-none rounded-l-full font-bold focus:outline-none"
    value={search}
    onChange={handleSearchChange}
    placeholder="Run, lift, yoga? Find it here..."
    type="text"
  />
  <button
    className="bg-gradient-to-t from-indigo-950 to-pink-950 overflow-hidden text-white uppercase lg:w-[173px] xs:w-[80px] py-3 px-5 h-auto lg:text-lg xs:text-sm rounded-r-full transition duration-300 ease-in-out hover:bg-opacity-80"
    onClick={() => search && handleSearch()}
  >
    Search
  </button>
  {showDropdown && (
    <ul className="absolute z-10 w-full border border-gray-200 bg-white max-h-60 overflow-auto">
      {searchResults.map((exercise, index) => (
        <li
          key={index}
          onClick={() => handleSelectExercise(exercise)}
          className="p-2 hover:bg-gray-100 cursor-pointer"
        >
          {exercise.name}
        </li>
      ))}
    </ul>
  )}
</div>

      {error && <p className="text-red-500">{error}</p>}

      {showResults && (
        <>
          <TransitionGroup className="flex flex-wrap justify-center mb-4 gap-8 mt-4">
            {renderSearchResults()}
          </TransitionGroup>

          {displayCount < searchResults.length && (
            <div className="flex justify-center">
              <button
                className="px-4 py-2 bg-gradient-to-t from-indigo-950 to-pink-950 text-white rounded focus:outline-none hover:scale-110 transform transition duration-300 ease-in-out"
                onClick={loadMoreResults}
              >
                More
              </button>
            </div>
          )}
        </>
      )}

      <div className="relative w-full p-5">
        <HorizontalScrollbar />
      </div>
    </div>
  );
};

export default SearchWorkout;