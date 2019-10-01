import { createSelector } from "reselect";
import { AppState } from "../store";

const getGradeIdsForSelectedCategory = (state: AppState): number[] => {
  const selectedCategoryId = state.category.selectedCategoryId;
  if (selectedCategoryId !== null) {
    const category = state.category.categories[selectedCategoryId];
    return category.grades;
  } else {
    return [];
  }
};

const getGrades = (state: AppState) => state.grade.grades;

export const selectGradesForSelectedCategory = createSelector(
  [getGradeIdsForSelectedCategory, getGrades],
  (gradeIds, allGrades) => {
    return gradeIds.map(id => allGrades[id]);
  }
);
