import React from "react";
import { useAllLessons } from "../hooks/useAllLessons";

const Home: React.FC = () => {
  const {
    data: allLessons,
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useAllLessons();

  if (isLoadingAll) return <div>Loading...</div>;
  if (isErrorAll) return <div>Error loading lessons</div>;

  return (
    <div>
      {allLessons?.map((lesson) => {
        return <p>{lesson.title}</p>;
      })}
    </div>
  );
};

export default Home;
