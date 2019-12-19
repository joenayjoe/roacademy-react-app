import React, { useState, useEffect, useContext } from "react";
import AdminControl from "./AdminControl";
import { ICategory, ModalIdentifier } from "../../settings/DataTypes";
import { CategoryService } from "../../services/CategoryService";
import { RouteComponentProps, withRouter } from "react-router";
import { BUILD_ADMIN_CATEGORY_URL } from "../../settings/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ModalContext } from "../../contexts/ModalContext";

interface IProps extends RouteComponentProps {}

const AdminCategoryList: React.FunctionComponent<IProps> = props => {
  const categoryService = new CategoryService();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const modalContext = useContext(ModalContext);
  const theads: string[] = ["ID", "Name", "Created At"];

  useEffect(() => {
    categoryService.getCategories().then(resp => {
      setCategories(resp.data);
    });
    // eslint-disable-next-line
  }, []);

  const handleTableHeadClick = (th: string) => {};

  const handleTableRowClick = (cat: ICategory) => {
    props.history.push(BUILD_ADMIN_CATEGORY_URL(cat.id));
  };

  const handleNewCategoryClick = () => {
    modalContext.switchModal(ModalIdentifier.NEW_CATEGORY_MODAL);
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

  return (
    <AdminControl>
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
