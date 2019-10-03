import { GET_CATEGORIES, CategoryActionTypes } from "./actionTypes";
import { CategoryService } from "../../services/CategoryService";
import { AppState } from "..";
import { ThunkAction } from "redux-thunk";
import { Action } from "redux";
import { NormalizedSchema } from "normalizr";
import { normalizeCategories } from "../../utils/normalizer";

const categoryService = new CategoryService();

export const getCategories = (): ThunkAction<
  void,
  AppState,
  null,
  Action<string>
> => async dispatch => {
  categoryService.getCategories().then(res => {
    dispatch(getCategoriesAction(normalizeCategories(res.data)));
  });
};

// action creator

const getCategoriesAction = (
  categories: NormalizedSchema<any, any>
): CategoryActionTypes => {
  return {
    type: GET_CATEGORIES,
    payload: categories
  };
};
