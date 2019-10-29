import React, { Component } from "react";
import Avatar from "../../components/avatar/Avatar";
import AuthService from "../../services/AuthService";
import { AuthContext } from "../../contexts/AuthContext";

import "./UserSetting.css";
import { withRouter, RouteComponentProps } from "react-router";

interface IProps extends RouteComponentProps {}
class UserSettingContaner extends Component<IProps> {
  private authService: AuthService;

  PROFILE_SETTING_URL = "/user/profile-settings";
  ACCOUNT_SETTING_URL = "/user/account-settings";
  NOTIFICATION_SETTING_URL = "/user/notification-settings";
  PHOTO_SETTING_URL = "/user/photo-settings";
  DELET_PROFILE_URL = "/user/delete-profile";

  static contextType = AuthContext;
  constructor(props: IProps) {
    super(props);
    this.authService = new AuthService();
  }
  handleLinkClick = (url: string) => {
    this.props.history.push(url);
  };
  getActiveClassName = (pathName: string) => {
    return pathName === this.props.history.location.pathname ? "active" : "";
  };
  render() {
    let avatarStyle = { width: "120px", height: "120px", fontSize: "36px" };
    let userName = this.authService.getUserFullName(this.context);
    return (
      <div className="user-profile">
        <div className="user-profile-side-nav">
          <div className="avatar">
            <Avatar styles={avatarStyle} />
            <strong className="mt-2 mb-2">{userName}</strong>
          </div>
          <div className="profile-links">
            <ul>
              <li
                className={`menu-link ${this.getActiveClassName(
                  this.PROFILE_SETTING_URL
                )}`}
                onClick={() => this.handleLinkClick(this.PROFILE_SETTING_URL)}
              >
                Profile
              </li>
              <li
                className={`menu-link ${this.getActiveClassName(
                  this.PHOTO_SETTING_URL
                )}`}
                onClick={() => this.handleLinkClick(this.PHOTO_SETTING_URL)}
              >
                Photo
              </li>
              <li
                className={`menu-link ${this.getActiveClassName(
                  this.ACCOUNT_SETTING_URL
                )}`}
                onClick={() => this.handleLinkClick(this.ACCOUNT_SETTING_URL)}
              >
                Account
              </li>
              <li
                className={`menu-link ${this.getActiveClassName(
                  this.NOTIFICATION_SETTING_URL
                )}`}
                onClick={() =>
                  this.handleLinkClick(this.NOTIFICATION_SETTING_URL)
                }
              >
                Notifications
              </li>
              <li
                className={`menu-link ${this.getActiveClassName(
                  this.DELET_PROFILE_URL
                )}`}
                onClick={() => this.handleLinkClick(this.DELET_PROFILE_URL)}
              >
                Delete Account
              </li>
            </ul>
          </div>
        </div>
        {this.props.children}
      </div>
    );
  }
}
export default withRouter(UserSettingContaner);
