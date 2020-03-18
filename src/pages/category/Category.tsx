import React, { useState, useEffect, useContext } from "react";

import "./Category.css";
import { RouteComponentProps, withRouter } from "react-router";
import {
  ICategory,
  ICourse,
  AlertVariant,
  Page
} from "../../settings/DataTypes";
import { CategoryService } from "../../services/CategoryService";
import Spinner from "../../components/spinner/Spinner";
import { CourseService } from "../../services/CourseService";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import BreadcrumbItem from "../../components/breadcrumb/BreadcrumbItem";
import { CATEGORIES_URL, PAGE_SIZE } from "../../settings/Constants";
import { AlertContext } from "../../contexts/AlertContext";
import { parseError } from "../../utils/errorParser";
import CategoryDisplay from "./CategoryDisplay";

interface MatchParams {
  category_id: string;
}
interface IProps extends RouteComponentProps<MatchParams> {}

const Category: React.FunctionComponent<IProps> = props => {
  const categoryId: string = props.match.params.category_id;
  // services
  const categoryService = new CategoryService();
  const courseService = new CourseService();

  // context
  const alertContext = useContext(AlertContext);

  // states
  const [category, setCategory] = useState<ICategory | null>(null);
  const [coursePage, setCoursePage] = useState<Page<ICourse> | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(false);
    categoryService
      .getCategoryWithGrades(categoryId)
      .then(response => {
        setCategory(response.data);
      })
      .catch(error => {
        alertContext.show("Errors :", AlertVariant.DANGER, parseError(error));
      });
    courseService
      .getCoursesByCategoryId(+categoryId, 0, PAGE_SIZE)
      .then(resp => {
        setCoursePage(resp.data);
        setIsLoaded(true);
      })
      .catch(err => {
        alertContext.show("Errors :", AlertVariant.DANGER, parseError(err));
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
        <CategoryDisplay
          category={category}
          courses={coursePage ? coursePage.content : []}
        />
      </React.Fragment>
    );
  }

  return <div className="category-container width-75">{categoryContainer}</div>;
};

export default withRouter(Category);
