import {
  GradeState,
  GradeActionTypes,
  GET_GRADES_FOR_CATEGORY,
  GET_GRADES_FOR_CATEGORY_FROM_STORE,
  GET_COURSES_FOR_GRADE,
  SET_SELECTED_GRADE_ID
} from "../actions/actionTypes";

const initialState: GradeState = {
  grades: {},
  result: [],
  selectedGradeId: null
};

export const gradeReducer = (
  state = initialState,
  action: GradeActionTypes
) => {
  switch (action.type) {
    case GET_GRADES_FOR_CATEGORY:
      return {
        ...state,
        grades: {
          ...state.grades,
          ...action.payload.entities.grades
        },
        result: { ...state.result, ...action.payload.result }
      };
    case GET_COURSES_FOR_GRADE:
      const grade = state.grades[action.gradeId];
      return {
        ...state,
        grades: {
          ...state.grades,
          [action.gradeId]: {
            ...grade,
            courses: action.payload.result
          }
        },
        result: { ...state.result }
      };
    case SET_SELECTED_GRADE_ID:
      return {
        ...state,
        selectedGradeId: action.payload
      };

    case GET_GRADES_FOR_CATEGORY_FROM_STORE:
      return state;
    default:
      return state;
  }
};
