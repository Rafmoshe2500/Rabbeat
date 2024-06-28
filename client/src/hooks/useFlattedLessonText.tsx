import { useMemo } from "react";

export const useFlattedLessonText = (lessonText?: Pick<Lesson, "text">) => {
  return useMemo(() => {
    if (!lessonText) return { flattedText: "", length: 0 };

    const flatted = Object.values(lessonText).flatMap((chapter) =>
      Object.values(chapter)
        .flatMap((verse) => Object.values(verse))
        .flatMap((word) => word.none)
    );

    return { flattedText: flatted.join(" "), length: flatted.length };
  }, [lessonText]);
};
