import React, { useState, useEffect, useContext } from "react";
import AdminControl from "../AdminControl";
import {
  IGrade,
  INewGrade,
  Page,
  HTTPStatus,
} from "../../../settings/DataTypes";
import { GradeService } from "../../../services/GradeService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RouteComponentProps, withRouter } from "react-router";
import {
  BUILD_ADMIN_GRADE_URL,
  PAGE_SIZE,
  DEFAULT_SORTING_FIELD,
  DEFAULT_SORTING_ORDER,
} from "../../../settings/Constants";
import Modal from "../../../components/modal/Modal";
import NewGrade from "./NewGrade";
import { camelize } from "../../../utils/StringUtils";
import { axiosErrorParser } from "../../../utils/errorParser";
import Spinner from "../../../components/spinner/Spinner";
import Pagination from "../../../components/pagination/Pagination";
import { AlertContext } from "../../../contexts/AlertContext";
import { timeAgo } from "../../../utils/DateUtils";

interface IProps extends RouteComponentProps {}

const AdminGradeList: React.FunctionComponent<IProps> = (props) => {
  const gradeService = new GradeService();
  const alertContext = useContext(AlertContext);
  const [gradePage, setGradePage] = useState<Page<IGrade> | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [newGradeErrors, setNewGradeErrors] = useState<string[]>([]);
  const [sortCol, setSortCol] = useState<string>(DEFAULT_SORTING_FIELD);
  const [sortOrder, setSortOrder] = useState<string>(DEFAULT_SORTING_ORDER);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const theads = ["ID", "Name", "Category", "Created At"];

  useEffect(() => {
    gradeService.getGrades(0, PAGE_SIZE).then((resp) => {
      setGradePage(resp.data);
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
      .then((resp) => {
        if (resp.status === HTTPStatus.CREATED) {
          setShowModal(false);
          setNewGradeErrors([]);
          alertContext.show("Grade successfully created");
        }
      })
      .catch((err) => {
        setNewGradeErrors(axiosErrorParser(err));
      });
  };

  const handleTableHeadClick = (th: string) => {
    setIsLoaded(false);
    const currentPage = gradePage ? gradePage.number : 0;
    gradeService
      .getGrades(currentPage, PAGE_SIZE, getSorting(th))
      .then((resp) => {
        setGradePage(resp.data);
        setIsLoaded(true);
      });
  };

  const handleTableRowClick = (grade: IGrade) => {
    props.history.push(BUILD_ADMIN_GRADE_URL(grade.id));
  };

  const handlePageClick = (page: number) => {
    if (page >= 0) {
      const sorting = sortCol + "_" + sortOrder;
      setIsLoaded(false);
      gradeService.getGrades(page, PAGE_SIZE, sorting).then((resp) => {
        setGradePage(resp.data);
        setIsLoaded(true);
      });
    }
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
    const ths = theads.map((th) => {
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
    const trows =
      gradePage &&
      gradePage.content.map((grade) => {
        return (
          <tr
            className="link"
            key={grade.id}
            onClick={() => handleTableRowClick(grade)}
          >
            <td> {grade.id}</td>
            <td> {grade.name}</td>
            <td> {grade.primaryCategory.name}</td>
            <td>{timeAgo(grade.createdAt)}</td>
          </tr>
        );
      });
    return trows;
  };

  const gradeListTable = () => {
    return (
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="thead-light text-nowrap">
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

  const pagination = gradePage ? (
    <Pagination
      totalPage={gradePage.totalPages}
      first={gradePage.first}
      last={gradePage.last}
      currentPage={gradePage.number}
      pageClickHandler={handlePageClick}
    />
  ) : null;

  const gradeListView = isLoaded ? (
    <div className="grade-list-view">
      {newGradeBtn}
      {gradeListTable()}
      {pagination}
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
