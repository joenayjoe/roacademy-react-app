import React, { Component, ContextType, createRef } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { CookiesService } from "../../services/CookiesService";
import { RouteComponentProps, withRouter } from "react-router";
import {
  getUserFullName,
  getUserNameInitials,
  getUserEmail
} from "../../utils/authHelper";
import Avatar from "./Avatar";

interface IProps extends RouteComponentProps {}
interface IStates {
  showDropDown: boolean;
  isMenuLinkClicked: boolean;
}

class UserDropDown extends Component<IProps, IStates> {
  static contextType = AuthContext;
  context!: ContextType<typeof AuthContext>;
  private cookiesService: CookiesService;

  avatarNode: any = createRef();

  constructor(props: IProps) {
    super(props);
    this.cookiesService = new CookiesService();
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
    this.cookiesService.remove("accessToken");
    this.cookiesService.remove("tokenType");
    this.context && this.context.updateAuthContext();
    this.props.history.push("/");
  };
  render() {
    let userAvatar;
    let userName = getUserFullName(this.context);
    let userEmail = getUserEmail(this.context);
    let userInitials = getUserNameInitials(this.context);
    let avatarStyle = { width: "48px", height: "48px" };
    if (this.context && this.context.currentUser) {
      if (this.context.currentUser.imageUrl) {
        userAvatar = (
          <img src={this.context.currentUser.imageUrl} alt={userName} />
        );
      } else {
        userAvatar = (
          <span className="user-avatar-initials">{userInitials}</span>
        );
      }
    }

    let openKlass = this.state.showDropDown ? "open" : "";
    let hideMenu = this.state.isMenuLinkClicked ? "d-none" : "";
    return (
      <div
        className={`nav-item drop-down drop-down-on-hover ${openKlass}`}
        onMouseEnter={() => this.setState({ isMenuLinkClicked: false })}
      >
        <Avatar
          classNames="nav-link"
          styles={avatarStyle}
          avatarRef={this.avatarNode}
        >
          {userAvatar}
        </Avatar>

        <ul
          className={`drop-down-list drop-down-list-arrow-right drop-down-right ${hideMenu}`}
        >
          <li className="drop-down-list-item mt-2">
            <div
              className="menu-link"
              onClick={e => this.handleMenuLinkClick("/user/profile-settings")}
            >
              <Avatar styles={avatarStyle}>{userAvatar}</Avatar>
              <span className="ml-2">
                <span>{userName}</span> <br />
                <small className="text-secondary">{userEmail}</small>
              </span>
            </div>
          </li>
          <li className="drop-down-list-item">
            <div
              className="menu-link"
              onClick={e => this.handleMenuLinkClick("/user-courses")}
            >
              My Courses
            </div>
          </li>
          <li className="dropdown-divider"></li>
          <li className="drop-down-list-item">
            <div
              className="menu-link"
              onClick={e => this.handleMenuLinkClick("/user/profile-settings")}
            >
              Edit Profile
            </div>
          </li>
          <li className="drop-down-list-item">
            <div
              className="menu-link"
              onClick={e => this.handleMenuLinkClick("/user/account-settings")}
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
