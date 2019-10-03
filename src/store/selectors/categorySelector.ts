import { AppState } from "..";
import { createSelector } from "reselect";
import { ICategory } from "../../datatypes/types";

const getCategories = (state: AppState) => {
    return state.category.categories
};

export const selectCategories = createSelector([getCategories], categories => {
    return Object.values(categories) as ICategory[];
})
