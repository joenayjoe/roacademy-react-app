import {
  CourseState,
  CourseActionTypes,
  GET_COURSES_FOR_GRADE
} from "../actions/actionTypes";

const initialState: CourseState = {
  courses: {},
  result: []
};

export const courseReducer = (
  state = initialState,
  action: CourseActionTypes
) => {
  switch (action.type) {
    case GET_COURSES_FOR_GRADE:
      return {
        ...state,
        courses: { ...state.courses, ...action.payload.entities.courses },
        result: { ...state.result, ...action.payload.result }
      };
    default:
      return state;
  }
};
