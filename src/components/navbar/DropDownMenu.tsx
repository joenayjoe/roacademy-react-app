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

import "./DropDownMenu.css";
import { withRouter, RouteComponentProps } from "react-router";
import { CategoryService } from "../../services/CategoryService";
import { GradeService } from "../../services/GradeService";

interface IProps extends RouteComponentProps {
  displayName: string;
  icon?: IconProp;
}

interface IStates {
  showDropDownMenu: boolean;
  selectedMenuItem: string | null;
  levelTwoParent: string | null;
  categories: ICategory[];
  showLgScreenDropDownMenu: boolean;
}

class DropDownMenu extends Component<IProps, IStates> {
  private categoryService: CategoryService;
  private gradeService: GradeService;
  constructor(props: IProps) {
    super(props);
    this.categoryService = new CategoryService();
    this.gradeService = new GradeService();
  }
  state: IStates = {
    showDropDownMenu: false,
    selectedMenuItem: null,
    levelTwoParent: null,
    categories: [],
    showLgScreenDropDownMenu: false
  };

  menuBtnNode: any = createRef();
  menuNode: any = createRef();

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
      showLgScreenDropDownMenu: false,
      showDropDownMenu: false
    });
  };
  handleMenuLinkClick = (item: MenuItemType) => {
    if (isMobile) {
      if ((item as IGrade).categoryId) {
        const grade = item as IGrade;
        let parent: ICategory | null = null;
        for (let cat of this.state.categories) {
          if (cat.id === grade.categoryId) {
            parent = cat;
            break;
          }
        }
        this.fetchCoursesFor(grade);
        this.setState({ levelTwoParent: parent ? parent.url : null });
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
    if (grade.catched === undefined || !grade.catched) {
      try {
        const response = await this.gradeService.getCoursesForGrade(grade);

        let oldCategories = this.state.categories;
        let updatedCategories = oldCategories.map(cat => {
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

  handleOnHoverForGrade = (item: IGrade) => {
    if (!isMobile) {
      this.fetchCoursesFor(item);
    }
  };

  handleDropDownMouseEnter = () => {
    this.setState({ showLgScreenDropDownMenu: true });
  };

  handleOnClick = (e: Event) => {
    if (this.menuBtnNode.current.contains(e.target)) {
      this.setState(prevState => {
        return { showDropDownMenu: !prevState.showDropDownMenu };
      });
      if(isMobile) {
        this.setState({showLgScreenDropDownMenu: true});
      }
    } else if (!isMobile || (isMobile && !this.menuNode.contains(e.target))) {
      this.setState({ showDropDownMenu: false });
    }
  };

  componentDidMount() {
    this.categoryService
      .getCategories()
      .then(response => {
        this.setState({ categories: response.data });
      })
      .catch(error => {
        // console.log("Error = ", error.response.data);
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
    let dropDownMenuItem = data.grades.map((item: IGrade) => {
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
        <li key={item.id} className={`drop-down-list-item ${openKlass}`}>
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
        ref={node => (this.menuNode = node)}
      >
        {dropDownMenuItem}
      </ul>
    );
  }

  render() {
    return (
      <DropDown
        name="Categories"
        showDropDown={this.state.showDropDownMenu}
        icon="th-list"
        dropDownBtnRef={this.menuBtnNode}
        handleMouseEnter={this.handleDropDownMouseEnter}
      >
        {this.dropDownMenuLevelOne(this.state.categories)}
      </DropDown>
    );
  }
}
export default withRouter(DropDownMenu);
