import React, { Component } from "react";
import {
  ICategory,
  IGrade,
  MenuItemType,
  ModalIdentifier,
  ICourse
} from "../../settings/DataTypes";

import "./SideDrawer.css";
import ApiManager from "../../dataManagers/ApiManager";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AxiosError } from "axios";
import { RouteComponentProps, withRouter } from "react-router";

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
}

class SideDrawerNew extends Component<IProps, IStates> {
  private apiManager: ApiManager;
  constructor(props: IProps) {
    super(props);
    this.apiManager = new ApiManager();

    this.state = {
      categories: [],
      levelTwoParent: null,
      selectedMenuItem: null
    };
  }

  componentDidMount() {
    this.apiManager
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

  handleAuthLinkClick = () => {
    this.showSignupModal();
  };

  async getCoursesFor(grade: IGrade) {
    if (grade.catched === undefined || !grade.catched) {
      try {
        const response = await this.apiManager.getCoursesForGrade(grade);
        // update state
        let oldCategories = this.state.categories;
        let updatedCategories = oldCategories.map((cat: ICategory) => {
          let gradesMap = cat.grades.map(grd => {
            if (grd.id === grade.id) {
              grd = { ...grd, courses: response.data, catched: true };
            }
            return grd;
          });
          let catClone = { ...cat, grades: gradesMap };
          return catClone;
        });
        this.setState({ categories: updatedCategories });
      } catch (error) {
        console.log("Error ", error.response);
      }
    }
  }

  handleMenuLinkClick = (item: MenuItemType) => {
    if ((item as IGrade).categoryId) {
      const grade = item as IGrade;
      let parent: ICategory | null = null;
      for (let cat of this.state.categories) {
        if (cat.id === grade.categoryId) {
          parent = cat;
          break;
        }
      }
      this.getCoursesFor(grade);
      this.setState({ levelTwoParent: parent ? parent.url : null });
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

  getBackButtonLink = (data: MenuItemType) => {
    return (
      <li
        key="back-l-2"
        className="back-menu-link"
        onClick={() => this.handleBackBtnClick(data)}
      >
        <div>
          <FontAwesomeIcon icon="angle-left" />
          <span> {data.name} </span>
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
          <div className="menu-link" onClick={() => this.loadPage(course)}>
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
        <li
          key="auth-link"
          className="auth-link border-bottom"
          onClick={this.handleAuthLinkClick}
        >
          <div>Sign Up / Log In</div>
        </li>
        {levelOneMenuItems}
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
        </div>
      </React.Fragment>
    );
  }
}

export default withRouter(SideDrawerNew);
