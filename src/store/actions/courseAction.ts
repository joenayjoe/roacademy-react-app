import { ThunkAction } from "redux-thunk";
import { AppState } from "..";
import { Action } from "redux";
import { GradeService } from "../../services/GradeService";
import { normalizeCourses } from "../../utils/normalizer";
import { NormalizedSchema } from "normalizr";
import {
  GET_COURSES_FOR_GRADE,
  CourseActionTypes,
  GradeActionTypes,
  SET_SELECTED_GRADE_ID,
  GET_COURSES_FOR_GRADE_FROM_STORE
} from "./actionTypes";

const gradeService = new GradeService();

export const getCoursesForGrade = (
  categoryId: number,
  gradeId: number
): ThunkAction<void, AppState, null, Action<string>> => async (
  dispatch,
  getState
) => {
  let grade = getState().grade.grades[gradeId];
  if (grade !== undefined && grade.courses.length) {
      dispatch(getCoursesForGradeFromStoreAction())
  } else {
    gradeService.getCoursesForGrade(categoryId, gradeId).then(res => {
      dispatch(getCoursesForGradeAction(gradeId, normalizeCourses(res.data)));
    });
  }

  dispatch(setSelectedGradeIdAction(gradeId));
};

const getCoursesForGradeAction = (
  gradeId: number,
  courses: NormalizedSchema<any, any>
): CourseActionTypes => {
  return {
    type: GET_COURSES_FOR_GRADE,
    payload: courses,
    gradeId: gradeId
  };
};

const setSelectedGradeIdAction = (gradeId: number): GradeActionTypes => {
  return {
    type: SET_SELECTED_GRADE_ID,
    payload: gradeId
  };
};

const getCoursesForGradeFromStoreAction = (): CourseActionTypes => {
    return {
      type: GET_COURSES_FOR_GRADE_FROM_STORE
    };
  };
