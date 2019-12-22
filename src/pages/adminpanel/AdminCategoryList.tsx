import React, { useState, useEffect } from "react";
import AdminControl from "./AdminControl";
import {
  ICategory,
  INewCategory,
  AlertVariant
} from "../../settings/DataTypes";
import { CategoryService } from "../../services/CategoryService";
import { RouteComponentProps, withRouter } from "react-router";
import { BUILD_ADMIN_CATEGORY_URL } from "../../settings/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../../components/modal/Modal";
import NewCategory from "./NewCategory";
import FlashGenerator from "../../components/flash/FlashGenerator";
import Spinner from "../../components/spinner/Spinner";
import { parseError } from "../../utils/errorParser";

interface IProps extends RouteComponentProps {}

const AdminCategoryList: React.FunctionComponent<IProps> = props => {
  const categoryService = new CategoryService();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newCategoryErrors, setNewCategoryErrors] = useState<string[]>([]);

  const theads: string[] = ["ID", "Name", "Created At"];

  useEffect(() => {
    categoryService.getCategories().then(resp => {
      setCategories(resp.data);
      setIsLoading(false);
    });
    // eslint-disable-next-line
  }, []);

  const handleTableHeadClick = (th: string) => {};

  const handleTableRowClick = (cat: ICategory) => {
    props.history.push(BUILD_ADMIN_CATEGORY_URL(cat.id));
  };

  const handleNewCategoryClick = () => {
    setShowModal(true);
  };

  const handleNewCategorySave = (data: INewCategory) => {
    categoryService
      .createCategory(data)
      .then(resp => {
        setCategories([...categories, resp.data]);
        setShowModal(false);
        props.history.push(props.location.pathname, {
          from: props.location,
          variant: AlertVariant.SUCCESS,
          message: "Category successfully created."
        });
      })
      .catch(err => {
        const errorMsg: string[] = parseError(err);
        setNewCategoryErrors(errorMsg);
      });
  };

  const getThead = () => {
    const ths = theads.map(th => {
      return (
        <th className="link" key={th} onClick={() => handleTableHeadClick(th)}>
          {th}
        </th>
      );
    });
    return ths;
  };

  const getTbody = () => {
    const trows = categories.map(cat => {
      return (
        <tr
          className="link"
          key={cat.id}
          onClick={() => handleTableRowClick(cat)}
        >
          <td key={cat.id}> {cat.id}</td>
          <td key={cat.name}> {cat.name}</td>
          <td key={cat.createdAt && cat.createdAt.toString()}>
            {cat.createdAt}
          </td>
        </tr>
      );
    });
    return trows;
  };

  const handleNewCategoryModalClose = () => {
    setNewCategoryErrors([]);
    setShowModal(false);
  };
  const modalBody = (
    <NewCategory
      id="new-category-form"
      errorMessages={newCategoryErrors}
      onSubmitHandler={(data: INewCategory) => handleNewCategorySave(data)}
    />
  );
  const modalFooter = (
    <React.Fragment>
      <button className="btn btn-danger" onClick={handleNewCategoryModalClose}>
        Cancel
      </button>
      <button
        className="btn btn-primary"
        type="submit"
        form="new-category-form"
      >
        Create
      </button>
    </React.Fragment>
  );

  const modalDialog = (
    <Modal
      isOpen={showModal}
      modalTitle="Create New Category"
      modalBody={modalBody}
      modalFooter={modalFooter}
      onCloseHandler={handleNewCategoryModalClose}
    />
  );

  return isLoading ? (
    <Spinner size="3x" />
  ) : (
    <AdminControl>
      <FlashGenerator
        state={props.location.state}
        closeHandler={() => props.history.push(props.location.pathname)}
      />
      {modalDialog}
      <div>
        <button
          className="btn btn-primary float-md-right mt-1 mb-1"
          onClick={handleNewCategoryClick}
        >
          <FontAwesomeIcon icon="plus" className="pr-1" />
          New Category
        </button>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>{getThead()}</tr>
            </thead>
            <tbody>{getTbody()}</tbody>
          </table>
        </div>
      </div>
    </AdminControl>
  );
};
export default withRouter(AdminCategoryList);
