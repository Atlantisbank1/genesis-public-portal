import { academyLessons } from "@/data/academy";

export function getAllLessons() {
  return academyLessons;
}

export function getLesson(slug: string) {
  return academyLessons.find(
    (lesson) => lesson.slug === slug,
  );
}

export function getNextLesson(slug: string) {
  const index = academyLessons.findIndex(
    (lesson) => lesson.slug === slug,
  );

  if (
    index === -1 ||
    index === academyLessons.length - 1
  ) {
    return null;
  }

  return academyLessons[index + 1];
}

export function getPreviousLesson(slug: string) {
  const index = academyLessons.findIndex(
    (lesson) => lesson.slug === slug,
  );

  if (index <= 0) {
    return null;
  }

  return academyLessons[index - 1];
}