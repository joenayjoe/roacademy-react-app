import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { categoryReducer } from "../reducers/categoryReducer";
import { gradeReducer } from "../reducers/gradeReducer";
import { uiReducer } from "../reducers/uiReducer";
import { courseReducer } from "../reducers/courseReducer";



const rootReducer = combineReducers({
  category: categoryReducer,
  grade : gradeReducer,
  course: courseReducer,
  ui: uiReducer
});

export type AppState = ReturnType<typeof rootReducer>;

export default function configureStore() {
  const middlewares = [thunk];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const store = createStore(
    rootReducer,
    composeWithDevTools(middlewareEnhancer)
  );
  return store;
}
