import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { ICategory, AlertVariant } from "../../settings/DataTypes";
import { CategoryService } from "../../services/CategoryService";
import Spinner from "../../components/spinner/Spinner";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import BreadcrumbItem from "../../components/breadcrumb/BreadcrumbItem";
import { CATEGORIES_URL } from "../../settings/Constants";
import { AlertContext } from "../../contexts/AlertContext";
import { axiosErrorParser } from "../../utils/errorParser";
import CategoryDisplay from "./CategoryDisplay";
import PageNotFound from "../route/PageNotFound";

interface MatchParams {
  category_id: string;
}
interface IProps extends RouteComponentProps<MatchParams> {}

const Category: React.FunctionComponent<IProps> = (props) => {
  const categoryId: string = props.match.params.category_id;
  // services
  const categoryService = new CategoryService();

  // context
  const alertContext = useContext(AlertContext);

  // states
  const [category, setCategory] = useState<ICategory | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    categoryService
      .getCategoryWithGrades(categoryId)
      .then((response) => {
        setCategory(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        alertContext.show(
          "Errors :",
          AlertVariant.DANGER,
          axiosErrorParser(error)
        );
      });

    // eslint-disable-next-line
  }, [categoryId]);

  if (isLoading) {
    return <Spinner size="3x" />;
  } else if (category) {
    return (
      <div className="width-75">
        <Breadcrumb className="bg-transparent">
          <BreadcrumbItem href={CATEGORIES_URL}>Categories</BreadcrumbItem>
          <BreadcrumbItem active>{category.name}</BreadcrumbItem>
        </Breadcrumb>
        <CategoryDisplay category={category} />
      </div>
    );
  } else {
    return <PageNotFound />;
  }
};

export default withRouter(Category);
