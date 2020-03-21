import React, { useState, useEffect } from "react";

import "./Grade.css";
import { RouteComponentProps } from "react-router";
import { IGrade, ICourse } from "../../settings/DataTypes";
import { GradeService } from "../../services/GradeService";
import Spinner from "../../components/spinner/Spinner";
import CourseSlide from "../course/CourseSlide";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import BreadcrumbItem from "../../components/breadcrumb/BreadcrumbItem";
import {
  BUILD_CATEGORY_URL,
  DEFAULT_COURSE_STATUS,
  PAGE_SIZE
} from "../../settings/Constants";
import { CourseService } from "../../services/CourseService";

interface matchedParams {
  grade_id: string;
}

interface IProps extends RouteComponentProps<matchedParams> {}

const Grade: React.FunctionComponent<IProps> = props => {
  // query prams
  const gradeId = props.match.params.grade_id;

  // services
  const gradeService = new GradeService();
  const courseService = new CourseService();

  const [grade, setGrade] = useState<IGrade | null>(null);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [lastSlideIndex, setLastSlideIndex] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const loadCourses = (page: number, size = PAGE_SIZE) => {
    courseService.getCoursesByGradeId(+gradeId, page, size).then(resp => {
      setCourses(resp.data.content);
      if (!resp.data.last) {
        setHasMore(true);
      }
    });
  };
  useEffect(() => {
    setIsLoaded(false);
    gradeService
      .getGradeWithCourses(+gradeId, DEFAULT_COURSE_STATUS)
      .then(response => {
        setGrade(response.data);
        setIsLoaded(true);
      });
    loadCourses(pageNumber);
    // eslint-disable-next-line
  }, [gradeId]);

  const loadNextPage = () => {
    loadCourses(pageNumber + 1);
    setPageNumber(pageNumber + 1);
  };

  const handleSlideAfterChangeEvent = (current: number) => {
    if (lastSlideIndex < current && courses.length - current <= 5 && hasMore) {
      loadNextPage();
      setLastSlideIndex(current);
    }
  };

  let gradeContainerItems: JSX.Element = <Spinner size="3x" />;
  if (grade && isLoaded) {
    gradeContainerItems = (
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
            courses={courses}
            hasMore={hasMore}
            slideAfterChangeHandler={currentSlide =>
              handleSlideAfterChangeEvent(currentSlide)
            }
            loadNextPage={loadNextPage}
          />
        </div>

        <div className="course-list">
          <CourseSlide
            title={`All Courses in ${grade.name}`}
            courses={courses}
            hasMore={hasMore}
            slideAfterChangeHandler={currrentSlide =>
              handleSlideAfterChangeEvent(currrentSlide)
            }
            loadNextPage={loadNextPage}
          />
        </div>
      </React.Fragment>
    );
  }
  return <div className="grade-container width-75">{gradeContainerItems}</div>;
};
export default Grade;
