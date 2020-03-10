import React, { useState, useEffect, useContext, FormEvent } from "react";
import { RouteComponentProps } from "react-router-dom";
import UserService from "../../../services/UserService";
import {
  IUser,
  AlertVariant,
  IRole,
  IUserEditRequest,
  HTTPStatus
} from "../../../settings/DataTypes";
import { AlertContext } from "../../../contexts/AlertContext";
import { parseError } from "../../../utils/errorParser";
import Spinner from "../../../components/spinner/Spinner";
import RoleService from "../../../services/RoleService";
import {
  ADMIN_USERS_URL,
  ADMIN_PANEL_URL,
  BUILD_ADMIN_USER_URL
} from "../../../settings/Constants";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import BreadcrumbItem from "../../../components/breadcrumb/BreadcrumbItem";

interface MatchParams {
  user_id: string;
}
interface IProps extends RouteComponentProps<MatchParams> {}

const AdminUserEdit: React.FunctionComponent<IProps> = props => {
  const userId = props.match.params.user_id;
  // service
  const userService = new UserService();
  const roleService = new RoleService();

  // context
  const alertContext = useContext(AlertContext);

  // states
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [roles, setRoles] = useState<IRole[]>([]);

  useEffect(() => {
    userService
      .getUser(+userId)
      .then(resp => {
        setUser(resp.data);
      })
      .catch(err => {
        alertContext.show(parseError(err).join(", "), AlertVariant.DANGER);
      });
    roleService
      .getRoles()
      .then(resp => {
        setRoles(resp.data);
        setIsLoaded(true);
      })
      .catch(err => {
        alertContext.show(parseError(err).join(", "), AlertVariant.DANGER);
      });
    // eslint-disable-next-line
  }, [userId]);

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (user) {
      const editUser: IUserEditRequest = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleIds: user.roles.map(r => r.id)
      };

      userService
        .updateUser(user.id, editUser)
        .then(resp => {
          if (resp.status === HTTPStatus.OK) {
            alertContext.show("User successfully updated");
            props.history.push(BUILD_ADMIN_USER_URL(resp.data.id));
          }
        })
        .catch(err => {
          alertContext.show(parseError(err).join(", "), AlertVariant.DANGER);
        });
    }
  };

  const handleRoleOptionClick = (role: IRole) => {
    if (user) {
      let user_roles = [...user.roles];
      const found = user_roles.some(r => r.id === role.id);
      if (found) {
        user_roles = user_roles.filter(r => r.id !== role.id);
      } else {
        user_roles.push(role);
      }
      setUser({ ...user, roles: user_roles });
    }
  };

  const getRoleOptions = () => {
    if (roles) {
      return roles.map(r => {
        return (
          <div className="form-check" key={r.id}>
            <input
              className="form-check-input"
              type="checkbox"
              id={r.name}
              value={r.name}
              checked={user ? user.roles.some(role => role.id === r.id) : false}
              onChange={() => handleRoleOptionClick(r)}
            />
            <label className="form-check-label" htmlFor={r.name}>
              {r.name}
            </label>
          </div>
        );
      });
    }
  };
  const getEditForm = () => {
    if (isLoaded && user) {
      return (
        <form onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input
              className="form-control"
              type="text"
              value={user.firstName}
              onChange={e => setUser({ ...user, firstName: e.target.value })}
            ></input>
          </div>
          <div className="form-group">
            <label>Last Name</label>Update
            <input
              className="form-control"
              type="text"
              value={user.lastName}
              onChange={e => setUser({ ...user, lastName: e.target.value })}
            ></input>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              type="text"
              value={user.email}
              onChange={e => setUser({ ...user, email: e.target.value })}
            ></input>
          </div>
          <div className="form-group">
            <label>Roles</label>
            {getRoleOptions()}
          </div>
          <div className="form-group action-btn-group">
            <button
              type="button"
              className="btn btn-danger action-btn"
              onClick={() => props.history.push(ADMIN_USERS_URL)}
            >
              CANCEL
            </button>
            <button type="submit" className="btn btn-primary action-btn">
              UPDATE
            </button>
          </div>
        </form>
      );
    } else {
      return <Spinner size="3x" />;
    }
  };

  return (
    <div className="width-75 user-edit-wrapper">
      <Breadcrumb className="bg-transparent">
        <BreadcrumbItem href={ADMIN_PANEL_URL}>Admin</BreadcrumbItem>
        <BreadcrumbItem href={ADMIN_USERS_URL}>Users</BreadcrumbItem>
        <BreadcrumbItem active>User Edit</BreadcrumbItem>
      </Breadcrumb>
      <h1>User Update</h1>
      {getEditForm()}
    </div>
  );
};
export default AdminUserEdit;
