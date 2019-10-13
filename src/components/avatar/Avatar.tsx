import React, { Component, ContextType } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { CookiesService } from "../../services/CookiesService";
import { RouteComponentProps, withRouter } from "react-router";
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";

interface IProps extends RouteComponentProps {}
interface IStates {
  isClicked: boolean;
}

class Avatar extends Component<IProps, IStates> {
  static contextType = AuthContext;
  context!: ContextType<typeof AuthContext>;
  private cookiesService: CookiesService;
  constructor(props: IProps) {
    super(props);
    this.cookiesService = new CookiesService();
    this.state = {
      isClicked: false
    };
  }

  handleOnClick = () => {
    if (isMobile) {
      this.setState(prevState => {
        return { isClicked: !prevState.isClicked };
      });
    } else {
      this.props.history.push("/profile-settings");
    }
  };

  handleLogout = () => {
    this.cookiesService.remove("accessToken");
    this.cookiesService.remove("tokenType");
    this.props.history.push("/");
  };
  render() {
    let userAvatar;
    if (this.context && this.context.currentUser) {
      if (this.context.currentUser.imageUrl) {
        userAvatar = (
          <img
            src={this.context.currentUser.imageUrl}
            alt={this.context.currentUser.firstName}
          />
        );
      } else {
        userAvatar = (
          <span className="user-avatar-initials">
            {this.context.currentUser.firstName[0].toUpperCase() +
              this.context.currentUser.lastName[0].toUpperCase()}
          </span>
        );
      }
    }

    let openKlass = this.state.isClicked ? "open" : "";
    return (
      <div
        className={`nav-item user-avatar drop-down drop-down-on-hover ${openKlass}`}
        style={{ width: "48px", height: "48px" }}
      >
        <div className="nav-link" onClick={this.handleOnClick}>
          {userAvatar}
        </div>
        <ul className="drop-down-list drop-down-list-arrow-right drop-down-right">
          <li className="drop-down-list-item">
            <Link to="user-courses" className="menu-link">My Courses</Link>
          </li>
          <li className="drop-down-list-item">
            <Link to="/profile-settings" className="menu-link">My Profile</Link>
          </li>
          <li className="drop-down-list-item  border-top">
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

export default withRouter(Avatar);
