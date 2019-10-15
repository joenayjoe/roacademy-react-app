import React, { Component, ContextType, createRef } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { CookiesService } from "../../services/CookiesService";
import { RouteComponentProps, withRouter } from "react-router";

interface IProps extends RouteComponentProps {}
interface IStates {
  showDropDown: boolean;
  isMenuLinkClicked: boolean;
}

class Avatar extends Component<IProps, IStates> {
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
    document.addEventListener("click", e => this.toogleShowAvatarDropDown(e), false);
  }
  componentWillUnmount() {
    document.removeEventListener(
      "click",
      e => this.toogleShowAvatarDropDown(e),
      false
    );
  }

  toogleShowAvatarDropDown = (e: Event) => {
    if (this.avatarNode.contains(e.target)) {
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

    let openKlass = this.state.showDropDown ? "open" : "";
    let hideMenu = this.state.isMenuLinkClicked ? "d-none" : "";
    return (
      <div
        className={`nav-item user-avatar drop-down drop-down-on-hover ${openKlass}`}
        style={{ width: "48px", height: "48px" }}
        onMouseEnter={() => this.setState({ isMenuLinkClicked: false })}
      >
        <div className="nav-link" ref={node => (this.avatarNode = node)}>
          {userAvatar}
        </div>

        <ul
          className={`drop-down-list drop-down-list-arrow-right drop-down-right ${hideMenu}`}
        >
          <li className="drop-down-list-item">
            <div
              className="menu-link"
              onClick={e => this.handleMenuLinkClick("/user-courses")}
            >
              My Courses
            </div>
          </li>
          <li className="drop-down-list-item">
            <div
              className="menu-link"
              onClick={e => this.handleMenuLinkClick("/profile-settings")}
            >
              My Profile
            </div>
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
