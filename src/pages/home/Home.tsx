import React, { useContext, useState, useEffect } from "react";
import TeacherRecruitBanner from "../../components/banner/TeacherRecruitBanner";
import { AuthContext } from "../../contexts/AuthContext";
import { RoleType, ICategory, ICourse } from "../../settings/DataTypes";
import { CategoryService } from "../../services/CategoryService";

import CourseSlide from "../course/CourseSlide";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Collapse from "../../components/collapse/Collapse";
import { isMobile } from "react-device-detect";
import { CourseService } from "../../services/CourseService";

const Home: React.FunctionComponent = () => {
  // context
  const authContext = useContext(AuthContext);

  // services
  const categoryService = new CategoryService();
  const courseService = new CourseService();

  // states
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [categoryCourses, setCategoryCourses] = useState<ICourse[]>([]);
  const [categoryCoursesPageNumber, setCategoryCoursesPageNumber] = useState<
    number
  >(0);
  const [hasMoreCategoryCourses, setHasMoreCategoryCourses] = useState<boolean>(
    false
  );
  const [
    lastCategoryCourseSlideIndex,
    setLastCategoryCourseSlideIndex
  ] = useState<number>(0);

  const loadCategoryCourses = (categoryId: number, page: number, size = 10) => {
    courseService.getCoursesByCategoryId(categoryId, page, size).then(resp => {
      setCategoryCourses(categoryCourses.concat(resp.data.content));
      if (resp.data.last) {
        setHasMoreCategoryCourses(false);
      } else {
        setHasMoreCategoryCourses(true);
      }
    });
  };

  useEffect(() => {
    if (selectedCategoryId > 0) {
      loadCategoryCourses(selectedCategoryId, 0);
    }
    // eslint-disable-next-line
  }, [selectedCategoryId]);

  useEffect(() => {
    categoryService.getCategories("name_asc").then(resp => {
      setCategories(resp.data);
      if (resp.data.length) {
        setSelectedCategoryId(resp.data[0].id);
      }
    });
    // eslint-disable-next-line
  }, []);

  const loadNextCategoryCoursePage = () => {
    const nextPageNumber = categoryCoursesPageNumber + 1;
    loadCategoryCourses(selectedCategoryId, nextPageNumber);
    setCategoryCoursesPageNumber(nextPageNumber);
  };

  const handleSlideAfterChangeEvent = (current: number) => {
    if (
      lastCategoryCourseSlideIndex < current &&
      categoryCourses.length - current <= 5 &&
      hasMoreCategoryCourses
    ) {
      loadNextCategoryCoursePage();
      setLastCategoryCourseSlideIndex(current);
    }
  };

  const teacherBanner = () => {
    if (authContext.hasRole(RoleType.TEACHER) || authContext.isAdmin()) {
      return null;
    }
    return <TeacherRecruitBanner />;
  };

  const handleCategoryClick = (categoryId: number) => {
    if (selectedCategoryId !== categoryId) {
      setSelectedCategoryId(categoryId);
      setCategoryCourses([]);
      setCategoryCoursesPageNumber(0);
      setHasMoreCategoryCourses(false);
      setLastCategoryCourseSlideIndex(0);
    }
  };

  const getCollapsibleCourses = (category: ICategory) => {
    if (selectedCategoryId === category.id) {
      return (
        <Collapse isOpen={selectedCategoryId === category.id}>
          <CourseSlide
            key={category.name}
            courses={categoryCourses}
            hasMore={hasMoreCategoryCourses}
            slideAfterChangeHandler={currentSlide =>
              handleSlideAfterChangeEvent(currentSlide)
            }
            loadNextPage={loadNextCategoryCoursePage}
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
            courses={categoryCourses}
            hasMore={hasMoreCategoryCourses}
            slideAfterChangeHandler={currentSlide =>
              handleSlideAfterChangeEvent(currentSlide)
            }
            loadNextPage={loadNextCategoryCoursePage}
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
          {getCollapsibleCourses(category)}
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
