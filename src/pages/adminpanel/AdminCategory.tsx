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
import {
  ADMIN_CATEGORIES_URL,
  ADMIN_PANEL_URL
} from "../../settings/Constants";
import Modal from "../../components/modal/Modal";
import EditCategory from "./EditCategory";
import { parseError } from "../../utils/errorParser";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import BreadcrumbItem from "../../components/breadcrumb/BreadcrumbItem";
import ConfirmDialog from "../../components/modal/ConfirmDialog";
import Flash from "../../components/flash/Flash";

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
  const [errorMessage, setErrorMessage] = useState<string[]>([]);

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
    categoryService
      .deleteCategory(categoryId)
      .then(resp => {
        if (resp.status === HTTPStatus.OK) {
          props.history.push(ADMIN_CATEGORIES_URL, {
            from: props.location,
            variant: AlertVariant.SUCCESS,
            message: "Category successfully deleted."
          });
        }
      })
      .catch(err => {
        setErrorMessage(parseError(err));
      });
    setShowConfirmModal(false);
  };

  const handleEditModalSubmit = (data: IEditCategory) => {
    categoryService
      .editCategory(data.id.toString(), data)
      .then(resp => {
        setCategory(resp.data);
        handleModalClose();
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
    confirmDialog = (
      <ConfirmDialog
        isOpen={showConfirmModal}
        onConfirmHandler={handleDeleteCategory}
        onDismissHandler={() => setShowConfirmModal(false)}
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
      <Modal
        isOpen={showEditModal}
        onCloseHandler={handleModalClose}
        modalTitle="Edit Category"
        modalBody={editModalBody}
        modalFooter={editModalFooter}
      />
    );

    if (isLoaded) {
      const falshError = errorMessage.length ? (
        <Flash
          dismissible
          duration={5000}
          variant={AlertVariant.DANGER}
          errors={errorMessage}
          closeHandler={() => setErrorMessage([])}
        />
      ) : null;
      categoryContainer = (
        <div className="admin-category-view">
          {falshError}
          {editDialog}
          {confirmDialog}

          <Breadcrumb>
            <BreadcrumbItem href={ADMIN_PANEL_URL}>Admin</BreadcrumbItem>
            <BreadcrumbItem href={ADMIN_CATEGORIES_URL}>
              Category
            </BreadcrumbItem>
            <BreadcrumbItem active>Details</BreadcrumbItem>
          </Breadcrumb>
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
