import { GradeService } from "../../services/GradeService";
import { ThunkAction } from "redux-thunk";
import { AppState } from "..";
import { normalizeGrades } from "../../utils/normalizer";
import { NormalizedSchema } from "normalizr";
import { Action } from "redux";
import {
  GET_GRADES_FOR_CATEGORY,
  GET_GRADES_FOR_CATEGORY_FROM_STORE,
  SET_SELECTED_CATEGORY_ID,
  GradeActionTypes,
  CategoryActionTypes
} from "./actionTypes";

const gradeService = new GradeService();

export const getGradesForCategory = (
  categoryId: number
): ThunkAction<void, AppState, null, Action<string>> => async (
  dispatch,
  getState
) => {
  let category = getState().category.categories[categoryId];
  if (category !== undefined && category.grades.length) {
    dispatch(getGradesForCategorFromStoreAction());
  } else {
    gradeService.getGradesForCategory(categoryId).then(res => {
      dispatch(
        getGradesForCategoryAction(categoryId, normalizeGrades(res.data))
      );
    });
  }
  dispatch(setSelectedCategoryIdAction(categoryId));
};

const getGradesForCategoryAction = (
  categoryId: number,
  grades: NormalizedSchema<any, any>
) => {
  return {
    type: GET_GRADES_FOR_CATEGORY,
    payload: grades,
    categoryId
  };
};

const getGradesForCategorFromStoreAction = (): GradeActionTypes => {
  return {
    type: GET_GRADES_FOR_CATEGORY_FROM_STORE
  };
};

const setSelectedCategoryIdAction = (categoryId: number): CategoryActionTypes => {
  return {
    type: SET_SELECTED_CATEGORY_ID,
    payload: categoryId
  };
};
