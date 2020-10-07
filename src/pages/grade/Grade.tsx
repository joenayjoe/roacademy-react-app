import React, { useState, useEffect, useContext } from "react";

import styles from "./Grade.module.css";
import { RouteComponentProps } from "react-router";
import { IGrade, ICourse, AlertVariant } from "../../settings/DataTypes";
import { GradeService } from "../../services/GradeService";
import Spinner from "../../components/spinner/Spinner";
import CourseSlide from "../course/CourseSlide";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import BreadcrumbItem from "../../components/breadcrumb/BreadcrumbItem";
import {
  BUILD_CATEGORY_URL,
  DEFAULT_COURSE_STATUS,
  PAGE_SIZE,
  DEFAULT_SORTING,
  BUILD_COURSE_URL,
} from "../../settings/Constants";
import { CourseService } from "../../services/CourseService";
import { AlertContext } from "../../contexts/AlertContext";
import { axiosErrorParser } from "../../utils/errorParser";
import PageNotFound from "../route/PageNotFound";
import { Link } from "react-router-dom";
import imagePlaeholder from "../../assets/images/image-placeholder.jpg";
import AuthService from "../../services/AuthService";

interface matchedParams {
  grade_id: string;
}

interface IProps extends RouteComponentProps<matchedParams> {}

const Grade: React.FunctionComponent<IProps> = (props) => {
  // query prams
  const gradeId = props.match.params.grade_id;

  // services
  const gradeService = new GradeService();
  const courseService = new CourseService();
  const authService = new AuthService();

  //context
  const alertContext = useContext(AlertContext);

  const [grade, setGrade] = useState<IGrade | null>(null);
  const [popularCourses, setPopularCourses] = useState<ICourse[]>([]);
  const [hasMorePopularCourse, setHasMorePopularCourse] = useState<boolean>(
    false
  );
  const [popularCoursePageNumber, setPopularCoursePageNumber] = useState<
    number
  >(0);
  const [lastSlideIndex, setLastSlideIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [allCourses, setAllCourses] = useState<ICourse[]>([]);
  const [hasMoreAllCourse, setHasMoreAllCourse] = useState<boolean>(false);
  const [allCoursePageNumber, setAllCoursePageNumber] = useState<number>(0);
  const [found, setFound] = useState<boolean>(true);

  const loadGrade = () => {
    gradeService
      .getGradeWithCourses(+gradeId, DEFAULT_COURSE_STATUS)
      .then((response) => {
        setGrade(response.data);
      })
      .catch((err) => {
        setIsLoading(false);
        setFound(false);
        alertContext.show(
          axiosErrorParser(err).join(", "),
          AlertVariant.DANGER
        );
      });
  };

  const loadPopularCourses = (page: number, size = PAGE_SIZE) => {
    courseService
      .getCoursesByGradeId(
        +gradeId,
        page,
        size,
        DEFAULT_COURSE_STATUS,
        "hits_desc"
      )
      .then((resp) => {
        setPopularCourses(popularCourses.concat(resp.data.content));
        setHasMorePopularCourse(!resp.data.last);
      });
  };

  const loadAllCourses = (page: number, size = PAGE_SIZE) => {
    courseService
      .getCoursesByGradeId(
        +gradeId,
        page,
        size,
        DEFAULT_COURSE_STATUS,
        DEFAULT_SORTING
      )
      .then((resp) => {
        setAllCourses(allCourses.concat(resp.data.content));
        setHasMoreAllCourse(!resp.data.last);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    loadGrade();
    loadPopularCourses(popularCoursePageNumber);
    loadAllCourses(allCoursePageNumber);
    setIsLoading(false);
    // eslint-disable-next-line
  }, [gradeId]);

  const loadNextPopularPage = () => {
    loadPopularCourses(popularCoursePageNumber + 1);
    setPopularCoursePageNumber(popularCoursePageNumber + 1);
  };

  const loadNextAllPage = () => {
    loadAllCourses(allCoursePageNumber + 1);
    setAllCoursePageNumber(allCoursePageNumber + 1);
  };

  const handleSlideAfterChangeEvent = (current: number) => {
    if (
      lastSlideIndex < current &&
      popularCourses.length - current <= 5 &&
      hasMorePopularCourse
    ) {
      loadNextPopularPage();
      setLastSlideIndex(current);
    }
  };

  const getAllCoursView = () => {
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

  const getGradeView = (grade: IGrade) => {
    return (
      <React.Fragment>
        <Breadcrumb className="bg-transparent">
          <BreadcrumbItem href={BUILD_CATEGORY_URL(grade.primaryCategory.id)}>
            {grade.primaryCategory.name}
          </BreadcrumbItem>
          <BreadcrumbItem active>{grade.name}</BreadcrumbItem>
        </Breadcrumb>
        <div className="course-list">
          <CourseSlide
            title={`Popular Courses in ${grade.name}`}
            courses={popularCourses}
            hasMore={hasMorePopularCourse}
            slideAfterChangeHandler={(currentSlide) =>
              handleSlideAfterChangeEvent(currentSlide)
            }
            loadNextPage={loadNextPopularPage}
          />
        </div>

        <div className="course-list">
          <h5>All Courses in {grade.name}</h5>
          {getAllCoursView()}
          {hasMoreAllCourse && (
            <button
              className="btn btn-primary btn-sm"
              onClick={loadNextAllPage}
            >
              Load More
            </button>
          )}
        </div>
      </React.Fragment>
    );
  };

  if (isLoading) {
    return <Spinner size="3x" />;
  } else if (grade) {
    return <div className="width-75">{getGradeView(grade)}</div>;
  } else if (!found) {
    return <PageNotFound />;
  } else {
    return null;
  }
};
export default Grade;
