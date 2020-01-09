import React, { useState, useEffect } from "react";
import AdminControl from "../AdminControl";
import { IGrade, INewGrade } from "../../../settings/DataTypes";
import { GradeService } from "../../../services/GradeService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RouteComponentProps, withRouter } from "react-router";
import { BUILD_ADMIN_GRADE_URL } from "../../../settings/Constants";
import Modal from "../../../components/modal/Modal";
import NewGrade from "./NewGrade";
import { camelize } from "../../../utils/StringUtils";
import { parseError } from "../../../utils/errorParser";
import Spinner from "../../../components/spinner/Spinner";

interface IProps extends RouteComponentProps {}

const AdminGradeList: React.FunctionComponent<IProps> = props => {
  const gradeService = new GradeService();

  const [grades, setGrades] = useState<IGrade[]>([]);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [newGradeErrors, setNewGradeErrors] = useState<string[]>([]);
  const [sortCol, setSortCol] = useState<string>("id");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const theads = ["ID", "Name", "Category", "Created At"];

  useEffect(() => {
    gradeService.getGrades().then(resp => {
      setGrades(resp.data);
      setIsLoaded(true);
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
    setIsLoaded(false);
    gradeService.getGrades(getSorting(th)).then(resp => {
      setGrades(resp.data);
      setIsLoaded(true);
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
          <td> {grade.name}</td>
          <td>{grade.createdAt}</td>
        </tr>
      );
    });
    return trows;
  };

  const gradeListTable = () => {
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
  };

  const newGradeBtn = (
    <div className="new-grade-btn">
      <button
        className="btn btn-primary mt-1 mb-1"
        onClick={handleNewGradeClick}
      >
        <FontAwesomeIcon icon="plus" className="pr-1" />
        New Grade
      </button>
    </div>
  );

  const gradeListView = isLoaded ? (
    <div className="grade-list-view">
      {newGradeBtn}
      {gradeListTable()}
    </div>
  ) : (
    <Spinner size="3x" />
  );

  let modalDialog;
  const modalBody = (
    <NewGrade
      formId="new-grade-form"
      onSubmitHandler={handleNewGradeSubmit}
      errorMessages={newGradeErrors}
    />
  );
  const modalFooter = (
    <React.Fragment>
      <button className="btn btn-danger" onClick={handleNewGradeModalClose}>
        <FontAwesomeIcon icon="times" />
        <span className="ml-2">Cancel</span>
      </button>
      <button className="btn btn-primary" type="submit" form="new-grade-form">
        <FontAwesomeIcon icon="save" />
        <span className="ml-2">Create</span>
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
  return (
    <AdminControl>
      {modalDialog}
      {gradeListView}
    </AdminControl>
  );
};
export default withRouter(AdminGradeList);
