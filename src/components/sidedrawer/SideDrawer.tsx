import React, { useContext, useState, useEffect } from "react";
import {
  ICategory,
  IGrade,
  MenuItemType,
  ModalIdentifier,
  RoleType,
  AlertVariant
} from "../../settings/DataTypes";

import "./SideDrawer.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RouteComponentProps, withRouter } from "react-router";
import { CategoryService } from "../../services/CategoryService";
import { GradeService } from "../../services/GradeService";
import { isGrade, isCourse } from "../../utils/typeChecker";
import { AuthContext } from "../../contexts/AuthContext";
import Avatar from "../avatar/Avatar";
import AuthService from "../../services/AuthService";
import {
  DONATION_URL,
  HOME_URL,
  BUILD_GRADE_URL,
  BUILD_COURSE_URL,
  BUILD_CATEGORY_URL,
  USER_PROFILE_SETTING_URL,
  USER_ACCOUNT_SETTING_URL,
  ADMIN_PANEL_URL,
  USER_COURSES_URL
} from "../../settings/Constants";
import Signup from "../../pages/user/Signup";
import Login from "../../pages/user/Login";
import Modal from "../modal/Modal";
import { CourseService } from "../../services/CourseService";
import { AlertContext } from "../../contexts/AlertContext";
import { parseError } from "../../utils/errorParser";
import { Link } from "react-router-dom";

interface IProps extends RouteComponentProps {
  isOpen: boolean;
  backdropClickHandler: () => void;
}

