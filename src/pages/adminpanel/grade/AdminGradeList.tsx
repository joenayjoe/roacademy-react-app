import React, { ChangeEvent, useState, useEffect } from "react";
import AdminControl from "../AdminControl";
import { ICategory, IGrade, INewGrade } from "../../../settings/DataTypes";
import { CategoryService } from "../../../services/CategoryService";
import { GradeService } from "../../../services/GradeService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RouteComponentProps, withRouter } from "react-router";
import { BUILD_ADMIN_GRADE_URL } from "../../../settings/Constants";
import Modal from "../../../components/modal/Modal";
import NewGrade from "./NewGrade";
import { camelize } from "../../../utils/StringUtils";
import { parseError } from "../../../utils/errorParser";

interface IProps extends RouteComponentProps {}

const AdminGradeList: React.FunctionComponent<IProps> = props => {
  const categoryService = new CategoryService();
  const gradeService = new GradeService();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [grades, setGrades] = useState<IGrade[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newGradeErrors, setNewGradeErrors] = useState<string[]>([]);
  const [sortCol, setSortCol] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  const theads = ["ID", "Name", "Created At"];

  useEffect(() => {
    categoryService.getCategories().then(resp => {
      setCategories(resp.data);
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

  const hanldeCategorySelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(e.target.value, 10);
    setSelectedCategoryId(categoryId);
    gradeService.getGradesByCategoryId(categoryId).then(resp => {
      setGrades(resp.data);
    });
  };

  const categoryOptions = categories.map(cat => {
    return (
      <option key={cat.id} value={cat.id}>
        {cat.name}
      </option>
    );
  });

  const handleNewGradeModalClose = () => {
    setNewGradeErrors([]);
    setShowModal(false);
  };
  const handleNewGradeClick = () => {
    setShowModal(true);
  };

  const handleNewGradeSubmit = (data: INewGrade) => {
    gradeService
      .createGrade(data)
      .then(resp => {
        setGrades([resp.data, ...grades]);
        setShowModal(false);
        setNewGradeErrors([]);
      })
      .catch(err => {
        setNewGradeErrors(parseError(err));
      });
  };

  const handleTableHeadClick = (th: string) => {
    gradeService
      .getGradesByCategoryId(selectedCategoryId, getSorting(th))
      .then(resp => {
        setGrades(resp.data);
      });
  };

  const handleTableRowClick = (grade: IGrade) => {
    props.history.push(BUILD_ADMIN_GRADE_URL(grade.id));
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
    const trows = grades.map(grade => {
      return (
        <tr
          className="link"
          key={grade.id}
          onClick={() => handleTableRowClick(grade)}
        >
          <td> {grade.id}</td>
          <td> {grade.name}</td>
          <td>{grade.createdAt}</td>
        </tr>
      );
    });
    return trows;
  };

  const gradeListTable = () => {
    if (selectedCategoryId > 0) {
      if (grades.length > 0) {
        return (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="thead-light">
                <tr>{getThead()}</tr>
              </thead>
              <tbody>{getTbody()}</tbody>
            </table>
          </div>
        );
      } else {
        return (
          <div className="alert alert-info">
            No Grades found for selected Category. Add new Grades.
          </div>
        );
      }
    } else {
      return (
        <div className="alert alert-info">
          No Category is selected. Please select a category to see grades.
        </div>
      );
    }
  };

  const newGradeBtn =
    selectedCategoryId > 0 ? (
      <div className="new-grade-btn">
        <button
          className="btn btn-primary mt-1 mb-1"
          onClick={handleNewGradeClick}
        >
          <FontAwesomeIcon icon="plus" className="pr-1" />
          New Grade
        </button>
      </div>
    ) : null;

  const gradeListView = (
    <div className="grade-list-view">
      {newGradeBtn}
      {gradeListTable()}
    </div>
  );

  let modalDialog;
  if (selectedCategoryId > 0) {
    const modalBody = (
      <NewGrade
        formId="new-grade-form"
        categoryId={selectedCategoryId}
        onSubmitHandler={handleNewGradeSubmit}
        errorMessages={newGradeErrors}
      />
    );
    const modalFooter = (
      <React.Fragment>
        <button className="btn btn-danger" onClick={handleNewGradeModalClose}>
          Cancel
        </button>
        <button className="btn btn-primary" type="submit" form="new-grade-form">
          Create
        </button>
      </React.Fragment>
    );

    modalDialog = (
      <Modal
        isOpen={showModal}
        modalTitle="New Grade"
        modalBody={modalBody}
        modalFooter={modalFooter}
        onCloseHandler={handleNewGradeModalClose}
      ></Modal>
    );
  }
  return (
    <AdminControl>
      {modalDialog}
      <div className="category-select">
        <div className="form-group row">
          <label
            htmlFor="category-select-input"
            className="col-md-3  col-form-label"
          >
            Select Category
          </label>
          <div className="col-md-9">
            <select
              id="category-select-input"
              value={selectedCategoryId}
              className="form-control"
              onChange={hanldeCategorySelect}
            >
              <option key={0} value="0" disabled>
                Choose Category
              </option>
              {categoryOptions}
            </select>
          </div>
        </div>
        {gradeListView}
      </div>
    </AdminControl>
  );
};
export default withRouter(AdminGradeList);
