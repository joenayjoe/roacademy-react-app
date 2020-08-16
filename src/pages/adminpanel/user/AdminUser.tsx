import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import { IUser, AlertVariant, HTTPStatus } from "../../../settings/DataTypes";
import UserService from "../../../services/UserService";
import { AlertContext } from "../../../contexts/AlertContext";
import { axiosErrorParser } from "../../../utils/errorParser";
import Spinner from "../../../components/spinner/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmDialog from "../../../components/modal/ConfirmDialog";
import {
  ADMIN_USERS_URL,
  BUILD_ADMIN_USER_EDIT_URL,
  ADMIN_PANEL_URL
} from "../../../settings/Constants";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import BreadcrumbItem from "../../../components/breadcrumb/BreadcrumbItem";

interface MatchParams {
  user_id: string;
}
interface IProps extends RouteComponentProps<MatchParams> {}
const AdminUser: React.FunctionComponent<IProps> = props => {
  const userId: string = props.match.params.user_id;
  const alertContext = useContext(AlertContext);
  // service
  const userService = new UserService();

  // states
  const [user, setUser] = useState<IUser | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    userService
      .getUser(+userId)
      .then(resp => {
        setUser(resp.data);
        setIsLoaded(true);
      })
      .catch(err => {
        alertContext.show(axiosErrorParser(err).join(", "), AlertVariant.DANGER);
      });
    // eslint-disable-next-line
  }, [userId]);

  const handleDeleteUser = () => {
    userService
      .deleteUser(+userId)
      .then(resp => {
        if (resp.status === HTTPStatus.OK) {
          alertContext.show(`User with ID ${userId} deleted successfully`);
          props.history.push(ADMIN_USERS_URL);
        } else {
          alertContext.show("User delete failed.", AlertVariant.INFO);
        }
      })
      .catch(err => {
        alertContext.show(axiosErrorParser(err).join(", "), AlertVariant.DANGER);
      });
  };

  let confirmDialog;
  if (user) {
    confirmDialog = (
      <ConfirmDialog
        isOpen={showConfirmModal}
        onConfirmHandler={handleDeleteUser}
        onDismissHandler={() => setShowConfirmModal(false)}
      />
    );
  }
  const userView = () => {
    if (isLoaded && user) {
      return (
        <div>
          <Breadcrumb className="bg-transparent">
            <BreadcrumbItem href={ADMIN_PANEL_URL}>Admin</BreadcrumbItem>
            <BreadcrumbItem href={ADMIN_USERS_URL}>Users</BreadcrumbItem>
            <BreadcrumbItem active>User Details</BreadcrumbItem>
          </Breadcrumb>
          <h4>Category Details</h4>
          <div className="table-responsive">
            <table className="table table-borderless">
              <tbody>
                <tr>
                  <th scope="row">ID</th>
                  <td>{user.id}</td>
                </tr>
                <tr>
                  <th scope="row">First Name</th>
                  <td>{user.firstName}</td>
                </tr>
                <tr>
                  <th scope="row">Last Name</th>
                  <td>{user.lastName}</td>
                </tr>
                <tr>
                  <th scope="row">Email</th>
                  <td>{user.email}</td>
                </tr>
                <tr>
                  <th scope="row">Roles</th>
                  <td>{user.roles.map(r => r.name).join(", ")}</td>
                </tr>
                <tr>
                  <th scope="row">Created At</th>
                  <td>{user.createdAt}</td>
                </tr>
                <tr>
                  <th scope="row">Updated At</th>
                  <td>{user.updatedAt}</td>
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
              onClick={() =>
                props.history.push(BUILD_ADMIN_USER_EDIT_URL(+userId))
              }
            >
              <FontAwesomeIcon icon="edit" className="pr-1" />
              EDIT
            </button>
          </div>
        </div>
      );
    }
    return <Spinner size="3x" />;
  };
  return (
    <div className="admin-user-view width-75">
      {confirmDialog}
      {userView()}
    </div>
  );
};
export default AdminUser;
