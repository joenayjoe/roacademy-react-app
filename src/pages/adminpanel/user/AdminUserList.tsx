import React, { useState, useEffect, useContext } from "react";
import AdminControl from "../AdminControl";
import UserService from "../../../services/UserService";
import { IUser, Page, AlertVariant } from "../../../settings/DataTypes";
import { AlertContext } from "../../../contexts/AlertContext";
import { parseError } from "../../../utils/errorParser";
import { camelize } from "../../../utils/StringUtils";
import {
  DEFAULT_SORTING_FIELD,
  DEFAULT_SORTING_ORDER,
  PAGE_SIZE,
  BUILD_ADMIN_USER_URL
} from "../../../settings/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RouteComponentProps } from "react-router-dom";
import Pagination from "../../../components/pagination/Pagination";
import Spinner from "../../../components/spinner/Spinner";

interface IProps extends RouteComponentProps {}
const AdminUserList: React.FunctionComponent<IProps> = props => {
  // service to make api cakk
  const userService = new UserService();

  // context
  const alertContext = useContext(AlertContext);

  // states
  const [userPage, setUserPage] = useState<Page<IUser> | null>(null);
  const [sortCol, setSortCol] = useState<string>(DEFAULT_SORTING_FIELD);
  const [sortOrder, setSortOrder] = useState<string>(DEFAULT_SORTING_ORDER);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // constants
  const theads = ["ID", "First Name", "Last Name", "Roles", "Created At"];

  useEffect(() => {
    userService
      .getUsers(0, PAGE_SIZE)
      .then(resp => {
        setUserPage(resp.data);
        setIsLoaded(true);
      })
      .catch(err => {
        alertContext.show(parseError(err).join(", "), AlertVariant.DANGER);
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
    setIsLoaded(false);
    const currentPage = userPage ? userPage.number : 0;
    userService
      .getUsers(currentPage, PAGE_SIZE, getSorting(th))
      .then(resp => {
        setUserPage(resp.data);
        setIsLoaded(true);
      })
      .catch(err => {
        alertContext.show(parseError(err).join(", "), AlertVariant.DANGER);
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

  const handleTableRowClick = (user: IUser) => {
    props.history.push(BUILD_ADMIN_USER_URL(user.id));
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
    const trows =
      userPage &&
      userPage.content.map(user => {
        return (
          <tr
            className="link"
            key={user.id}
            onClick={() => handleTableRowClick(user)}
          >
            <td> {user.id}</td>
            <td> {user.firstName}</td>
            <td> {user.lastName}</td>
            <td>{user.roles.map(r => r.name).join(", ")}</td>
            <td>{user.createdAt}</td>
          </tr>
        );
      });
    return trows;
  };

  const userListTable = () => {
    if (isLoaded) {
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
    } else {
      return <Spinner size="3x" />;
    }
  };

  const handlePageClick = (page: number) => {
    if (page >= 0) {
      const sorting = sortCol + "_" + sortOrder;
      setIsLoaded(false);
      userService.getUsers(page, PAGE_SIZE, sorting).then(resp => {
        setUserPage(resp.data);
        setIsLoaded(true);
      });
    }
  };

  const pagination = userPage ? (
    <Pagination
      totalPage={userPage.totalPages}
      first={userPage.first}
      last={userPage.last}
      currentPage={userPage.number}
      pageClickHandler={handlePageClick}
    />
  ) : null;

  return (
    <AdminControl>
      <div className="users-display-wrapper">{userListTable()}</div>
      {pagination}
    </AdminControl>
  );
};
export default AdminUserList;
