import React, { useContext, useState, useEffect } from "react";
import TeacherRecruitBanner from "../../components/banner/TeacherRecruitBanner";
import { AuthContext } from "../../contexts/AuthContext";
import { RoleType, ICategory, ResourceType } from "../../settings/DataTypes";
import { CategoryService } from "../../services/CategoryService";

import CourseSlide from "../course/CourseSlide";

const Home: React.FunctionComponent = () => {
  // context
  const authContext = useContext(AuthContext);

  // services
  const categoryService = new CategoryService();

  // states
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [activeCatPill, setActiveCatPill] = useState<number>(0);

  useEffect(() => {
    categoryService.getCategories("name_asc").then(resp => {
      setCategories(resp.data);
    });
    // eslint-disable-next-line
  }, []);

  const teacherBanner = () => {
    if (authContext.hasRole(RoleType.TEACHER) || authContext.isAdmin()) {
      return null;
    }
    return <TeacherRecruitBanner />;
  };

  const handleCategoryPillClick = (categoryId: number) => {
    if (activeCatPill !== categoryId) {
      setActiveCatPill(categoryId);
    }
  };

  const categoryPill = () => {
    return categories.map(cat => {
      const className = activeCatPill === cat.id ? "active" : "";
      return (
        <li
          key={cat.name}
          className={`nav-link link ${className}`}
          onClick={() => handleCategoryPillClick(cat.id)}
        >
          {cat.name}
        </li>
      );
    });
  };

  const categoryContainer = () => {
    return (
      <div className="category-container">
        <ul className="nav nav-pills">{categoryPill()}</ul>

        <div className="category-pill-content-container">
          <CourseSlide
            key={activeCatPill}
            sourceId={activeCatPill}
            sourceType={ResourceType.CATEGORY}
          />
        </div>
      </div>
    );
  };

  return (
    <React.Fragment>
      {teacherBanner()}
      <div className="width-75 mt-2">
        <div className="category-courses">{categoryContainer()}</div>
        <div className="trending-courses"></div>
        <div className="popular-topics"></div>
      </div>
    </React.Fragment>
  );
};
export default Home;
