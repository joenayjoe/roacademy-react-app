import React, { useEffect, useState, useContext } from "react";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import BreadcrumbItem from "../../../components/breadcrumb/BreadcrumbItem";
import {
  ADMIN_PANEL_URL,
  ADMIN_GRADES_URL,
  BUILD_ADMIN_CATEGORY_URL,
  HOME_URL,
} from "../../../settings/Constants";
import { RouteComponentProps, withRouter } from "react-router";
import { GradeService } from "../../../services/GradeService";
import {
  IGrade,
  IEditGrade,
  HTTPStatus,
  AlertVariant,
  RoleType,
} from "../../../settings/DataTypes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Spinner from "../../../components/spinner/Spinner";
import ConfirmDialog from "../../../components/modal/ConfirmDialog";
import Modal from "../../../components/modal/Modal";
import EditGrade from "./EditGrade";
import { axiosErrorParser } from "../../../utils/errorParser";
import { Link } from "react-router-dom";
import Alert from "../../../components/flash/Alert";
import { AlertContext } from "../../../contexts/AlertContext";
import { AuthContext } from "../../../contexts/AuthContext";
import PageNotFound from "../../route/PageNotFound";

interface MatchParams {
  grade_id: string;
}
interface IProp extends RouteComponentProps<MatchParams> {}
const AdminGrade: React.FunctionComponent<IProp> = (props) => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const gradeId: string = props.match.params.grade_id;
  const gradeService = new GradeService();
  const [grade, setGrade] = useState<IGrade | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [gradeErrorMessages, setGradeErrorMessages] = useState<string[]>([]);

  useEffect(() => {
    if (authContext.hasRole(RoleType.ADMIN)) {
      setIsLoading(true);
      gradeService
        .getGrade(+gradeId)
        .then((resp) => {
          setGrade(resp.data);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          alertContext.show(
            axiosErrorParser(err).join(", "),
            AlertVariant.DANGER
          );
        });
    } else {
      alertContext.show("Access denied");
      props.history.push(HOME_URL);
    }
    // eslint-disable-next-line
  }, [gradeId]);

  const handleModalClose = () => {
    setShowConfirmModal(false);
    setShowEditModal(false);
    setGradeErrorMessages([]);
  };

  const handleEditModalSubmit = (data: IEditGrade) => {
    gradeService
      .editGrade(gradeId, data)
      .then((resp) => {
        setGrade(resp.data);
        handleModalClose();
        alertContext.show("Grade successfully updated");
      })
      .catch((err) => {
        setGradeErrorMessages(axiosErrorParser(err));
      });
  };

  const handeEditGradeClick = () => {
    setShowEditModal(true);
  };

  const handleDeleteGrade = () => {
    setShowConfirmModal(false);
    gradeService
      .deleteGrade(+gradeId)
      .then((resp) => {
        if (resp.status === HTTPStatus.OK) {
          alertContext.show("Grade successfully deleted.");
          props.history.push(ADMIN_GRADES_URL);
        }
      })
      .catch((err) => {
        setGradeErrorMessages(axiosErrorParser(err));
      });
  };

  const flashError = gradeErrorMessages.length ? (
    <Alert
      dismissible
      duration={5000}
      variant={AlertVariant.DANGER}
      errors={gradeErrorMessages}
      closeHandler={() => setGradeErrorMessages([])}
    />
  ) : null;

  const confirmDialog = (
    <ConfirmDialog
      isOpen={showConfirmModal}
      onConfirmHandler={handleDeleteGrade}
      onDismissHandler={() => setShowConfirmModal(false)}
    />
  );

  if (isLoading) {
    return <Spinner size="3x" />;
  } else if (grade) {
    const editModalBody = (
      <EditGrade
        id="grade_edit_form"
        grade={grade}
        errorMessages={gradeErrorMessages}
        onSubmitHandler={(data: IEditGrade) => handleEditModalSubmit(data)}
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
          form="grade_edit_form"
        >
          Save
        </button>
      </React.Fragment>
    );
    const editDialog = (
      <Modal
        isOpen={showEditModal}
        onCloseHandler={handleModalClose}
        modalTitle="Edit Grade"
        modalBody={editModalBody}
        modalFooter={editModalFooter}
      />
    );

    return (
      <div className="admin-grade-view width-75">
        {flashError}
        {confirmDialog}
        {editDialog}

        <Breadcrumb>
          <BreadcrumbItem href={ADMIN_PANEL_URL}>Admin</BreadcrumbItem>
          <BreadcrumbItem href={ADMIN_GRADES_URL}>Grades</BreadcrumbItem>
          <BreadcrumbItem active>Details</BreadcrumbItem>
        </Breadcrumb>

        <h4>Grade Details</h4>
        <div className="table-responsive">
          <table className="table table-borderless">
            <tbody>
              <tr>
                <th scope="row">ID</th>
                <td>{grade.id}</td>
              </tr>
              <tr>
                <th scope="row">Name</th>
                <td>{grade.name}</td>
              </tr>
              <tr>
                <th scope="row">Category</th>
                <td>
                  <Link to={BUILD_ADMIN_CATEGORY_URL(grade.primaryCategory.id)}>
                    {grade.primaryCategory.name}
                  </Link>
                </td>
              </tr>
              <tr>
                <th scope="row">Created At</th>
                <td>{grade.createdAt}</td>
              </tr>
              <tr>
                <th scope="row">Updated At</th>
                <td>{grade.updatedAt}</td>
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
            onClick={handeEditGradeClick}
          >
            <FontAwesomeIcon icon="edit" className="pr-1" />
            EDIT
          </button>
        </div>
      </div>
    );
  } else {
    return <PageNotFound />;
  }
};
export default withRouter(AdminGrade);
