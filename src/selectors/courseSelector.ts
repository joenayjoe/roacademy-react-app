import { AppState } from "../store";
import { createSelector } from "reselect";

const getCourseIdsForSelectedGrade = (state: AppState): number[] => {
  const selectedGradeId = state.grade.selectedGradeId;
  if (selectedGradeId !== null) {
    const grade = state.grade.grades[selectedGradeId];
    return grade.courses;
  } else {
    return [];
  }
};

const getCourses = (state: AppState) => state.course.courses;

export const selectCoursesForSelectedGrade = createSelector(
  [getCourseIdsForSelectedGrade, getCourses],
  (courseIds, allCourses) => {
    return courseIds.map(id => allCourses[id]);
  }
);
