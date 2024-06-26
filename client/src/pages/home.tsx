import React from "react";
import { useAllLessonsDetails } from "../hooks/useAllLessonsDetails";

const Home: React.FC = () => {
  const {
    data: allLessons,
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useAllLessonsDetails();

  if (isLoadingAll) return <div>Loading...</div>;
  if (isErrorAll) return <div>Error loading lessons</div>;

  return (
    <div>
      {allLessons?.map((lesson) => {
        return lesson ? (
          Object.entries(lesson).map(([key, value]) => {
            return (
              <p>
                {key}:{value.toString()}
              </p>
            );
          })
        ) : (
          <p> Less</p>
        );
      })}
    </div>
  );
};

export default Home;
