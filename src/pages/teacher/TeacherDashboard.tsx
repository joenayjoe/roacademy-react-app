import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  TEACHER_NEW_COURSE_URL,
  PAGE_SIZE,
  DEFAULT_SORTING_FIELD,
  ADMIN_COURSE_STATUS,
  BUILD_TEACHER_COURSE_URL,
  HOME_URL,DEFAULT_SORTING_ORDER
} from "../../settings/Constants";
import { ICourse, Page, AlertVariant } from "../../settings/DataTypes";
import { AuthContext } from "../../contexts/AuthContext";
import Spinner from "../../components/spinner/Spinner";
import { CourseService } from "../../services/CourseService";
import { camelize } from "../../utils/StringUtils";
import { AlertContext } from "../../contexts/AlertContext";
import { axiosErrorParser } from "../../utils/errorParser";
import Pagination from "../../components/pagination/Pagination";
import { timeAgo } from "../../utils/DateUtils";

interface IProp extends RouteComponentProps {}
const TeacherDashboard: React.FunctionComponent<IProp> = (props) => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const courseService = new CourseService();

  const [coursePage, setCoursePage] = useState<Page<ICourse>>();

  const [sortCol, setSortCol] = useState<string>(DEFAULT_SORTING_FIELD);
  const [sortOrder, setSortOrder] = useState<string>(DEFAULT_SORTING_ORDER);

  const [loadingCourse, setLoadingCourse] = useState<boolean>(true);

  const theads: string[] = [
    "ID",
    "Name",
    "Status",
    "Level",
    "Hits",
    "Category",
    "Grade",
    "Created At",
  ];

  useEffect(() => {
    loadCourses(0, PAGE_SIZE)
    // eslint-disable-next-line
  }, []);

  const loadCourses = (page: number, size: number, order? :string) => {
    if (!order) {
      order = sortCol + "_" + sortOrder;
    }

    if(!authContext.currentUser) {
      alertContext.show("Access denied!", AlertVariant.DANGER);
      props.history.push(HOME_URL);
    } else {
      setLoadingCourse(true);
      courseService
        .getCoursesByTeacher(
          authContext.currentUser.id,
          0,
          PAGE_SIZE,
          ADMIN_COURSE_STATUS,
          order
        )
        .then((resp) => {
          setCoursePage(resp.data);
          setLoadingCourse(false);
        })
        .catch((err) => {
          console.log("Error = ", err);
          alertContext.show(
            "Failed to load courses.",
            AlertVariant.WARNING,
            axiosErrorParser(err)
          );
        });
    }
  }

  const handleNewCourseClick = () => {
    props.history.push(TEACHER_NEW_COURSE_URL);
  };

  const getSorting = (field: string) => {
    field = camelize(field);
    const order = sortOrder === "asc" ? "desc" : "asc";
    setSortCol(field);
    setSortOrder(order);
    return field + "_" + order;
  };

  const handleTableHeadClick = (th: string) => {
    loadCourses(0, PAGE_SIZE, getSorting(th))
  };

  const handleTableRowClick = (course: ICourse) => {
    if (authContext.currentUser) {
      props.history.push(
        BUILD_TEACHER_COURSE_URL(authContext.currentUser.id, course.id)
      );
    } else {
      alertContext.show("Access denied!", AlertVariant.DANGER);
      props.history.push(HOME_URL);
    }
  };

  const handlePageClick = (page: number) => {
    if(page >=0) {
      loadCourses(page, PAGE_SIZE)
    }
  };

  const sortDirIcon = (th: string) => {
    th = camelize(th);
    if (sortCol === th) {
      const arrow = sortOrder === "asc" ? "arrow-down" : "arrow-up";
      return <FontAwesomeIcon icon={arrow} color="#007791" size="sm" />;
    }
    return null;
  };

  const getThead = () => {
    const ths = theads.map((th) => {
      return (
        <th className="link" key={th} onClick={() => handleTableHeadClick(th)}>
          <span className="mr-1">{th}</span>
          {sortDirIcon(th)}
        </th>
      );
    });
    return ths;
  };

  const getTbody = () => {
    const trows =
      coursePage &&
      coursePage.content.map((course) => {
        return (
          <tr
            className="link"
            key={course.id}
            onClick={() => handleTableRowClick(course)}
          >
            <td> {course.id}</td>
            <td> {course.name}</td>
            <td> {course.status}</td>
            <td> {course.level}</td>
            <td> {course.hits}</td>
            <td> {course.primaryCategory.name}</td>
            <td> {course.primaryGrade.name}</td>
            <td>{timeAgo(course.createdAt)}</td>
          </tr>
        );
      });
    return trows;
  };

  const getPagination = () => {
    if (coursePage != null) {
      return (
        <Pagination
          totalPage={coursePage.totalPages}
          first={coursePage.first}
          last={coursePage.last}
          currentPage={coursePage.number}
          pageClickHandler={handlePageClick}
        />
      );
    }
    return null;
  };

  return (
    <div className="teacher-dashboard-wrapper width-75">
      <div className="new-course-action mt-2 mb-2">
        <button
          className="btn btn-primary mt-1 mb-1"
          onClick={handleNewCourseClick}
        >
          <FontAwesomeIcon icon="plus" className="pr-1" />
          New Course
        </button>
      </div>
      <div className="teacher-courses-container">
        <div className="table-responsive mt-2">
          <table className="table table-hover">
            <thead className="thead-light text-nowrap">
              <tr>{getThead()}</tr>
            </thead>
            <tbody>{getTbody()}</tbody>
          </table>
          {loadingCourse && <Spinner size="3x" />}
        </div>
        {getPagination()}
      </div>
    </div>
  );
};
export default TeacherDashboard;
