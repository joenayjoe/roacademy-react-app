import React, { useState, useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { CategoryService } from "../../services/CategoryService";
import { ICategory } from "../../settings/DataTypes";
import Spinner from "../../components/spinner/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  ADMIN_CATEGORIES_URL,
  ADMIN_PANEL_URL
} from "../../settings/Constants";
import ConfirmModal from "../../components/modal/ConfirmModal";

interface MatchParams {
  category_id: string;
}
interface IProps extends RouteComponentProps<MatchParams> {}
const AdminCategory: React.FunctionComponent<IProps> = props => {
  const categoryId: string = props.match.params.category_id;
  const categoryService = new CategoryService();

  const [category, setCategory] = useState<ICategory | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  useEffect(() => {
    categoryService.getCategory(categoryId).then(response => {
      setCategory(response.data);
      setIsLoaded(true);
    });
    // eslint-disable-next-line
  }, []);

  const handeEditCategoryClick = () => {};
  const handleDeleteClick = () => {
    setShowConfirmModal(true);
  };

  const confirModalCallback = (status: boolean) => {
    console.log("Click ", status);
  };

  let categoryContainer: JSX.Element = <Spinner size="3x" />;
  let confirmModal = showConfirmModal ? (
    <ConfirmModal callback={(status: boolean) => confirModalCallback(status)} />
  ) : null;

  if (isLoaded && category) {
    categoryContainer = (
      <div className="admin-category-view">
        {confirmModal}
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to={ADMIN_PANEL_URL}>Admin</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={ADMIN_CATEGORIES_URL}>Categories</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Details
            </li>
          </ol>
        </nav>
        <h4>Category Details</h4>
        <div className="table-responsive">
          <table className="table table-borderless">
            <tbody>
              <tr>
                <th scope="row">ID</th>
                <td>{category.id}</td>
              </tr>
              <tr>
                <th scope="row">Name</th>
                <td>{category.name}</td>
              </tr>
              <tr>
                <th scope="row">Created At</th>
                <td>{category.createdAt}</td>
              </tr>
              <tr>
                <th scope="row">Updated At</th>
                <td>{category.updatedAt}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="action-btn-group">
          <button
            className="btn btn-danger action-btn"
            onClick={handleDeleteClick}
          >
            <FontAwesomeIcon icon="trash" className="pr-1" />
            DELETE
          </button>
          <button
            className="btn btn-primary action-btn"
            onClick={handeEditCategoryClick}
          >
            <FontAwesomeIcon icon="edit" className="pr-1" />
            EDIT
          </button>
        </div>
      </div>
    );
  }
  return <div>{categoryContainer}</div>;
};
export default withRouter(AdminCategory);
