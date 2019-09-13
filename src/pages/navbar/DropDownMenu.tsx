import React, { Component, createRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { isMobile } from "react-device-detect";
import DropDown from "../../components/dropdown/DropDown";
import {
  ICategory,
  IGrade,
  ICourse,
  MenuItemType
} from "../../settings/DataTypes";
import ApiManager from "../../dataManagers/ApiManager";

import "./DropDownMenu.css";

interface DropDownProps {
  displayName: string;
  icon?: IconProp;
}

interface DropDownState {
  isToggle: boolean;
  selectedMenuItem: string | null;
  levelTwoParent: string | null;
  categories: ICategory[];
}

class DropDownMenu extends Component<DropDownProps, DropDownState> {
  private apiManager: ApiManager;
  constructor(props: DropDownProps) {
    super(props);
    this.apiManager = new ApiManager();
  }
  state: DropDownState = {
    isToggle: false,
    selectedMenuItem: null,
    levelTwoParent: null,
    categories: []
  };

  menuBtnNode: any = createRef();
  menuNode: any = createRef();

  loadPage = (item: MenuItemType) => {
    if ((item as IGrade).categoryId) {
      console.log("load data for grade ", item.name);
    } else if ((item as ICourse).gradeId) {
      console.log("load data for courde ", item.name);
    } else {
      console.log("load data fro category ", item.name);
    }
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
      console.log("load page for ", item.url);
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
        const response = await this.apiManager.getCoursesForGrade(grade);

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

  handleOnClick = (e: Event) => {
    if (this.menuBtnNode.current.contains(e.target)) {
      this.setState(prevState => {
        return { isToggle: !prevState.isToggle };
      });
    } else if (!isMobile || (isMobile && !this.menuNode.contains(e.target))) {
      this.setState({ isToggle: false });
    }
  };

  componentDidMount() {
    this.apiManager
      .getCategories()
      .then(response => {
        this.setState({ categories: response.data });
      })
      .catch(error => {
        console.log("Error = ", error.response.data);
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
        <li key={item.id} className="drop-down-menu-item">
          <div className="menu-link" onClick={() => this.loadPage(item)}>
            <span>{item.name}</span>
          </div>
        </li>
      );
    });

    return (
      <ul className="drop-down-menu drop-down-menu-level-three">
        {isMobile ? (
          <li
            key="back-l-3"
            className="drop-down-menu-item back-menu-link"
            onClick={this.handleBackBtnClick}
          >
            <div>
              <FontAwesomeIcon icon="angle-left" />
              <span> {data.name} </span>
            </div>
          </li>
        ) : null}
        <li key={data.id} className="drop-down-menu-item">
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
          className={`drop-down-menu-item ${openKlass}`}
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
      <ul className="drop-down-menu drop-down-menu-level-two">
        {isMobile ? (
          <li
            key="back-l-2"
            className="drop-down-menu-item back-menu-link"
            onClick={this.handleBackBtnClick}
          >
            <div>
              <FontAwesomeIcon icon="angle-left" />
              <span> {data.name} </span>
            </div>
          </li>
        ) : null}
        <li key={data.id} className="drop-down-menu-item">
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
        <li key={item.id} className={`drop-down-menu-item ${openKlass}`}>
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
      <ul
        className="drop-down-menu drop-down-menu-level-one"
        ref={node => (this.menuNode = node)}
      >
        {dropDownMenuItem}
      </ul>
    );
  }

  render() {
    let showKlass = "";
    if (this.state.isToggle) {
      showKlass = "open";
    }
    return (
      <DropDown
        name="Categories"
        id="drop-down-menu"
        classNames={`drop-down ${showKlass}`}
        icon="th-list"
        dropDownBtnRef={this.menuBtnNode}
      >
        {this.dropDownMenuLevelOne(this.state.categories)}
      </DropDown>
    );
  }
}
export default DropDownMenu;