const SideDrawerNew: React.FunctionComponent<IProps> = props => {
  const categoryService = new CategoryService();
  const gradeService = new GradeService();
  const authService = new AuthService();
  const courseService = new CourseService();

  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [levelTwoParent, setLevelTwoParent] = useState<MenuItemType | null>(
    null
  );
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType | null>(
    null
  );
  const [showAuthLinks, setShowAuthLinks] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalBody, setModalBody] = useState<JSX.Element>(<div></div>);

  useEffect(() => {
    categoryService
      .getCategories("name_asc")
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        alertContext.show(parseError(error).join(", "), AlertVariant.DANGER);
      });
    // eslint-disable-next-line
  }, []);

  const handleModalClose = () => {
    setShowModal(false);
    props.backdropClickHandler();
  };
  const switchModal = (modal: ModalIdentifier) => {
    switch (modal) {
      case ModalIdentifier.LOGIN_MODAL:
        showLoginModal();
        break;
      case ModalIdentifier.SIGNUP_MODAL:
        showSignupModal();
        break;
    }
  };

  const showLoginModal = () => {
    setShowModal(true);
    setModalTitle("Login to Your Account");
    setModalBody(
      <Login
        closeHandler={handleModalClose}
        modalSwitchHandler={(modal: ModalIdentifier) => switchModal(modal)}
      />
    );
  };

  const showSignupModal = () => {
    setShowModal(true);
    setModalTitle("Signup and Start Learning!");
    setModalBody(
      <Signup
        closeHandler={handleModalClose}
        modalSwitchHandler={(modal: ModalIdentifier) => switchModal(modal)}
      />
    );
  };

  const handleSignUpClick = () => {
    showSignupModal();
  };

  const getGradesForCategory = (category: ICategory) => {
    gradeService.getGradesByCategoryId(category.id, "id_asc").then(resp => {
      let categoryList = categories.map(cat => {
        if (cat.id === category.id) {
          cat.grades = resp.data;
        }
        return cat;
      });
      setCategories(categoryList);
    });
  };
  const getCoursesForGrade = (grade: IGrade) => {
    courseService.getCoursesByGradeId(grade.id).then(resp => {
      let categoryList = categories.map(cat => {
        if (cat.id === grade.primaryCategory.id) {
          cat.grades.map(grd => {
            if (grd.id === grade.id) {
              grd.courses = resp.data;
            }
            return grd;
          });
        }
        return cat;
      });

      setCategories(categoryList);
    });
  };

  const handleMenuLinkClick = (e: React.MouseEvent, item: MenuItemType) => {
    e.preventDefault();
    if (isCourse(item)) {
      loadPage(item);
    } else if (isGrade(item)) {
      const grade = item as IGrade;
      let parent: ICategory | null = null;
      for (let cat of categories) {
        if (cat.id === grade.primaryCategory.id) {
          parent = cat;
          break;
        }
      }
      getCoursesForGrade(grade);
      setLevelTwoParent(parent ? parent : null);
    } else {
      getGradesForCategory(item as ICategory);
    }
    setSelectedMenuItem(item);
  };

  const handleBackBtnClick = (data: MenuItemType) => {
    const ltp = levelTwoParent;
    setSelectedMenuItem(ltp);
    setLevelTwoParent(null);
  };

  const handleAvatarBackBtnClick = () => {
    setShowAuthLinks(false);
  };

  const handleDonateLinkClick = () => {
    props.backdropClickHandler();
    props.history.push(DONATION_URL);
  };

  const handleLogOut = () => {
    authContext.logout();
    props.backdropClickHandler();
    props.history.push(HOME_URL);
  };

  const getBackButtonLink = (data: MenuItemType) => {
    return (
      <li
        className="back-menu-link"
        key="back-l-2"
        onClick={() => handleBackBtnClick(data)}
      >
        <div>
          <FontAwesomeIcon icon="angle-left" />
          <span className="ml-2"> {data.name} </span>
        </div>
      </li>
    );
  };

  const getShowAllItemLink = (data: MenuItemType) => {
    return (
      <li key={data.id}>
        <Link
          className="menu-link"
          to={buildURL(data)}
          onClick={() => loadPage(data)}
        >
          All {data.name}
        </Link>
      </li>
    );
  };

  const getExpander = () => {
    return (
      <span>
        <FontAwesomeIcon icon="angle-right"></FontAwesomeIcon>
      </span>
    );
  };

  const handleAvatarMenuClick = () => {
    setShowAuthLinks(true);
  };

  const buildURL = (item: MenuItemType) => {
    let url: string;

    if (isCourse(item)) {
      url = BUILD_COURSE_URL(item.id);
    } else if (isGrade(item)) {
      url = BUILD_GRADE_URL(item.id);
    } else {
      url = BUILD_CATEGORY_URL(item.id);
    }
    return url;
  };
  const loadPage = (item: MenuItemType) => {
    const url = buildURL(item);
    props.backdropClickHandler();
    props.history.push(url);
  };

  const getLevelThreeMenuItems = (grade: IGrade) => {
    const levelThreeMenuItems = grade.courses.map(course => {
      return (
        <li key={course.id}>
          <Link
            className="menu-link"
            to={BUILD_COURSE_URL(course.id)}
            onClick={e => handleMenuLinkClick(e, course)}
          >
            {course.name}
          </Link>
        </li>
      );
    });

    return (
      <ul className="side-drawer-level-three">
        {getBackButtonLink(grade)}
        {getShowAllItemLink(grade)}
        {levelThreeMenuItems}
      </ul>
    );
  };
  const getLevelTwoMenuItems = (category: ICategory) => {
    const levelTwoMenuItems = category.grades.map(grade => {
      let openKlass = selectedMenuItem === grade ? "open-sub-menu" : "";
      return (
        <li key={grade.id} className={openKlass}>
          <Link
            className="menu-link"
            to={BUILD_GRADE_URL(grade.id)}
            onClick={e => handleMenuLinkClick(e, grade)}
          >
            {grade.name}
            {getExpander()}
          </Link>
          {getLevelThreeMenuItems(grade)}
        </li>
      );
    });

    return (
      <ul className="side-drawer-level-two">
        {getBackButtonLink(category)}
        {getShowAllItemLink(category)}
        {levelTwoMenuItems}
      </ul>
    );
  };

  const redirectTo = (url: string) => {
    props.backdropClickHandler();
    props.history.push(url);
  };

  const getAuthenticatedUserLinks = () => {
    return (
      <ul className="side-drawer-level-two">
        <li className="back-menu-link" onClick={handleAvatarBackBtnClick}>
          <div>
            <FontAwesomeIcon icon="angle-left" />
            <span className="ml-2"> Menu </span>
          </div>
        </li>
        <li>
          <div
            className="menu-link"
            onClick={() => redirectTo(USER_PROFILE_SETTING_URL)}
          >
            Edit Profile
          </div>
        </li>
        <li>
          <div
            className="menu-link"
            onClick={() => redirectTo(USER_ACCOUNT_SETTING_URL)}
          >
            Edit Account
          </div>
        </li>
        <li className="dropdown-divider"></li>
        <li>
          <div className="menu-link">Help</div>
        </li>
        <li>
          <div className="menu-link" onClick={handleLogOut}>
            Signout
          </div>
        </li>
      </ul>
    );
  };

  const getAuthLinks = () => {
    let authLink;
    if (authContext.isAuthenticated) {
      let userName = authService.getUserFullName(authContext.currentUser);
      let userEmail = authService.getUserEmail(authContext.currentUser);
      let avatarStyle = { width: "48px", height: "48px", cursor: "pointer" };

      let openKlass = showAuthLinks ? "open-sub-menu" : "";
      let adminLink;
      if (authContext.hasRole(RoleType.ADMIN)) {
        adminLink = (
          <li>
            <div className="mb-2">
              <strong>Manage</strong>
            </div>
            <div
              className="menu-link"
              onClick={() => redirectTo(ADMIN_PANEL_URL)}
            >
              <span>Admin Panel</span>
            </div>
          </li>
        );
      }
      authLink = (
        <React.Fragment>
          <li className={`${openKlass}`} style={{ backgroundColor: "#f8f8f1" }}>
            <div className="menu-link" onClick={handleAvatarMenuClick}>
              <Avatar styles={avatarStyle} />
              <span className="ml-2">
                <span>{userName}</span> <br />
                <small className="text-secondary">{userEmail}</small>
              </span>
              {getExpander()}
            </div>
            {getAuthenticatedUserLinks()}
          </li>
          {adminLink}
          <li>
            <div className="mb-2">
              <strong>Learn</strong>
            </div>
            <div
              className="menu-link"
              onClick={() => redirectTo(USER_COURSES_URL)}
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
          onClick={handleSignUpClick}
        >
          <div>Sign Up / Log In</div>
        </li>
      );
    }
    return authLink;
  };

  const getLevelOneMenuItems = (categories: ICategory[]) => {
    const levelOneMenuItems = categories.map(category => {
      let openKlass =
        selectedMenuItem === category || levelTwoParent === category
          ? "open-sub-menu"
          : "";
      return (
        <li key={category.id} className={openKlass}>
          <Link
            className="menu-link"
            to={BUILD_CATEGORY_URL(category.id)}
            onClick={e => handleMenuLinkClick(e, category)}
          >
            {category.name}
            {getExpander()}
          </Link>

          {getLevelTwoMenuItems(category)}
        </li>
      );
    });

    return (
      <ul className="side-drawer-level-one">
        {getAuthLinks()}
        {levelOneMenuItems}
        <li className="dropdown-divider"></li>
        <li
          key="donate-link"
          className="auth-link pt-0"
          onClick={handleDonateLinkClick}
        >
          <div>
            <FontAwesomeIcon icon="donate" className="ra-icon" size="lg" />
            Donate
          </div>
        </li>
      </ul>
    );
  };

  let openKlass = "";
  if (props.isOpen) {
    openKlass = "open";
  }

  const modalDialog = (
    <Modal
      isOpen={showModal}
      modalTitle={modalTitle}
      modalBody={modalBody}
      onCloseHandler={() => setShowModal(false)}
    />
  );

  const backGroundClickHandler = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.backdropClickHandler();
    }
  };

  return (
    <div
      className={`backdrop side-drawer ${openKlass}`}
      onClick={backGroundClickHandler}
    >
      {modalDialog}
      <div className="side-drawer-content">
        {getLevelOneMenuItems(categories)}
        <div
          className="side-drawer-close-btn"
          onClick={props.backdropClickHandler}
        >
          <FontAwesomeIcon icon="times-circle" size="3x" color="#fff" />
        </div>
      </div>
    </div>
  );
};

export default withRouter(SideDrawerNew);
