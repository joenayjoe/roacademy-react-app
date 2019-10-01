import { NormalizedSchema } from "normalizr";
import { ModalIdentifier } from "../datatypes/types";

// action constants

export const GET_CATEGORIES = "GET_CATEGORIES";
export const GET_GRADES_FOR_CATEGORY = "GET_GRADES_FOR_CATEGORY";
export const GET_GRADES_FOR_CATEGORY_FROM_STORE =
  "GET_GRADES_FOR_CATEGORY_FROM_STORE";
export const GET_COURSES_FOR_GRADE_FROM_STORE =
  "GET_COURSES_FOR_GRADE_FROM_STORE";
export const GET_COURSES_FOR_GRADE = "GET_COURSES_FOR_GRADE";
export const SET_SELECTED_CATEGORY_ID = "SET_SELECTED_CATEGORY_ID";
export const SET_SELECTED_GRADE_ID = "SET_SELECTED_GRADE_ID";

// ui action types
export const TOOGLE_SHOW_DROP_DOWN_MENU = "TOOGLE_SHOW_DROP_DOWN_MENU";

// state type

export interface CategoryState {
  categories: any;
  result: number[];
  selectedCategoryId: number | null;
}

export interface GradeState {
  grades: any;
  result: number[];
  selectedGradeId: number | null;
}

export interface CourseState {
  courses: any;
  result: number[];
}

export interface UiState {
  showDropDownMenu: boolean;
  isSideDrawerOpen: boolean;
  currentModal: ModalIdentifier | null;
}

// action types

// categories

interface GetCategoriesAction {
  type: typeof GET_CATEGORIES;
  payload: NormalizedSchema<any, any>;
}

interface SetSelectedCategoryIdAction {
  type: typeof SET_SELECTED_CATEGORY_ID;
  payload: number;
}

// grade

interface GetGradesForCategoryAction {
  type: typeof GET_GRADES_FOR_CATEGORY;
  payload: NormalizedSchema<any, any>;
  categoryId: number;
}

interface GetGradesForCategoryFromStoreAction {
  type: typeof GET_GRADES_FOR_CATEGORY_FROM_STORE;
}

interface SetSelectedGradeIdAction {
  type: typeof SET_SELECTED_GRADE_ID;
  payload: number;
}

// courses

interface GetCoursesForGradeAction {
  type: typeof GET_COURSES_FOR_GRADE;
  payload: NormalizedSchema<any, any>;
  gradeId: number;
}

interface GetCoursesForGradeFromStoreAction {
  type: typeof GET_COURSES_FOR_GRADE_FROM_STORE;
}

// ui

interface ToogleShowDropDownMenuAction {
  type: typeof TOOGLE_SHOW_DROP_DOWN_MENU;
  payload: boolean;
}

export type CategoryActionTypes =
  | GetCategoriesAction
  | GetGradesForCategoryAction
  | SetSelectedCategoryIdAction;

export type GradeActionTypes =
  | GetGradesForCategoryAction
  | GetGradesForCategoryFromStoreAction
  | SetSelectedGradeIdAction
  | GetCoursesForGradeAction;

export type CourseActionTypes =
  | GetCoursesForGradeAction
  | GetCoursesForGradeFromStoreAction;

export type UiActionTypes = ToogleShowDropDownMenuAction;
