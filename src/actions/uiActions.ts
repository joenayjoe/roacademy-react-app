import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../store";
import { TOOGLE_SHOW_DROP_DOWN_MENU } from "./actionTypes";

export const toogleShowDropDownMenu = (
  value: boolean
): ThunkAction<void, AppState, null, Action<string>> => async dispatch => {
  dispatch(toogleShowDropDownMenuAction(value));
};

const toogleShowDropDownMenuAction = (value: boolean) => {
  return {
    type: TOOGLE_SHOW_DROP_DOWN_MENU,
    payload: value
  };
};
