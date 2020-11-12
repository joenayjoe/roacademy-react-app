import React from "react";
import { RouteComponentProps, withRouter } from "react-router";
import {
  ADMIN_CATEGORIES_URL,
  ADMIN_GRADES_URL,
  ADMIN_COURSES_URL,
  ADMIN_PANEL_URL,
  ADMIN_USERS_URL,
  ADMIN_OAUTH2_CONFIG_URL,
} from "../../settings/Constants";

interface IProps extends RouteComponentProps {}
const AdminControl: React.FunctionComponent<IProps> = (props) => {
  const handleLinkClick = (url: string) => {
    props.history.push(url);
  };

  const getActiveClassName = (pathName: string) => {
    return pathName === props.history.location.pathname ? "active" : "";
  };

  return (
    <div className="admin-panel mt-2">
      <div className="admin-side-menu">
        <ul>
          <li
            className={`menu-link ${getActiveClassName(ADMIN_PANEL_URL)}`}
            onClick={() => handleLinkClick(ADMIN_PANEL_URL)}
          >
            Dashboard
          </li>
          <li
            className={`menu-link ${getActiveClassName(ADMIN_CATEGORIES_URL)}`}
            onClick={() => handleLinkClick(ADMIN_CATEGORIES_URL)}
          >
            Category
          </li>
          <li
            className={`menu-link ${getActiveClassName(ADMIN_GRADES_URL)}`}
            onClick={() => handleLinkClick(ADMIN_GRADES_URL)}
          >
            Grade
          </li>
          <li
            className={`menu-link ${getActiveClassName(ADMIN_COURSES_URL)}`}
            onClick={() => handleLinkClick(ADMIN_COURSES_URL)}
          >
            Course
          </li>
          <li
            className={`menu-link ${getActiveClassName(ADMIN_USERS_URL)}`}
            onClick={() => handleLinkClick(ADMIN_USERS_URL)}
          >
            Users
          </li>

          <li
            className={`menu-link ${getActiveClassName(
              ADMIN_OAUTH2_CONFIG_URL
            )}`}
            onClick={() => handleLinkClick(ADMIN_OAUTH2_CONFIG_URL)}
          >
            OAuth2 Config
          </li>
        </ul>
      </div>
      <div className="admin-content-wrapper">{props.children}</div>
    </div>
  );
};
export default withRouter(AdminControl);
