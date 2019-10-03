import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { AppState } from "..";
import { TOOGLE_SHOW_DROP_DOWN_MENU, UiActionTypes } from "./actionTypes";

export const toogleShowDropDownMenu = (
  value: boolean
): ThunkAction<void, AppState, null, Action<string>> => async dispatch => {
  console.log("called");
  dispatch(toogleShowDropDownMenuAction(value));
};

const toogleShowDropDownMenuAction = (value?: boolean) => {
  let action: UiActionTypes = {
    type: TOOGLE_SHOW_DROP_DOWN_MENU
  };
  if (value !== undefined) {
    action.payload = value;
  }
  return action;
};
