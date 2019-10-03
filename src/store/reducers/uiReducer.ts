import {
  UiState,
  UiActionTypes,
  TOOGLE_SHOW_DROP_DOWN_MENU
} from "../actions/actionTypes";

const initialState: UiState = {
  showDropDownMenu: false,
  isSideDrawerOpen: false,
  currentModal: null,
  isFetching: false
};

export const uiReducer = (state = initialState, action: UiActionTypes) => {
  switch (action.type) {
    case TOOGLE_SHOW_DROP_DOWN_MENU:
      return {
        ...state,
        showDropDownMenu:
          action.payload === undefined
            ? !state.showDropDownMenu
            : action.payload
      } as UiState;
    default:
      return state;
  }
};
