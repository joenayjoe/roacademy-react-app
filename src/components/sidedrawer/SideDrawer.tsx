import React, { Component, ContextType } from "react";
import {
  ICategory,
  IGrade,
  MenuItemType,
  ModalIdentifier,
  ICourse
} from "../../settings/DataTypes";

import "./SideDrawer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import { RouteComponentProps, withRouter } from "react-router";
import { CategoryService } from "../../services/CategoryService";
import { GradeService } from "../../services/GradeService";
import { isGrade, isCourse } from "../../utils/typeChecker";
import { AuthContext } from "../../contexts/AuthContext";
import Avatar from "../avatar/Avatar";
import AuthService from "../../services/AuthService";

interface IProps extends RouteComponentProps {
  isOpen: boolean;
  modalCloseHandler: () => void;
  backdropClickHandler: () => void;
  modalSwitcher: (modalIdentifier: ModalIdentifier) => void;
}

interface IStates {
  categories: ICategory[];
  levelTwoParent: string | null;
  selectedMenuItem: string | null;
  showAuthLinks: boolean;
}

class SideDrawerNew extends Component<IProps, IStates> {
  private categoryService: CategoryService;
  private gradeService: GradeService;
  private authService: AuthService;
  static contextType = AuthContext;
  context!: ContextType<typeof AuthContext>;

  constructor(props: IProps) {
    super(props);
    this.categoryService = new CategoryService();
    this.gradeService = new GradeService();
    this.authService = new AuthService();

    this.state = {
      categories: [],
      levelTwoParent: null,
      selectedMenuItem: null,
      showAuthLinks: false
    };
  }

  componentDidMount() {
    this.categoryService
      .getCategories()
      .then(response => {
        this.setState({ categories: response.data });
      })
      .catch(error => {
        console.log("Error:", (error as AxiosError).message);
      });
  }

  showLoginModal = () => {
    this.props.modalSwitcher(ModalIdentifier.LOGIN_MODAL);
  };

  showSignupModal = () => {
    this.props.modalSwitcher(ModalIdentifier.SIGNUP_MODAL);
  };

  handleSignUpClick = () => {
    this.showSignupModal();
  };

  getGradesForCategory(category: ICategory) {
    if (category.catched === undefined || !category.catched) {
      this.gradeService.getGradesForCategory(category.id).then(resp => {
        let categories = this.state.categories.map(cat => {
          if (cat.id === category.id) {
            cat.grades = resp.data;
            cat.catched = true;
          }
          return cat;
        });
        this.setState({ categories: categories });
      });
    }
  }
  getCoursesForGrade(grade: IGrade) {
    if (grade.catched === undefined || !grade.catched) {
      this.gradeService
        .getCoursesForGrade(grade.categoryId, grade.id)
        .then(resp => {
          let categories = this.state.categories.map(cat => {
            if (cat.id === grade.categoryId) {
              cat.grades.map(grd => {
                if (grd.id === grade.id) {
                  grd.courses = resp.data;
                  grd.catched = true;
                }
                return grd;
              });
            }
            return cat;
          });

          this.setState({ categories: categories });
        });
    }
  }

  handleMenuLinkClick = (item: MenuItemType) => {
    if (isCourse(item)) {
      this.loadPage(item);
    } else if (isGrade(item)) {
      const grade = item as IGrade;
      let parent: ICategory | null = null;
      for (let cat of this.state.categories) {
        if (cat.id === grade.categoryId) {
          parent = cat;
          break;
        }
      }
      this.getCoursesForGrade(grade);
      this.setState({ levelTwoParent: parent ? parent.url : null });
    } else {
      this.getGradesForCategory(item as ICategory);
    }
    this.setState({
      selectedMenuItem: item.url
    });
  };

  handleBackBtnClick = (data: MenuItemType) => {
    const ltp = this.state.levelTwoParent;
    this.setState({
      selectedMenuItem: ltp,
      levelTwoParent: null
    });
  };

  handleAvatarBackBtnClick = () => {
    this.setState({ showAuthLinks: false });
  };

  handleDonateLinkClick = () => {
    this.props.backdropClickHandler();
    this.props.history.push("/donation");
  };

  handleLogOut = () => {
    this.context && this.context.logout();
    this.props.backdropClickHandler();
    this.props.history.push("/");
  };

  getBackButtonLink = (data: MenuItemType) => {
    return (
      <li
        className="back-menu-link"
        key="back-l-2"
        onClick={() => this.handleBackBtnClick(data)}
      >
        <div>
          <FontAwesomeIcon icon="angle-left" />
          <span className="ml-2"> {data.name} </span>
        </div>
      </li>
    );
  };

  getShowAllItemLink = (data: MenuItemType) => {
    return (
      <li key={data.url}>
        <div className="menu-link" onClick={() => this.loadPage(data)}>
          All {data.name}
        </div>
      </li>
    );
  };

  getExpander = () => {
    return (
      <span>
        <FontAwesomeIcon icon="angle-right"></FontAwesomeIcon>
      </span>
    );
  };

  handleAvatarMenuClick = () => {
    this.setState({ showAuthLinks: true });
  };

  loadPage(item: MenuItemType) {
    let url: string;

    if ((item as IGrade).categoryId) {
      item = item as IGrade;
      url = "/categories/" + item.categoryId + "/grades/" + item.id;
    } else if ((item as ICourse).gradeId) {
      url = "/courses/" + item.id;
    } else {
      url = "/categories/" + item.id;
    }
    this.props.backdropClickHandler();
    this.props.history.push(url);
  }

