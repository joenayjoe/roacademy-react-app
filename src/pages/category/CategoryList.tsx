import React, { useEffect, useState } from "react";
import { CategoryService } from "../../services/CategoryService";
import { ICategory } from "../../settings/DataTypes";
import GradeSlide from "../grade/GradeSlide";
import "./Category.css";
import Spinner from "../../components/spinner/Spinner";

const CategoryList = () => {
  let categoryService = new CategoryService();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(true);

  useEffect(() => {
    categoryService.getCategoriesWithGrades().then(resp => {
      setCategories(resp.data);
      setIsloading(false);
    });
    // eslint-disable-next-line
  }, []);

  const getCategories = () => {
    return categories.map((cat: ICategory) => {
      return (
        <div className="category-slide" key={cat.id}>
          <GradeSlide
            grades={cat.grades}
            hasMore={false}
            slideAfterChangeHandler={() => {}}
            loadNextPage={() => {}}
            title={cat.name}
            href={"/categories/" + cat.id}
          />
        </div>
      );
    });
  };

  let content: JSX.Element = <Spinner size="3x" />;
  if (!isLoading) {
    content = <div className="category-list">{getCategories()}</div>;
  }
  return <div className="width-75 mt-3">{content}</div>;
};
export default CategoryList;
