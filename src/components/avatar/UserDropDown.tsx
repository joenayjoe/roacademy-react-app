import React, { Component, ContextType, createRef } from "react";
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

interface IProps extends RouteComponentProps {}
interface IStates {
  showDropDown: boolean;
  isMenuLinkClicked: boolean;
}

class UserDropDown extends Component<IProps, IStates> {
  static contextType = AuthContext;
  context!: ContextType<typeof AuthContext>;
  private authService: AuthService;

  avatarNode: any = createRef();

  constructor(props: IProps) {
    super(props);
    this.authService = new AuthService();
    this.state = {
      showDropDown: false,
      isMenuLinkClicked: false
    };
  }

  componentDidMount() {
    document.addEventListener(
      "click",
      e => this.toogleShowAvatarDropDown(e),
      false
    );
  }
  componentWillUnmount() {
    document.removeEventListener(
      "click",
      e => this.toogleShowAvatarDropDown(e),
      false
    );
  }

  toogleShowAvatarDropDown = (e: Event) => {
    if (this.avatarNode.current === null) return;
    if (this.avatarNode.current.contains(e.target)) {
      this.setState(prevState => {
        return {
          showDropDown: !prevState.showDropDown,
          isMenuLinkClicked: false
        };
      });
    } else {
      this.setState({ showDropDown: false });
    }
  };

  handleMenuLinkClick = (url: string) => {
    this.setState({ showDropDown: false, isMenuLinkClicked: true });
    this.props.history.push(url);
  };

  handleLogout = () => {
    this.context && this.context.logout();
    this.props.history.push("/");
  };
  render() {
    let userName = this.authService.getUserFullName(this.context);
    let userEmail = this.authService.getUserEmail(this.context);
    let avatarStyle = { width: "48px", height: "48px", cursor: "pointer" };

    let openKlass = this.state.showDropDown ? "open" : "";
    let hideMenu = this.state.isMenuLinkClicked ? "d-none" : "";

    let adminPanelLi;
    if (this.context.hasRole(RoleType.ADMIN)) {
      adminPanelLi = (
        <li className="drop-down-list-item">
          <div
            className="menu-link"
            onClick={e => this.handleMenuLinkClick(ADMIN_PANEL_URL)}
          >
            Admin Panel
          </div>
        </li>
      );
    }

    return (
      <div
        className={`nav-item drop-down drop-down-on-hover ${openKlass}`}
        onMouseEnter={() => this.setState({ isMenuLinkClicked: false })}
      >
        <Avatar styles={avatarStyle} avatarRef={this.avatarNode} />

        <ul
          className={`drop-down-list drop-down-list-arrow-right drop-down-right ${hideMenu}`}
        >
          <li className="drop-down-list-item mt-2">
            <div
              className="menu-link"
              onClick={e => this.handleMenuLinkClick(USER_PROFILE_SETTING_URL)}
            >
              <Avatar styles={avatarStyle} />
              <span className="ml-2">
                <span>{userName}</span> <br />
                <small className="text-secondary">{userEmail}</small>
              </span>
            </div>
          </li>
          <li className="drop-down-list-item">
            <div
              className="menu-link"
              onClick={e => this.handleMenuLinkClick(USER_COURSES_URL)}
            >
              My Courses
            </div>
          </li>
          {adminPanelLi}
          <li className="dropdown-divider"></li>
          <li className="drop-down-list-item">
            <div
              className="menu-link"
              onClick={e => this.handleMenuLinkClick(USER_PROFILE_SETTING_URL)}
            >
              Edit Profile
            </div>
          </li>
          <li className="drop-down-list-item">
            <div
              className="menu-link"
              onClick={e => this.handleMenuLinkClick(USER_ACCOUNT_SETTING_URL)}
            >
              Edit Account
            </div>
          </li>
          <li className="dropdown-divider"></li>
          <li className="drop-down-list-item ">
            <div className="menu-link">Help</div>
          </li>
          <li className="drop-down-list-item">
            <div className="menu-link" onClick={this.handleLogout}>
              Signout
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

export default withRouter(UserDropDown);
