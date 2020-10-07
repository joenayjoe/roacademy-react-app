import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertContext } from "../../contexts/AlertContext";
import { AuthContext } from "../../contexts/AuthContext";
import { CourseService } from "../../services/CourseService";
import { BUILD_COURSE_URL, PAGE_SIZE } from "../../settings/Constants";
import { AlertVariant, ICourse } from "../../settings/DataTypes";
import { axiosErrorParser } from "../../utils/errorParser";

import imagePlaeholder from "../../assets/images/image-placeholder.jpg";
import Spinner from "../../components/spinner/Spinner";

const UserCourse: React.FunctionComponent = () => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const courseService = new CourseService();

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadCourses(0, PAGE_SIZE);
    // eslint-disable-next-line
  }, []);

  const loadCourses = (page: number, size: number) => {
    setIsLoading(true);
    setCurrentPage(page);
    courseService
      .getSubscribedCoursesByUser(authContext.currentUser!.id, page, size)
      .then((resp) => {
        setCourses([...courses, ...resp.data.content]);
        setHasMore(!resp.data.last);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        alertContext.show(axiosErrorParser(err).join(" "), AlertVariant.DANGER);
      });
  };

  const loadMore = () => {
    loadCourses(currentPage + 1, PAGE_SIZE);
  };

  const getCourses = () => {
    return courses.map((course) => {
      return (
        <Link key={course.id} to={BUILD_COURSE_URL(course.id)}>
          <div className="card slick-card">
            <img
              alt={course.name}
              className="card-img-top"
              src={course.imageUrl || imagePlaeholder}
              height="100px"
            />
            <div className="card-body">
              <h5 className="card-title">{course.name}</h5>
              <div className="card-text text-secondary">
                By{" "}
                {course.createdBy.firstName + " " + course.createdBy.lastName}
              </div>
            </div>
          </div>
        </Link>
      );
    });
  };

  return (
    <div className="width-75 mt-3">
      <h4>Subscribed Courses</h4>
      <div className="dynamic-grid">{getCourses()}</div>
      {isLoading && <Spinner size="3x" />}
      {hasMore && (
        <button className="btn btn-primary btn-sm" onClick={loadMore}>
          Load More
        </button>
      )}
    </div>
  );
};
export default UserCourse;
