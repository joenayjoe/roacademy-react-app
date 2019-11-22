import React, { useEffect, useState, useContext } from "react";
import { CategoryService } from "../../services/CategoryService";
import { ICategory, RoleType, ModalIdentifier } from "../../settings/DataTypes";
import GradeSlide from "../grade/GradeSlide";
import { AuthContext } from "../../contexts/AuthContext";
import "./Category.css";
import { ModalContext } from "../../contexts/ModalContext";

const CategoryList = () => {
  let categoryService = new CategoryService();

  const [categories, setCategories] = useState<ICategory[]>([]);

  const authContext = useContext(AuthContext);
  const modalContext = useContext(ModalContext);

  useEffect(() => {
    categoryService.getCategoriesWithGrades().then(resp => {
      setCategories(resp.data);
    });
    // eslint-disable-next-line
  }, []);

  const handleNewCategoryOnClick = () => {
    modalContext.switchModal(ModalIdentifier.NEW_CATEGORY_MODAL);
  };

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
