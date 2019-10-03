import { IGrade, MenuItemType, ICourse } from "../settings/DataTypes";
export const isGrade = (item: MenuItemType) => {
  if ((item as IGrade).categoryId) {
    return true;
  }
  return false;
};

export const isCourse = (item: MenuItemType) => {
  if ((item as ICourse).gradeId) {
    return true;
  }
  return false;
};
