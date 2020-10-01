import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import AdminControl from "../AdminControl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CourseService } from "../../../services/CourseService";
import { ICategory, ICourse, IGrade, Page } from "../../../settings/DataTypes";
import { camelize } from "../../../utils/StringUtils";
import Spinner from "../../../components/spinner/Spinner";
import { withRouter, RouteComponentProps } from "react-router-dom";
import {
  ADMIN_NEW_COURSE_URL,
  BUILD_ADMIN_COURSE_URL,
  PAGE_SIZE,
  DEFAULT_SORTING_FIELD,
  DEFAULT_SORTING_ORDER,
  ADMIN_COURSE_STATUS,
} from "../../../settings/Constants";
import Pagination from "../../../components/pagination/Pagination";
import { CategoryService } from "../../../services/CategoryService";
import { GradeService } from "../../../services/GradeService";
import { timeAgo } from "../../../utils/DateUtils";

interface IProp extends RouteComponentProps {}
const AdminCourseList: React.FunctionComponent<IProp> = (props) => {
  const categoryService = new CategoryService();
  const gradeService = new GradeService();
  const courseService = new CourseService();

  const [coursePage, setCoursePage] = useState<Page<ICourse> | null>(null);
  const [sortCol, setSortCol] = useState<string>(DEFAULT_SORTING_FIELD);
  const [sortOrder, setSortOrder] = useState<string>(DEFAULT_SORTING_ORDER);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [filteredCatId, setFilteredCatId] = useState<number>(0);
  const [filteredGradeId, setFilteredGradeId] = useState<number>(0);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [grades, setGrades] = useState<IGrade[]>([]);

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
    loadCategories();
    loadCourses(0, PAGE_SIZE);
    // eslint-disable-next-line
  }, []);

  const loadCourses = (page: number, size: number, order?: string) => {
    setIsLoading(true);

    if (!order) {
      order = sortCol + "_" + sortOrder;
    }

    if (filteredGradeId > 0) {
      courseService
        .getCoursesByGradeId(
          filteredGradeId,
          page,
          size,
          ADMIN_COURSE_STATUS,
          order
        )
        .then((resp) => {
          setCoursePage(resp.data);
          setIsLoading(false);
        });
    } else if (filteredCatId > 0) {
      courseService
        .getCoursesByCategoryId(
          filteredCatId,
          page,
          size,
          ADMIN_COURSE_STATUS,
          order
        )
        .then((resp) => {
          setCoursePage(resp.data);
          setIsLoading(false);
        });
    } else {
      courseService
        .getCourses(page, size, ADMIN_COURSE_STATUS, order)
        .then((resp) => {
          setCoursePage(resp.data);
          setIsLoading(false);
        });
    }
  };

  const loadCategories = () => {
    categoryService.getCategories().then((resp) => {
      setCategories(resp.data);
    });
  };

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
    const order = getSorting(th);
    loadCourses(0, PAGE_SIZE, order);
  };

  const handleTableRowClick = (course: ICourse) => {
    props.history.push(BUILD_ADMIN_COURSE_URL(course.id));
  };

  const handlePageClick = (page: number) => {
    if (page >= 0) {
      loadCourses(page, PAGE_SIZE);
    }
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(e.target.value, 10);
    setFilteredCatId(categoryId);
    setFilteredGradeId(0);
    if (categoryId > 0) {
      gradeService.getGradesByCategoryId(categoryId, "id_asc").then((resp) => {
        setGrades(resp.data);
      });
    }
  };

  const handleFilterSubmit = (e: FormEvent) => {
    e.preventDefault();
    loadCourses(0, PAGE_SIZE);
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

  const categoryOptions = categories.map((cat) => {
    return (
      <option key={cat.id} value={cat.id}>
        {cat.name}
      </option>
    );
  });

  const gradeOptions = grades.map((grad) => {
    return (
      <option key={grad.id} value={grad.id}>
        {grad.name}
      </option>
    );
  });

  let courseListView;
  if (isLoading) {
    courseListView = <Spinner size="3x" />;
  } else {
    const pagination =
      coursePage === null ? null : (
        <Pagination
          totalPage={coursePage.totalPages}
          first={coursePage.first}
          last={coursePage.last}
          currentPage={coursePage.number}
          pageClickHandler={handlePageClick}
        />
      );
    courseListView = (
      <div>
        <button
          className="btn btn-primary mt-1 mb-1"
          onClick={handleNewCourseClick}
        >
          <FontAwesomeIcon icon="plus" className="pr-1" />
          New Course
        </button>

        <div className="my-2">
          <form className="form-inline" onSubmit={handleFilterSubmit}>
            <div className="form-group mb-2 mr-2">
              <select
                id="category-select-input"
                value={filteredCatId}
                className="form-control"
                onChange={handleCategoryChange}
                required
              >
                <option key={0} value="0">
                  -- Select Categories --
                </option>
                {categoryOptions}
              </select>
            </div>

            <div className="form-group mb-2 mr-2">
              <select
                id="grade-select-input"
                value={filteredGradeId}
                className="form-control"
                onChange={(e) =>
                  setFilteredGradeId(parseInt(e.target.value, 10))
                }
              >
                <option key={0} value="0">
                  -- Select Grades --
                </option>
                {gradeOptions}
              </select>
            </div>
            <div className="form-group mb-2">
              <button type="submit" className="btn btn-success">
                Filter
              </button>
            </div>
          </form>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="thead-light text-nowrap">
              <tr>{getThead()}</tr>
            </thead>
            <tbody>{getTbody()}</tbody>
          </table>
        </div>
        {pagination}
      </div>
    );
  }
  return <AdminControl>{courseListView}</AdminControl>;
};
export default withRouter(AdminCourseList);
