import React, { useState, useEffect, useContext } from "react";
import { ICategory, ICourse, AlertVariant } from "../../settings/DataTypes";
import CourseSlide from "../course/CourseSlide";
import GradeSlide from "../grade/GradeSlide";
import { CourseService } from "../../services/CourseService";
import {
  PAGE_SIZE,
  DEFAULT_SORTING,
  DEFAULT_COURSE_STATUS,
  BUILD_COURSE_URL,
} from "../../settings/Constants";
import { AlertContext } from "../../contexts/AlertContext";
import { axiosErrorParser } from "../../utils/errorParser";

import imagePlaeholder from "../../assets/images/image-placeholder.jpg";
import styles from "./Category.module.css";
import { Link } from "react-router-dom";
import AuthService from "../../services/AuthService";

interface IProps {
  category: ICategory;
}

const CategoryDisplay: React.FunctionComponent<IProps> = (props) => {
  // services
  const courseService = new CourseService();
  const authService = new AuthService();

  // context
  const alertContext = useContext(AlertContext);
  // states
  const [popularCourses, setPopularCourses] = useState<ICourse[]>([]);
  const [popualarPageNumber, setPopularPageNumber] = useState<number>(0);
  const [popularHasMore, setPopularHasMore] = useState<boolean>(false);
  const [lastSlideIndex, setLastSlideIndex] = useState<number>(0);

  const [allCourses, setAllCourses] = useState<ICourse[]>([]);
  const [allPageNumber, setAllPageNumber] = useState<number>(0);
  const [allHasMore, setAllHasMore] = useState<boolean>(false);

  const loadPopularCourses = (page: number, size = PAGE_SIZE) => {
    courseService
      .getCoursesByCategoryId(
        props.category.id,
        page,
        size,
        DEFAULT_COURSE_STATUS,
        "hits_desc"
      )
      .then((resp) => {
        setPopularCourses(popularCourses.concat(resp.data.content));
        setPopularPageNumber(resp.data.number);
        setPopularHasMore(!resp.data.last);
      })
      .catch((err) => {
        alertContext.show(
          "Errors :",
          AlertVariant.DANGER,
          axiosErrorParser(err)
        );
      });
  };

  const loadAllCourses = (page: number, size = PAGE_SIZE) => {
    courseService
      .getCoursesByCategoryId(
        props.category.id,
        page,
        size,
        DEFAULT_COURSE_STATUS,
        DEFAULT_SORTING
      )
      .then((resp) => {
        setAllCourses(allCourses.concat(resp.data.content));
        setAllPageNumber(resp.data.number);
        setAllHasMore(!resp.data.last);
      })
      .catch((err) => {
        alertContext.show(
          "Errors :",
          AlertVariant.DANGER,
          axiosErrorParser(err)
        );
      });
  };

  useEffect(() => {
    loadPopularCourses(popualarPageNumber);
    loadAllCourses(allPageNumber);
    // eslint-disable-next-line
  }, []);

  const loadNextPopularPage = () => {
    loadPopularCourses(popualarPageNumber + 1);
    setPopularPageNumber(popualarPageNumber + 1);
  };

  const loadNextAllPage = () => {
    loadAllCourses(allPageNumber + 1);
    setAllPageNumber(allPageNumber + 1);
  };

  const handleSlideAfterChangeEvent = (current: number) => {
    if (
      lastSlideIndex < current &&
      popularCourses.length - current <= 5 &&
      popularHasMore
    ) {
      loadNextPopularPage();
      setLastSlideIndex(current);
    }
  };

  const allCourseView = () => {
    return allCourses.map((course) => {
      return (
        <Link to={BUILD_COURSE_URL(course.id)} className={styles.courseItem}>
          <div>
            <img alt={course.name} src={course.imageUrl || imagePlaeholder} />
          </div>
          <div className={styles.courseItemInfo}>
            <h5>{course.name}</h5>
            <div className={styles.courseItemHeadline}>{course.headline}</div>
            <span className="text-secondary">
              By {authService.getUserFullName(course.createdBy)}
            </span>
          </div>
        </Link>
      );
    });
  };

  return (
    <div className="category-display-container">
      <div className="popular-courses">
        <CourseSlide
          title={`Popular Courses in ${props.category.name}`}
          courses={popularCourses}
          hasMore={popularHasMore}
          slideAfterChangeHandler={(currentSlide) =>
            handleSlideAfterChangeEvent(currentSlide)
          }
          loadNextPage={loadNextPopularPage}
        />
      </div>

      <div className="subject-list">
        <GradeSlide
          grades={props.category.grades}
          title={`Topics in ${props.category.name}`}
          hasMore={false}
          slideAfterChangeHandler={() => {}}
          loadNextPage={() => {}}
        />
      </div>

      <div className="course-list">
        <h5>All Courses in {props.category.name}</h5>
        {allCourseView()}
        {allHasMore && (
          <button className="btn btn-primary btn-sm" onClick={loadNextAllPage}>
            Load More
          </button>
        )}
      </div>
    </div>
  );
};
export default CategoryDisplay;
