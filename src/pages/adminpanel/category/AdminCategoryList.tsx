import React, { useState, useEffect } from "react";
import AdminControl from "../AdminControl";
import {
  ICategory,
  INewCategory,
  HTTPStatus,
  AlertVariant
} from "../../../settings/DataTypes";
import { CategoryService } from "../../../services/CategoryService";
import { RouteComponentProps, withRouter } from "react-router";
import {
  BUILD_ADMIN_CATEGORY_URL,
  DEFAULT_SORTING_FIELD,
  DEFAULT_SORTING_ORDER,
  ADMIN_CATEGORIES_URL
} from "../../../settings/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "../../../components/modal/Modal";
import NewCategory from "./NewCategory";
import FlashGenerator from "../../../components/flash/FlashGenerator";
import Spinner from "../../../components/spinner/Spinner";
import { parseError } from "../../../utils/errorParser";
import { camelize } from "../../../utils/StringUtils";

interface IProps extends RouteComponentProps {}

const AdminCategoryList: React.FunctionComponent<IProps> = props => {
  const categoryService = new CategoryService();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [newCategoryErrors, setNewCategoryErrors] = useState<string[]>([]);

  const [sortCol, setSortCol] = useState<string>(DEFAULT_SORTING_FIELD);
  const [sortOrder, setSortOrder] = useState<string>(DEFAULT_SORTING_ORDER);

  const theads: string[] = ["ID", "Name", "Created At"];

  useEffect(() => {
    categoryService.getCategories().then(resp => {
      setCategories(resp.data);
      setIsLoading(false);
    });
    // eslint-disable-next-line
  }, []);

  const getSorting = (field: string) => {
    field = camelize(field);
    const order = sortOrder === "asc" ? "desc" : "asc";
    setSortCol(field);
    setSortOrder(order);
    return field + "_" + order;
  };

  const handleTableHeadClick = (th: string) => {
    setIsLoading(true);
    categoryService.getCategories(getSorting(th)).then(resp => {
      setCategories(resp.data);
      setIsLoading(false);
    });
  };

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
        if (resp.status === HTTPStatus.CREATED) {
          setCategories([resp.data, ...categories]);
          setShowModal(false);
          props.history.push(ADMIN_CATEGORIES_URL, {
            from: props.location,
            variant: AlertVariant.SUCCESS,
            message: "Category successfully created."
          });
        }
      })
      .catch(err => {
        const errorMsg: string[] = parseError(err);
        setNewCategoryErrors(errorMsg);
      });
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
    const ths = theads.map(th => {
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
    const trows = categories.map(cat => {
      return (
        <tr
          className="link"
          key={cat.id}
          onClick={() => handleTableRowClick(cat)}
        >
          <td> {cat.id}</td>
          <td> {cat.name}</td>
          <td>{cat.createdAt}</td>
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
          className="btn btn-primary mt-1 mb-1"
          onClick={handleNewCategoryClick}
        >
          <FontAwesomeIcon icon="plus" className="pr-1" />
          New Category
        </button>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="thead-light">
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