  getLevelThreeMenuItems(grade: IGrade) {
    const levelThreeMenuItems = grade.courses.map(course => {
      return (
        <li key={course.url}>
          <div
            className="menu-link"
            onClick={() => this.handleMenuLinkClick(course)}
          >
            {course.name}
          </div>
        </li>
      );
    });

    return (
      <ul className="side-drawer-level-three">
        {this.getBackButtonLink(grade)}
        {this.getShowAllItemLink(grade)}
        {levelThreeMenuItems}
      </ul>
    );
  }
  getLevelTwoMenuItems = (category: ICategory) => {
    const levelTwoMenuItems = category.grades.map(grade => {
      let openKlass =
        this.state.selectedMenuItem === grade.url ? "open-sub-menu" : "";
      return (
        <li key={grade.url} className={openKlass}>
          <div
            className="menu-link"
            onClick={() => this.handleMenuLinkClick(grade)}
          >
            {grade.name}
            {this.getExpander()}
          </div>

          {this.getLevelThreeMenuItems(grade)}
        </li>
      );
    });

    return (
      <ul className="side-drawer-level-two">
        {this.getBackButtonLink(category)}
        {this.getShowAllItemLink(category)}
        {levelTwoMenuItems}
      </ul>
    );
  };

  handleAuthenticatedUserLinkClick = (url: string) => {
    this.props.backdropClickHandler();
    this.props.history.push(url);
  };

  getAuthenticatedUserLinks = () => {
    return (
      <ul className="side-drawer-level-two">
        <li className="back-menu-link" onClick={this.handleAvatarBackBtnClick}>
          <div>
            <FontAwesomeIcon icon="angle-left" />
            <span className="ml-2"> Menu </span>
          </div>
        </li>
        <li>
          <div
            className="menu-link"
            onClick={() =>
              this.handleAuthenticatedUserLinkClick("/user/profile-settings")
            }
          >
            Edit Profile
          </div>
        </li>
        <li>
          <div
            className="menu-link"
            onClick={() =>
              this.handleAuthenticatedUserLinkClick("/user/account-settings")
            }
          >
            Edit Account
          </div>
        </li>
        <li className="dropdown-divider"></li>
        <li>
          <div className="menu-link">Help</div>
        </li>
        <li>
          <div className="menu-link" onClick={this.handleLogOut}>
            Signout
          </div>
        </li>
      </ul>
    );
  };

  getAuthLinks = () => {
    let authLink;
    if (this.context && this.context.isAuthenticated) {
      let userName = this.authService.getUserFullName(this.context);
      let userEmail = this.authService.getUserEmail(this.context);
      let avatarStyle = { width: "48px", height: "48px", cursor: "pointer" };

      let openKlass = this.state.showAuthLinks ? "open-sub-menu" : "";
      authLink = (
        <React.Fragment>
          <li className={`${openKlass}`} style={{ backgroundColor: "#f8f8f1" }}>
            <div className="menu-link" onClick={this.handleAvatarMenuClick}>
              <Avatar styles={avatarStyle} />
              <span className="ml-2">
                <span>{userName}</span> <br />
                <small className="text-secondary">{userEmail}</small>
              </span>
              {this.getExpander()}
            </div>
            {this.getAuthenticatedUserLinks()}
          </li>
          <li>
            <div className="mb-2">
              <strong>Learn</strong>
            </div>
            <div
              className="menu-link"
              onClick={() =>
                this.handleAuthenticatedUserLinkClick("/user-courses")
              }
            >
              <span>My Courses</span>
            </div>
          </li>
          <li className="dropdown-divider"></li>
        </React.Fragment>
      );
    } else {
      authLink = (
        <li
          key="auth-link"
          className="auth-link border-bottom"
          onClick={this.handleSignUpClick}
        >
          <div>Sign Up / Log In</div>
        </li>
      );
    }
    return authLink;
  };

  getLevelOneMenuItems(categories: ICategory[]) {
    const levelOneMenuItems = categories.map(category => {
      let openKlass =
        this.state.selectedMenuItem === category.url ||
        this.state.levelTwoParent === category.url
          ? "open-sub-menu"
          : "";
      return (
        <li key={category.url} className={openKlass}>
          <div
            className="menu-link"
            onClick={() => this.handleMenuLinkClick(category)}
          >
            {category.name}
            {this.getExpander()}
          </div>

          {this.getLevelTwoMenuItems(category)}
        </li>
      );
    });

    return (
      <ul className="side-drawer-level-one">
        {this.getAuthLinks()}
        {levelOneMenuItems}
        <li className="dropdown-divider"></li>
        <li
          key="donate-link"
          className="auth-link pt-0"
          onClick={this.handleDonateLinkClick}
        >
          <div>
            <FontAwesomeIcon icon="donate" className="ra-icon" size="lg" />
            Donate
          </div>
        </li>
      </ul>
    );
  }

  render() {
    let openKlass = "";
    let sideDrawerBackdrop;
    if (this.props.isOpen) {
      openKlass = "open";
      sideDrawerBackdrop = (
        <div
          className="side-drawer-backdrop"
          onClick={this.props.backdropClickHandler}
        ></div>
      );
    }
    return (
      <React.Fragment>
        {sideDrawerBackdrop}
        <div className={`side-drawer ${openKlass}`}>
          {this.getLevelOneMenuItems(this.state.categories)}
          <div
            className="side-drawer-close-btn"
            onClick={this.props.backdropClickHandler}
          >
            <FontAwesomeIcon icon="times-circle" size="3x" color="#fff" />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(SideDrawerNew);
