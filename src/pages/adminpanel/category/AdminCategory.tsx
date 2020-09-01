import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { CategoryService } from "../../../services/CategoryService";
import {
  ICategory,
  HTTPStatus,
  AlertVariant,
  IEditCategory,
} from "../../../settings/DataTypes";
import Spinner from "../../../components/spinner/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ADMIN_CATEGORIES_URL,
  ADMIN_PANEL_URL,
} from "../../../settings/Constants";
import Modal from "../../../components/modal/Modal";
import EditCategory from "./EditCategory";
import { axiosErrorParser } from "../../../utils/errorParser";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import BreadcrumbItem from "../../../components/breadcrumb/BreadcrumbItem";
import ConfirmDialog from "../../../components/modal/ConfirmDialog";
import Alert from "../../../components/flash/Alert";
import { AlertContext } from "../../../contexts/AlertContext";
import PageNotFound from "../../route/PageNotFound";

interface MatchParams {
  category_id: string;
}
interface IProps extends RouteComponentProps<MatchParams> {}
const AdminCategory: React.FunctionComponent<IProps> = (props) => {
  const alertContext = useContext(AlertContext);
  const categoryId: string = props.match.params.category_id;
  const categoryService = new CategoryService();

  const [category, setCategory] = useState<ICategory | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [categoryErrorMessages, setCategoryErrorMessages] = useState<string[]>(
    []
  );
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [found, setFound] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    categoryService
      .getCategory(categoryId)
      .then((response) => {
        setCategory(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        setFound(false);
        alertContext.show(
          axiosErrorParser(err).join(", "),
          AlertVariant.DANGER
        );
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
      .then((resp) => {
        if (resp.status === HTTPStatus.OK) {
          alertContext.show("Category successfully deleted.");
          props.history.push(ADMIN_CATEGORIES_URL);
        }
      })
      .catch((err) => {
        setErrorMessage(axiosErrorParser(err));
      });
    setShowConfirmModal(false);
  };

  const handleEditModalSubmit = (data: IEditCategory) => {
    categoryService
      .editCategory(data.id.toString(), data)
      .then((resp) => {
        setCategory(resp.data);
        alertContext.show("Category successfully updated.");
        handleModalClose();
      })
      .catch((err) => {
        let errs = axiosErrorParser(err);
        setCategoryErrorMessages(errs);
      });
  };

  if (isLoading) {
    return <Spinner size="3x" />;
  } else if (category) {
    const confirmDialog = (
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
    const editDialog = (
      <Modal
        isOpen={showEditModal}
        onCloseHandler={handleModalClose}
        modalTitle="Edit Category"
        modalBody={editModalBody}
        modalFooter={editModalFooter}
      />
    );

    const falshError = (
      <Alert
        dismissible
        duration={5000}
        variant={AlertVariant.DANGER}
        errors={errorMessage}
        closeHandler={() => setErrorMessage([])}
      />
    );

    return (
      <div>
        <div className="admin-category-view width-75">
          {errorMessage.length > 0 ? falshError : null}
          {editDialog}
          {confirmDialog}

          <Breadcrumb className="bg-transparent">
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
      </div>
    );
  } else if (!found) {
    return <PageNotFound />;
  } else {
    return null;
  }
};
export default withRouter(AdminCategory);
