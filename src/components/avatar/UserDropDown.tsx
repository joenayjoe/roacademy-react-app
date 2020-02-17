import React, { useContext, useRef, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { RouteComponentProps, withRouter } from "react-router";
import Avatar from "./Avatar";
import AuthService from "../../services/AuthService";
import { RoleType } from "../../settings/DataTypes";
import {
  ADMIN_PANEL_URL,
  USER_PROFILE_SETTING_URL,
  USER_COURSES_URL,
  USER_ACCOUNT_SETTING_URL
} from "../../settings/Constants";
import { Link } from "react-router-dom";

interface IProps extends RouteComponentProps {}

const UserDropDown: React.FunctionComponent<IProps> = props => {
  const authContext = useContext(AuthContext);
  const authService = new AuthService();

  let avatarNode = useRef<HTMLDivElement>(null);

  // states
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [isMenuLinkClicked, setIsMenuLinkClicked] = useState<boolean>(false);

  useEffect(() => {
    document.addEventListener("click", e => toogleShowAvatarDropDown(e), false);
    return () => {
      document.removeEventListener(
        "click",
        e => toogleShowAvatarDropDown(e),
        false
      );
    };
    // eslint-disable-next-line
  }, []);

  const toogleShowAvatarDropDown = (e: Event) => {
    if (!avatarNode || !avatarNode.current) return;
    if (
      avatarNode &&
      avatarNode.current &&
      avatarNode.current.contains(e.target as HTMLDivElement)
    ) {
      setShowDropDown(!showDropDown);
      setIsMenuLinkClicked(false);
    } else {
      setShowDropDown(false);
    }
  };

  const handleMenuLinkClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    setShowDropDown(false);
    setIsMenuLinkClicked(true);
    props.history.push(url);
  };

  const handleLogout = () => {
    authContext.logout();
    props.history.push("/");
  };

  const user = authContext.currentUser;
  let userName = authService.getUserFullName(user);
  let userEmail = authService.getUserEmail(user);
  let avatarStyle = { width: "48px", height: "48px", cursor: "pointer" };

  let openKlass = showDropDown ? "open" : "";
  let hideMenu = isMenuLinkClicked ? "d-none" : "";

  let adminPanelLi;
  if (authContext.hasRole(RoleType.ADMIN)) {
    adminPanelLi = (
      <li className="drop-down-list-item">
        <Link
          to={ADMIN_PANEL_URL}
          onClick={e => handleMenuLinkClick(e, ADMIN_PANEL_URL)}
        >
          <div className="menu-link">Admin Panel</div>
        </Link>
      </li>
    );
  }

  return (
    <div
      className={`nav-item drop-down drop-down-on-hover ${openKlass}`}
      onMouseEnter={() => setIsMenuLinkClicked(false)}
    >
      <Avatar styles={avatarStyle} avatarRef={avatarNode} user={user} />

      <ul
        className={`drop-down-list drop-down-list-arrow-right drop-down-right ${hideMenu}`}
      >
        <li className="drop-down-list-item mt-2">
          <Link
            to={USER_PROFILE_SETTING_URL}
            onClick={e => handleMenuLinkClick(e, USER_PROFILE_SETTING_URL)}
          >
            <div className="menu-link">
              <Avatar styles={avatarStyle} user={user} />
              <span className="ml-2">
                <span>{userName}</span> <br />
                <small className="text-secondary">{userEmail}</small>
              </span>
            </div>
          </Link>
        </li>
        <li className="drop-down-list-item">
          <Link
            to={USER_COURSES_URL}
            onClick={e => handleMenuLinkClick(e, USER_COURSES_URL)}
          >
            <div className="menu-link">My Courses</div>
          </Link>
        </li>
        {adminPanelLi}
        <li className="dropdown-divider"></li>
        <li className="drop-down-list-item">
          <Link
            to={USER_PROFILE_SETTING_URL}
            onClick={e => handleMenuLinkClick(e, USER_PROFILE_SETTING_URL)}
          >
            <div className="menu-link">Edit Profile</div>
          </Link>
        </li>
        <li className="drop-down-list-item">
          <Link
            to={USER_ACCOUNT_SETTING_URL}
            onClick={e => handleMenuLinkClick(e, USER_ACCOUNT_SETTING_URL)}
          >
            <div className="menu-link">Edit Account</div>
          </Link>
        </li>
        <li className="dropdown-divider"></li>
        <li className="drop-down-list-item ">
          <div className="menu-link">Help</div>
        </li>
        <li className="drop-down-list-item">
          <div className="menu-link" onClick={handleLogout}>
            Signout
          </div>
        </li>
      </ul>
    </div>
  );
};

export default withRouter(UserDropDown);
