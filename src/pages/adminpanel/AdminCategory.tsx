import React, { useState, useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { CategoryService } from "../../services/CategoryService";
import {
  ICategory,
  HTTPStatus,
  AlertVariant,
  IEditCategory
} from "../../settings/DataTypes";
import Spinner from "../../components/spinner/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import {
  ADMIN_CATEGORIES_URL,
  ADMIN_PANEL_URL
} from "../../settings/Constants";
import Dialog from "../../components/modal/Modal";
import EditCategory from "./EditCategory";
import FlashGenerator from "../../components/flash/FlashGenerator";
import { parseError } from "../../utils/errorParser";

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
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [categoryErrorMessages, setCategoryErrorMessages] = useState<string[]>(
    []
  );

  useEffect(() => {
    categoryService.getCategory(categoryId).then(response => {
      setCategory(response.data);
      setIsLoaded(true);
    });
    // eslint-disable-next-line
  }, []);

  const handleModalClose = () => {
    setShowConfirmModal(false);
    setShowEditModal(false);
    setCategoryErrorMessages([]);
  };

  const handeEditCategoryClick = () => {
    setShowEditModal(true);
  };

  const handleDeleteCategory = () => {
    categoryService.deleteCategory(categoryId).then(resp => {
      if (resp.status === HTTPStatus.OK) {
        props.history.push(ADMIN_CATEGORIES_URL, {
          from: props.location,
          variant: AlertVariant.SUCCESS,
          message: "Category successfully deleted."
        });
      }
    });
    setShowConfirmModal(false);
  };

  const handleEditModalSubmit = (data: IEditCategory) => {
    categoryService
      .editCategory(data.id.toString(), data)
      .then(resp => {
        setCategory(resp.data);
        setShowEditModal(false);
      })
      .catch(err => {
        let errs = parseError(err);
        setCategoryErrorMessages(errs);
      });
  };

  let confirmDialog;
  let editDialog;
  let categoryContainer: JSX.Element = <Spinner size="3x" />;

  if (category) {
    const confirmModalBody = <div>Do you really want to delete this?</div>;

    const confirmModalFooter = (
      <React.Fragment>
        <button
          className="btn btn-danger"
          onClick={() => setShowConfirmModal(false)}
        >
          Calcel
        </button>
        <button className="btn btn-primary" onClick={handleDeleteCategory}>
          Ok
        </button>
      </React.Fragment>
    );
    confirmDialog = (
      <Dialog
        isOpen={showConfirmModal}
        onCloseHandler={handleModalClose}
        modalTitle="Are you sure?"
        modalBody={confirmModalBody}
        modalFooter={confirmModalFooter}
      />
    );

    const editModalBody = (
      <EditCategory
        id="category_edit_form"
        category={category}
        errorMessages={categoryErrorMessages}
        onSubmitHandler={(data: IEditCategory) => handleEditModalSubmit(data)}
      />
    );

    const editModalFooter = (
      <React.Fragment>
        <button className="btn btn-danger" onClick={handleModalClose}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          type="submit"
          form="category_edit_form"
        >
          Save
        </button>
      </React.Fragment>
    );
    editDialog = (
      <Dialog
        isOpen={showEditModal}
        onCloseHandler={handleModalClose}
        modalTitle="Edit Category"
        modalBody={editModalBody}
        modalFooter={editModalFooter}
      />
    );

    if (isLoaded) {
      categoryContainer = (
        <div className="admin-category-view">
          {editDialog}
          {confirmDialog}
          <FlashGenerator
            state={props.location.state}
            closeHandler={() => props.history.push(props.location.pathname)}
          />
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
              onClick={() => setShowConfirmModal(true)}
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
  }

  return <div>{categoryContainer}</div>;
};
export default withRouter(AdminCategory);
