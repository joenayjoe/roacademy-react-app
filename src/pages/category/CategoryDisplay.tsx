import React, { useState, useEffect, useContext } from "react";
import { ICategory, ICourse, AlertVariant } from "../../settings/DataTypes";
import CourseSlide from "../course/CourseSlide";
import GradeSlide from "../grade/GradeSlide";
import { CourseService } from "../../services/CourseService";
import { PAGE_SIZE } from "../../settings/Constants";
import { AlertContext } from "../../contexts/AlertContext";
import { parseError } from "../../utils/errorParser";

interface IProps {
  category: ICategory;
}

const CategoryDisplay: React.FunctionComponent<IProps> = props => {
  // services
  const courseService = new CourseService();

  // context
  const alertContext = useContext(AlertContext);
  // states
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [lastSlideIndex, setLastSlideIndex] = useState<number>(0);

  const loadCourses = (page: number, size = PAGE_SIZE) => {
    courseService
      .getCoursesByCategoryId(props.category.id, page, size)
      .then(resp => {
        setCourses(courses.concat(resp.data.content));
        if (!resp.data.last) {
          setHasMore(true);
        }
      })
      .catch(err => {
        alertContext.show("Errors :", AlertVariant.DANGER, parseError(err));
      });
  };
  useEffect(() => {
    loadCourses(pageNumber);
    // eslint-disable-next-line
  }, []);

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

  return (
    <div className="category-display-container">
      <div className="popular-courses">
        <CourseSlide
          title={`Popular Courses in ${props.category.name}`}
          courses={courses}
          hasMore={hasMore}
          slideAfterChangeHandler={currentSlide =>
            handleSlideAfterChangeEvent(currentSlide)
          }
          loadNextPage={loadNextPage}
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
        <CourseSlide
          title={`All Courses in ${props.category.name}`}
          courses={courses}
          hasMore={hasMore}
          slideAfterChangeHandler={currentSlide =>
            handleSlideAfterChangeEvent(currentSlide)
          }
          loadNextPage={loadNextPage}
        />
      </div>
    </div>
  );
};
export default CategoryDisplay;
