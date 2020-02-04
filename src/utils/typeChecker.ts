import { IGrade, MenuItemType, ICourse } from "../settings/DataTypes";
export const isGrade = (item: MenuItemType) => {
  if ((item as IGrade).primaryCategory) {
    return true;
  }
  return false;
};

export const isCourse = (item: MenuItemType) => {
  if ((item as ICourse).primaryCategory && (item as ICourse).primaryGrade) {
    return true;
  }
  return false;
};
