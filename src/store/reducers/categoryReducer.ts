import {
  CategoryState,
  CategoryActionTypes,
  GET_CATEGORIES,
  GET_GRADES_FOR_CATEGORY,
  SET_SELECTED_CATEGORY_ID
} from "../actions/actionTypes";

const initialState: CategoryState = {
  categories: {},
  result: [],
  selectedCategoryId: null
};

export const categoryReducer = (
  state = initialState,
  action: CategoryActionTypes
) => {
  switch (action.type) {
    case GET_CATEGORIES:
      return {
        ...state,
        categories: action.payload.entities.categories,
        result: action.payload.result
      } as CategoryState;

    case GET_GRADES_FOR_CATEGORY:
      const category = state.categories[action.categoryId];
      return {
        ...state,
        categories: {
          ...state.categories,
          [action.categoryId]: {
            ...category,
            grades: action.payload.result
          }
        },
        result: { ...state.result }
      };

    case SET_SELECTED_CATEGORY_ID:
      return { ...state, selectedCategoryId: action.payload };

    default:
      return state;
  }
};
