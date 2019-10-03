import React, { Component, createRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { isMobile } from "react-device-detect";
import DropDown from "../dropdown/DropDown";
import {
  ICategory,
  IGrade,
  ICourse,
  MenuItemType
} from "../../datatypes/types";

import "./DropDownMenu.css";
import { withRouter, RouteComponentProps } from "react-router";
import { GradeService } from "../../services/GradeService";
import { connect } from "react-redux";
import { AppState } from "../../store";
import { selectCategories } from "../../store/selectors/categorySelector";
import { getCategories } from "../../store/actions/categoryAction";
import { getGradesForCategory } from "../../store/actions/gradeAction";
import { getCoursesForGrade } from "../../store/actions/courseAction";
import { toogleShowDropDownMenu } from "../../store/actions/uiActions";
import { selectGradesForSelectedCategory } from "../../store/selectors/gradeSelector";
import { selectCoursesForSelectedGrade } from "../../store/selectors/courseSelector";

interface IProps extends RouteComponentProps {
  displayName: string;
  icon?: IconProp;

  // redux state to props
  categories: ICategory[];
  grades: IGrade[];
  courses: ICourse[];
  showDropDownMenu: boolean;

  // redux actions
  getCategories: any;
  getGradesForCategory: any;
  getCoursesForGrade: any;
  toogleShowDropDownMenu: any;
}

interface IStates {
  selectedMenuItem: string | null;
  levelTwoParent: string | null;
  showLgScreenDropDownMenu: boolean;
}

class DropDownMenu extends Component<IProps, IStates> {
  private gradeService: GradeService;
  constructor(props: IProps) {
    super(props);
    this.gradeService = new GradeService();
  }
  state: IStates = {
    selectedMenuItem: null,
    levelTwoParent: null,
    showLgScreenDropDownMenu: false
  };

  menuBtnNode: any = createRef();
  menuDropDownListNode: any = createRef();

  loadPage = (item: MenuItemType) => {
    let url: string;

    if ((item as IGrade).categoryId) {
      item = item as IGrade;
      url = "/categories/" + item.categoryId + "/grades/" + item.id;
    } else if ((item as ICourse).gradeId) {
      url = "/courses/" + item.id;
    } else {
      url = "/categories/" + item.id;
    }
    this.props.history.push(url);
    this.setState({
      showLgScreenDropDownMenu: false
    });
    this.props.toogleShowDropDownMenu(false);
  };
  handleMenuLinkClick = (item: MenuItemType) => {
    if (isMobile) {
      if ((item as IGrade).categoryId) {
        const grade = item as IGrade;
        let parent: ICategory | null = null;
        for (let cat of this.props.categories) {
          if (cat.id === grade.categoryId) {
            parent = cat;
            break;
          }
        }
        this.fetchCoursesFor(grade);
        this.setState({ levelTwoParent: parent ? parent.url : null });
      } else {
        // item is category type
        let category = item as ICategory;
          this.fetchGradeForCategory(category);
      }
      
      this.setState({
        selectedMenuItem: item.url
      });
    } else {
      this.loadPage(item);
    }
  };

  handleBackBtnClick = () => {
    const ltp = this.state.levelTwoParent;
    this.setState({
      selectedMenuItem: ltp,
      levelTwoParent: null
    });
  };

  async fetchCoursesFor(grade: IGrade) {
    this.props.getCoursesForGrade(grade.categoryId, grade.id);
  }

  fetchGradeForCategory = (item: ICategory) => {
    this.props.getGradesForCategory(item.id);
  };

  handleOnHoverForGrade = (item: IGrade) => {
    if (!isMobile) {
      this.fetchCoursesFor(item);
    }
  };

  handleOnHoverForCategory = (item: ICategory) => {
    if (!isMobile) {
      this.fetchGradeForCategory(item);
    }
  };

  handleDropDownMouseEnter = () => {
    this.setState({ showLgScreenDropDownMenu: true });
  };

  handleOnClick = (e: Event) => {
    if (this.menuBtnNode.current.contains(e.target)) {
      this.props.toogleShowDropDownMenu();
      if (isMobile) {
        this.setState({ showLgScreenDropDownMenu: true });
      }
    } else if (!isMobile || (isMobile && !this.menuDropDownListNode.contains(e.target))) {
      // this.props.toogleShowDropDownMenu(false);
    }
  };

  componentDidMount() {
    this.props.getCategories();
    document.addEventListener("mousedown", e => this.handleOnClick(e), false);
  }

  componentWillUnmount() {
    document.removeEventListener(
      "mousedown",
      e => this.handleOnClick(e),
      false
    );
  }

  dropDownMenuLevelThree(data: IGrade) {
    let dropDownMenuItem = this.props.courses.map((item: ICourse) => {
      return (
        <li key={item.id} className="drop-down-list-item">
          <div className="menu-link" onClick={() => this.loadPage(item)}>
            <span>{item.name}</span>
          </div>
        </li>
      );
    });

    return (
      <ul className="drop-down-list drop-down-list-level-three">
        {isMobile ? (
          <li
            key="back-l-3"
            className="drop-down-list-item back-menu-link"
            onClick={this.handleBackBtnClick}
          >
            <div>
              <FontAwesomeIcon icon="angle-left" />
              <span> {data.name} </span>
            </div>
          </li>
        ) : null}
        <li key={data.id} className="drop-down-list-item">
          <div className="menu-link" onClick={() => this.loadPage(data)}>
            <span>All {data.name}</span>
          </div>
        </li>
        {dropDownMenuItem}
      </ul>
    );
  }

  dropDownMenuLevelTwo(data: ICategory) {
    let dropDownMenuItem = this.props.grades.map((item: IGrade) => {
      let expander: any;
      let submenu: any;
      let openKlass =
        this.state.levelTwoParent === data.url &&
        this.state.selectedMenuItem === item.url
          ? "open-sub-menu"
          : "";
      expander = (
        <span>
          <FontAwesomeIcon icon="angle-right"></FontAwesomeIcon>
        </span>
      );

      submenu = this.dropDownMenuLevelThree(item);

      return (
        <li
          key={item.id}
          className={`drop-down-list-item ${openKlass}`}
          onMouseEnter={() => this.handleOnHoverForGrade(item)}
        >
          <div
            className="menu-link"
            onClick={() => this.handleMenuLinkClick(item)}
          >
            <span>{item.name}</span>
            {expander}
          </div>
          {submenu}
        </li>
      );
    });

    return (
      <ul className="drop-down-list drop-down-list-level-two">
        {isMobile ? (
          <li
            key="back-l-2"
            className="drop-down-list-item back-menu-link"
            onClick={this.handleBackBtnClick}
          >
            <div>
              <FontAwesomeIcon icon="angle-left" />
              <span> {data.name} </span>
            </div>
          </li>
        ) : null}
        <li key={data.id} className="drop-down-list-item">
          <div className="menu-link" onClick={() => this.loadPage(data)}>
            <span> All {data.name}</span>
          </div>
        </li>
        {dropDownMenuItem}
      </ul>
    );
  }

  dropDownMenuLevelOne(data: ICategory[]) {
    let dropDownMenuItem = data.map((item: ICategory) => {
      let expander: any;
      let submenu: any;
      let openKlass =
        this.state.selectedMenuItem === item.url ||
        this.state.levelTwoParent === item.url
          ? "open-sub-menu"
          : "";
      expander = (
        <span>
          <FontAwesomeIcon icon="angle-right"></FontAwesomeIcon>
        </span>
      );

      submenu = this.dropDownMenuLevelTwo(item);

      return (
        <li
          key={item.id}
          className={`drop-down-list-item ${openKlass}`}
          onMouseEnter={() => this.handleOnHoverForCategory(item)}
        >
          <div
            className="menu-link"
            onClick={() => this.handleMenuLinkClick(item)}
          >
            <span>{item.name}</span>
            {expander}
          </div>
          {submenu}
        </li>
      );
    });

    let disPlayKlass = this.state.showLgScreenDropDownMenu ? "" : "d-none";
    return (
      <ul
        className={`drop-down-list drop-down-list-level-one ${disPlayKlass}`}
        ref={node => (this.menuDropDownListNode = node)}
      >
        {dropDownMenuItem}
      </ul>
    );
  }

  render() {
    return (
      <DropDown
        name="Categories"
        showDropDown={this.props.showDropDownMenu}
        icon="th-list"
        dropDownBtnRef={this.menuBtnNode}
        handleMouseEnter={this.handleDropDownMouseEnter}
      >
        {this.dropDownMenuLevelOne(this.props.categories)}
      </DropDown>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  console.log("state = ", state);
  return {
    categories: selectCategories(state),
    grades: selectGradesForSelectedCategory(state),
    courses: selectCoursesForSelectedGrade(state),
    showDropDownMenu: state.ui.showDropDownMenu
  };
};

const actionCreators = {
  getCategories,
  getGradesForCategory,
  getCoursesForGrade,
  toogleShowDropDownMenu
};

export default connect(
  mapStateToProps,
  actionCreators
)(withRouter(DropDownMenu));
