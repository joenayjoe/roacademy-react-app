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
} from "../../settings/DataTypes";
import { withRouter, RouteComponentProps } from "react-router";
import { CategoryService } from "../../services/CategoryService";
import { GradeService } from "../../services/GradeService";
import { isGrade, isCourse } from "../../utils/typeChecker";
import Spinner from "../spinner/Spinner";
import {
  BUILD_GRADE_URL,
  BUILD_COURSE_URL,
  BUILD_CATEGORY_URL
} from "../../settings/Constants";
import { CourseService } from "../../services/CourseService";

interface IProps extends RouteComponentProps {
  displayName: string;
  icon?: IconProp;
}

interface IStates {
  showDropDownMenu: boolean;
  selectedMenuItem: MenuItemType | null;
  levelTwoParent: MenuItemType | null;
  categories: ICategory[];
  showLgScreenDropDownMenu: boolean;
  isLoadingCategory: boolean;
  isLoadingGrade: boolean;
  isLoadingCourse: boolean;
}

class DropDownMenu extends Component<IProps, IStates> {
  private categoryService: CategoryService;
  private gradeService: GradeService;
  private courseService: CourseService;
  constructor(props: IProps) {
    super(props);
    this.categoryService = new CategoryService();
    this.gradeService = new GradeService();
    this.courseService = new CourseService();
  }
  state: IStates = {
    showDropDownMenu: false,
    selectedMenuItem: null,
    levelTwoParent: null,
    categories: [],
    showLgScreenDropDownMenu: false,
    isLoadingCategory: false,
    isLoadingGrade: false,
    isLoadingCourse: false
  };

  menuBtnNode: any = createRef();
  menuNode: any = createRef();

  loadPage = (item: MenuItemType) => {
    let url: string;

    if ((item as IGrade).primaryCategory) {
      item = item as IGrade;
      url = BUILD_GRADE_URL(item.id);
    } else if ((item as ICourse).primaryGrade) {
      url = BUILD_COURSE_URL(item.id);
    } else {
      url = BUILD_CATEGORY_URL(item.id);
    }
    this.setState({
      showLgScreenDropDownMenu: false,
      showDropDownMenu: false
    });
    this.props.history.push(url);
  };

  handleMenuItemMouseEnter = (item: MenuItemType) => {
    if (isGrade(item)) {
      this.fetchCoursesForGrade(item as IGrade);
    } else if (isCourse(item)) {
      this.loadPage(item);
    } else {
      this.fetchGradesForCategory(item as ICategory);
    }
  };

  handleMenuLinkClick = (item: MenuItemType) => {
    if (isMobile) {
      if (isGrade(item)) {
        const grade = item as IGrade;
        let parent: ICategory | null = null;
        for (let cat of this.state.categories) {
          if (cat.id === grade.primaryCategory.id) {
            parent = cat;
            break;
          }
        }
        this.fetchCoursesForGrade(grade);
        this.setState({ levelTwoParent: parent ? parent : null });
      } else if (isCourse(item)) {
        this.loadPage(item);
      } else {
        this.fetchGradesForCategory(item as ICategory);
      }
      this.setState({
        selectedMenuItem: item
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

  fetchGradesForCategory(category: ICategory) {
    if (category.catched === undefined || !category.catched) {
      this.setState({ isLoadingGrade: true });
      this.gradeService.getGradesByCategoryId(category.id).then(resp => {
        let categories = this.state.categories.map(cat => {
          if (cat.id === category.id) {
            cat.grades = resp.data;
            cat.catched = true;
          }
          return cat;
        });
        this.setState({ categories: categories, isLoadingGrade: false });
      });
    }
  }
  fetchCoursesForGrade(grade: IGrade) {
    if (grade.catched === undefined || !grade.catched) {
      this.setState({ isLoadingCourse: true });
      this.courseService.getCoursesByGradeId(grade.id).then(resp => {
        let categories = this.state.categories.map(cat => {
          if (cat.id === grade.primaryCategory.id) {
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

        this.setState({ categories: categories, isLoadingCourse: false });
      });
    }
  }

  handleDropDownMouseEnter = () => {
    this.setState({ showLgScreenDropDownMenu: true });
  };

  handleOnClick = (e: Event) => {
    if (this.menuBtnNode.current.contains(e.target)) {
      this.setState(prevState => {
        return { showDropDownMenu: !prevState.showDropDownMenu };
      });
    } else if (!isMobile || (isMobile && !this.menuNode.contains(e.target))) {
      this.setState({ showDropDownMenu: false });
    }
  };

  componentDidMount() {
    this.setState({ isLoadingCategory: true });
    this.categoryService.getCategories().then(response => {
      this.setState({ categories: response.data, isLoadingCategory: false });
    });
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
    let dropDownMenuItem = data.courses.map((item: ICourse) => {
      return (
        <li key={item.id} className="drop-down-list-item">
          <div
            className="menu-link"
            onClick={() => this.handleMenuLinkClick(item)}
          >
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
        {this.state.isLoadingCourse ? <Spinner /> : dropDownMenuItem}
      </ul>
    );
  }

  dropDownMenuLevelTwo(data: ICategory) {
    let dropDownMenuItem = data.grades.map((item: IGrade) => {
      let expander: any;
      let submenu: any;
      let openKlass =
        this.state.levelTwoParent === data &&
        this.state.selectedMenuItem === item
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
          onMouseEnter={() => this.handleMenuItemMouseEnter(item)}
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
        {this.state.isLoadingGrade ? <Spinner /> : dropDownMenuItem}
      </ul>
    );
  }

  dropDownMenuLevelOne(data: ICategory[]) {
    let dropDownMenuItem = data.map((item: ICategory) => {
      let expander: any;
      let submenu: any;
      let openKlass =
        this.state.selectedMenuItem === item ||
        this.state.levelTwoParent === item
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
          onMouseEnter={() => this.handleMenuItemMouseEnter(item)}
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
        className={`drop-down-list drop-down-list-level-one drop-down-list-arrow-left ${disPlayKlass}`}
        ref={node => (this.menuNode = node)}
      >
        {this.state.isLoadingCategory ? (
          <Spinner classNames="pt-4" />
        ) : (
          dropDownMenuItem
        )}
      </ul>
    );
  }

  render() {
    return (
      <DropDown
        name="Categories"
        classNames="drop-down-on-hover"
        showDropDown={this.state.showDropDownMenu}
        icon={this.props.icon}
        dropDownBtnRef={this.menuBtnNode}
        handleMouseEnter={this.handleDropDownMouseEnter}
      >
        {this.dropDownMenuLevelOne(this.state.categories)}
      </DropDown>
    );
  }
}
export default withRouter(DropDownMenu);
