import React, { useEffect, useState } from "react";
import AdminControl from "../AdminControl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CourseService } from "../../../services/CourseService";
import { ICourse } from "../../../settings/DataTypes";
import { camelize } from "../../../utils/StringUtils";
import Spinner from "../../../components/spinner/Spinner";
import { withRouter, RouteComponentProps } from "react-router-dom";
import {
  ADMIN_NEW_COURSE_URL,
  BUILD_ADMIN_COURSE_URL
} from "../../../settings/Constants";

interface IProp extends RouteComponentProps {}
const AdminCourseList: React.FunctionComponent<IProp> = props => {
  const courseService = new CourseService();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [sortCol, setSortCol] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const theads: string[] = [
    "ID",
    "Name",
    "Status",
    "Level",
    "Hits",
    "Category",
    "Grade",
    "Created At"
  ];

  useEffect(() => {
    courseService.getCourses().then(resp => {
      setCourses(resp.data);
      setIsLoading(false);
    });
    // eslint-disable-next-line
  }, []);

  const handleNewCourseClick = () => {
    props.history.push(ADMIN_NEW_COURSE_URL);
  };

  const getSorting = (field: string) => {
    field = camelize(field);
    const order = sortOrder === "asc" ? "desc" : "asc";
    setSortCol(field);
    setSortOrder(order);
    return field + "_" + order;
  };

  const handleTableHeadClick = (th: string) => {
    setIsLoading(true);
    courseService.getCourses(getSorting(th)).then(resp => {
      setCourses(resp.data);
      setIsLoading(false);
    });
  };

  const handleTableRowClick = (course: ICourse) => {
    props.history.push(BUILD_ADMIN_COURSE_URL(course.id));
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
    const ths = theads.map(th => {
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
    const trows = courses.map(course => {
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
          <td>{course.createdAt}</td>
        </tr>
      );
    });
    return trows;
  };

  let courseListView;
  if (isLoading) {
    courseListView = <Spinner size="3x" />;
  } else {
    courseListView = (
      <div>
        <button
          className="btn btn-primary mt-1 mb-1"
          onClick={handleNewCourseClick}
        >
          <FontAwesomeIcon icon="plus" className="pr-1" />
          New Course
        </button>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="thead-light text-nowrap">
              <tr>{getThead()}</tr>
            </thead>
            <tbody>{getTbody()}</tbody>
          </table>
        </div>
      </div>
    );
  }
  return <AdminControl>{courseListView}</AdminControl>;
};
export default withRouter(AdminCourseList);
