import React, { useContext, useState, useEffect } from "react";
import TeacherRecruitBanner from "../../components/banner/TeacherRecruitBanner";
import { AuthContext } from "../../contexts/AuthContext";
import { RoleType, ICategory, ICourse } from "../../settings/DataTypes";
import { CategoryService } from "../../services/CategoryService";
import CategoryDisplay from "../category/CategoryDisplay";
import { CourseService } from "../../services/CourseService";
import { PAGE_SIZE } from "../../settings/Constants";
import CourseSlide from "../course/CourseSlide";
import Spinner from "../../components/spinner/Spinner";

const Home: React.FunctionComponent = () => {
  // context
  const authContext = useContext(AuthContext);

  // services
  const categoryService = new CategoryService();
  const courseService = new CourseService();

  // states
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isCourseLoaded, setIsCourseLoaded] = useState<boolean>(true);
  const [courses, setCourses] = useState<ICourse[]>([]);

  const [activeCatPill, setActiveCatPill] = useState<number>(0);

  const fetchCoursesFor = (categoryId: number) => {
    setIsCourseLoaded(false);
    courseService
      .getCoursesByCategoryId(categoryId, 0, PAGE_SIZE)
      .then(resp => {
        setCourses(resp.data.content);
        setActiveCatPill(categoryId);
        setIsCourseLoaded(true);
      });
  };
  const fetchData = () => {
    categoryService.getCategories("name_asc").then(resp => {
      setCategories(resp.data);
      if (resp.data.length) {
        fetchCoursesFor(resp.data[0].id);
      }
    });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const teacherBanner = () => {
    if (authContext.hasRole(RoleType.TEACHER) || authContext.isAdmin()) {
      return null;
    }
    return <TeacherRecruitBanner />;
  };

  const handleCategoryPillClick = (categoryId: number) => {
    fetchCoursesFor(categoryId);
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

  const categoryPillContent = isCourseLoaded ? (
    <div>
      <CourseSlide title="" courses={courses} />
    </div>
  ) : (
    <Spinner size="2x" />
  );

  const categoryContainer = () => {
    return (
      <div className="category-container">
        <ul className="nav nav-pills">{categoryPill()}</ul>
        {categoryPillContent}
      </div>
    );
  };

  return (
    <React.Fragment>
      {teacherBanner()}
      <div className="width-75">
        <div className="category-courses">{categoryContainer()}</div>
        <div className="trending-courses"></div>
        <div className="popular-topics"></div>
      </div>
    </React.Fragment>
  );
};
export default Home;
