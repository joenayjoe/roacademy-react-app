import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { parseQueryParams } from "../../utils/queryParser";
import { CourseService } from "../../services/CourseService";
import { ICourse, Page } from "../../settings/DataTypes";
import { PAGE_SIZE, BUILD_COURSE_URL } from "../../settings/Constants";
import Pagination from "../../components/pagination/Pagination";
import { Link } from "react-router-dom";

import "./SearchResult.css";
import Spinner from "../../components/spinner/Spinner";

interface IProps extends RouteComponentProps {}

const SearchResult: React.FunctionComponent<IProps> = (props) => {
  const queryParams = props.location.search;
  let params = parseQueryParams(queryParams);
  // service
  const courseService = new CourseService();

  // states
  const [coursePage, setCoursePage] = useState<Page<ICourse> | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    setIsLoading(true);
    courseService
      .searchCoursesByKeyword(params.query, 0, PAGE_SIZE)
      .then((resp) => {
        setCoursePage(resp.data);
        setIsLoading(false);
      });
    // eslint-disable-next-line
  }, [params.query]);

  const getSearchResult = () => {
    if (isLoading) {
      return <Spinner size="3x" />;
    }
    return (
      coursePage &&
      coursePage.content.map((course) => {
        return (
          <Link
            key={course.id}
            to={BUILD_COURSE_URL(course.id)}
            className="search-item d-flex flex-column flex-md-row"
          >
            <div>
              <h4 className="text-info">{course.name}</h4>
              <div>{course.headline}</div>
              <div>
                {"By " +
                  course.createdBy.firstName +
                  " " +
                  course.createdBy.lastName}
              </div>
              <div>{course.level + " level"}</div>
            </div>
          </Link>
        );
      })
    );
  };

  const handlePageClick = (page: number) => {
    if (page >= 0) {
      setIsLoading(true);
      courseService
        .searchCoursesByKeyword(params.query, page, PAGE_SIZE)
        .then((resp) => {
          setCoursePage(resp.data);
          setIsLoading(false);
        });
    }
  };

  const getPagination = () => {
    if (coursePage) {
      return (
        <Pagination
          first={coursePage.first}
          last={coursePage.last}
          currentPage={coursePage.number}
          totalPage={coursePage.totalPages}
          pageClickHandler={handlePageClick}
        />
      );
    }
    return null;
  };
  return (
    <div className="search-container width-75">
      <h4>Search Results </h4>
      <div className="search-results">{getSearchResult()}</div>
      {getPagination()}
    </div>
  );
};

export default SearchResult;
