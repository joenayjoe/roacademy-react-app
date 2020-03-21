import React, { useContext, useState, useEffect } from "react";
import TeacherRecruitBanner from "../../components/banner/TeacherRecruitBanner";
import { AuthContext } from "../../contexts/AuthContext";
import { RoleType, ICategory, ResourceType } from "../../settings/DataTypes";
import { CategoryService } from "../../services/CategoryService";

import CourseSlide from "../course/CourseSlide";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Collapse from "../../components/collapse/Collapse";
import { isMobile } from "react-device-detect";

const Home: React.FunctionComponent = () => {
  // context
  const authContext = useContext(AuthContext);

  // services
  const categoryService = new CategoryService();

  // states
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);

  useEffect(() => {
    categoryService.getCategories("name_asc").then(resp => {
      setCategories(resp.data);
      if (resp.data.length) {
        setSelectedCategoryId(resp.data[0].id);
      }
    });
    // eslint-disable-next-line
  }, []);

  const teacherBanner = () => {
    if (authContext.hasRole(RoleType.TEACHER) || authContext.isAdmin()) {
      return null;
    }
    return <TeacherRecruitBanner />;
  };

  const handleCategoryClick = (categoryId: number) => {
    if (selectedCategoryId !== categoryId) {
      setSelectedCategoryId(categoryId);
    }
  };

  const getCollagsibleCourses = (category: ICategory) => {
    if (selectedCategoryId === category.id) {
      return (
        <Collapse isOpen={selectedCategoryId === category.id}>
          <CourseSlide
            key={category.name}
            sourceId={category.id}
            sourceType={ResourceType.CATEGORY}
          />
        </Collapse>
      );
    }
    return null;
  };

  const getDesktopCategoryCourseView = () => {
    return (
      <React.Fragment>
        <ul className="nav nav-pills">{categoryPill()}</ul>

        <div className="category-pill-content-container">
          <CourseSlide
            key={selectedCategoryId}
            sourceId={selectedCategoryId}
            sourceType={ResourceType.CATEGORY}
          />
        </div>
      </React.Fragment>
    );
  };
  const getMobileCategoryCourseView = () => {
    return categories.map(category => {
      return (
        <div key={category.name} className="collapse-menu-item">
          <div
            className="collapse-item-header"
            onClick={() => handleCategoryClick(category.id)}
          >
            <span>{category.name}</span>
            <span>
              <FontAwesomeIcon
                icon={
                  selectedCategoryId === category.id ? "angle-up" : "angle-down"
                }
              />
            </span>
          </div>
          {getCollagsibleCourses(category)}
        </div>
      );
    });
  };
  const categoryPill = () => {
    return categories.map(cat => {
      const className = selectedCategoryId === cat.id ? "active" : "";
      return (
        <li
          key={cat.name}
          className={`nav-link link ${className}`}
          onClick={() => handleCategoryClick(cat.id)}
        >
          {cat.name}
        </li>
      );
    });
  };

  const getCategoryCourses = () => {
    if (isMobile) {
      return (
        <div className="collapse-menu">{getMobileCategoryCourseView()}</div>
      );
    }
    return getDesktopCategoryCourseView();
  };

  return (
    <React.Fragment>
      {teacherBanner()}
      <div className="width-75 mt-2">
        <div className="category-courses">{getCategoryCourses()}</div>
        <div className="trending-courses"></div>
        <div className="popular-topics"></div>
      </div>
    </React.Fragment>
  );
};
export default Home;
