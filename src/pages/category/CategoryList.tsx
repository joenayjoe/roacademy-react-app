import React, { useEffect, useState, useContext } from "react";
import { CategoryService } from "../../services/CategoryService";
import { ICategory, RoleType } from "../../settings/DataTypes";
import GradeSlide from "../grade/GradeSlide";
import { AuthContext } from "../../contexts/AuthContext";
import "./Category.css";

const CategoryList = () => {
  let categoryService = new CategoryService();

  const [categories, setCategories] = useState<ICategory[]>([]);

  const authContext = useContext(AuthContext);

  useEffect(() => {
    categoryService.getCategoriesWithGrades().then(resp => {
      setCategories(resp.data);
    });
  });

  const handleNewCategoryOnClick = () => {};

  const getCategories = () => {
    return categories.map((cat: ICategory) => {
      return (
        <div className="category-slide" key={cat.id}>
          <GradeSlide grades={cat.grades} title={cat.name} />
        </div>
      );
    });
  };

  const getNewCategoryBtn = () => {
    let isAdmin =
      authContext &&
      authContext.currentUser &&
      authContext.currentUser.roles.some(role => role.name === RoleType.ADMIN);
    if (isAdmin) {
      return (
        <button
          className="btn btn-primary new-category-btn"
          onClick={handleNewCategoryOnClick}
        >
          + New Category
        </button>
      );
    }
    return null;
  };

  return (
    <div>
      {getNewCategoryBtn()}
      <div className="category-list">{getCategories()}</div>
    </div>
  );
};
export default CategoryList;
