import React, { useContext } from "react";
import Avatar from "../../components/avatar/Avatar";
import AuthService from "../../services/AuthService";
import { AuthContext } from "../../contexts/AuthContext";

import "./UserSetting.css";
import { withRouter, RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";

interface IProps extends RouteComponentProps {}
const UserSettingContaner: React.FunctionComponent<IProps> = props => {
  const authService = new AuthService();

  const PROFILE_SETTING_URL = "/user/profile-settings";
  const ACCOUNT_SETTING_URL = "/user/account-settings";
  const NOTIFICATION_SETTING_URL = "/user/notification-settings";
  const PHOTO_SETTING_URL = "/user/photo-settings";
  const DELET_PROFILE_URL = "/user/delete-profile";

  const authContext = useContext(AuthContext);

  const handleLinkClick = (url: string) => {
    props.history.push(url);
  };
  const getActiveClassName = (pathName: string) => {
    return pathName === props.history.location.pathname ? "active" : "";
  };

  let avatarStyle = { width: "120px", height: "120px", fontSize: "36px" };
  let userName = authService.getUserFullName(authContext.currentUser);
  return (
    <div className="user-profile width-75">
      <div className="user-profile-side-nav">
        <div className="avatar">
          <Avatar styles={avatarStyle} />
          <strong className="mt-2 mb-2">{userName}</strong>
        </div>
        <div className="profile-links">
          <ul>
            <li
              className={getActiveClassName(PROFILE_SETTING_URL)}
              onClick={() => handleLinkClick(PROFILE_SETTING_URL)}
            >
              <Link to={PROFILE_SETTING_URL} className="menu-link w-100">
                Profile
              </Link>
            </li>
            <li
              className={getActiveClassName(PHOTO_SETTING_URL)}
              onClick={() => handleLinkClick(PHOTO_SETTING_URL)}
            >
              <Link className="menu-link  w-100" to={PHOTO_SETTING_URL}>
                Photo
              </Link>
            </li>
            <li
              className={getActiveClassName(ACCOUNT_SETTING_URL)}
              onClick={() => handleLinkClick(ACCOUNT_SETTING_URL)}
            >
              <Link className="menu-link w-100" to={ACCOUNT_SETTING_URL}>
                Account
              </Link>
            </li>
            <li
              className={getActiveClassName(NOTIFICATION_SETTING_URL)}
              onClick={() => handleLinkClick(NOTIFICATION_SETTING_URL)}
            >
              <Link to={NOTIFICATION_SETTING_URL} className="menu-link w-100">
                Notifications
              </Link>
            </li>
            <li
              className={getActiveClassName(DELET_PROFILE_URL)}
              onClick={() => handleLinkClick(DELET_PROFILE_URL)}
            >
              <Link to={DELET_PROFILE_URL} className="menu-link w-100">
                Delete Account
              </Link>
            </li>
          </ul>
        </div>
      </div>
      {props.children}
    </div>
  );
};
export default withRouter(UserSettingContaner);
