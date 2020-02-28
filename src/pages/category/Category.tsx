import React, { useState, useEffect } from "react";

import "./Category.css";
import { RouteComponentProps, withRouter } from "react-router";
import { ICategory, ICourse } from "../../settings/DataTypes";
import { CategoryService } from "../../services/CategoryService";
import Spinner from "../../components/spinner/Spinner";
import GradeSlide from "../grade/GradeSlide";
import CourseSlide from "../course/CourseSlide";
import { CourseService } from "../../services/CourseService";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import BreadcrumbItem from "../../components/breadcrumb/BreadcrumbItem";
import { CATEGORIES_URL } from "../../settings/Constants";

interface MatchParams {
  category_id: string;
}
interface IProps extends RouteComponentProps<MatchParams> {}

const Category: React.FunctionComponent<IProps> = props => {
  const categoryId: string = props.match.params.category_id;
  const categoryService = new CategoryService();
  const courseService = new CourseService();

  const [category, setCategory] = useState<ICategory | null>(null);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    categoryService
      .getCategoryWithGrades(categoryId)
      .then(response => {
        setCategory(response.data);
      })
      .catch(error => {
        console.log("Error =>", error);
      });
    courseService.getCoursesByCategoryId(categoryId).then(resp => {
      setCourses(resp.data);
      setIsLoaded(true);
    });
    // eslint-disable-next-line
  }, [categoryId]);

  let categoryContainer: JSX.Element = <Spinner size="3x" />;
  if (isLoaded && category) {
    categoryContainer = (
      <React.Fragment>
        <Breadcrumb className="bg-transparent">
          <BreadcrumbItem href={CATEGORIES_URL}>Categories</BreadcrumbItem>
          <BreadcrumbItem active>{category.name}</BreadcrumbItem>
        </Breadcrumb>
        <div className="popular-courses">
          <CourseSlide
            title={`Popular Courses in ${category.name}`}
            courses={courses}
          />
        </div>

        <div className="subject-list">
          <GradeSlide
            grades={category.grades}
            title={`Topics in ${category.name}`}
          />
        </div>

        <div className="course-list">
          <CourseSlide
            title={`All Courses in ${category.name}`}
            courses={courses}
          />
        </div>
      </React.Fragment>
    );
  }

  return <div className="category-container width-75">{categoryContainer}</div>;
};

export default withRouter(Category);
