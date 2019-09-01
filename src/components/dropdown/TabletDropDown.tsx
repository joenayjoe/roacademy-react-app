import React, { Component, createRef } from "react";

import "./TabletDropDown.css";

import drawerData from "../sidedrawer/drawerData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface DropDownProps {
  displayName: string;
  icon?: IconProp;
}

interface DropDownState {
  hoverItemId: number | null;
  isToggle: boolean;
}

class TabletDropDown extends Component<DropDownProps, DropDownState> {
  state: DropDownState = {
    hoverItemId: null,
    isToggle: false
  };

  menuBtnNode: any = createRef();
  menuNode: any = createRef();

  handleOnClick = (e: Event) => {
    if (this.menuBtnNode.contains(e.target)) {
      this.setState(prevState => {
        return { isToggle: !prevState.isToggle };
      });
    } else if (this.menuNode.contains(e.target)) {
      //console.log("load sub menu")
    } else {
      this.setState({ isToggle: false });
    }
  };

  componentDidMount() {
    document.addEventListener("mousedown", e => this.handleOnClick(e), false);
  }

  componentWillUnmount() {
    document.removeEventListener(
      "mousedown",
      e => this.handleOnClick(e),
      false
    );
  }

  // change arrow icon or load page depending of item's children
  handleMenuItemClick = (item: any) => {
    if (item.children !== undefined) {
    }
  };

  handleOnClickEvent = () => {};

  private createMenuItemCategoryList(items: any) {
    let categoryList;
    categoryList = items.map((item: any) => {
      if (item.children !== undefined) {
        return (
          <li key={item.id}>
            <input id={item.id} type="checkbox" hidden />
            <label htmlFor={item.id}>
              {item.name}
              <span>
                <FontAwesomeIcon icon="angle-right"></FontAwesomeIcon>
              </span>
            </label>
            {this.createMenuItemGradeList(item)}
          </li>
        );
      } else {
        return (
          <li key={item.id}>
            <a href={item.url}>{item.name}</a>
          </li>
        );
      }
    });

    return <React.Fragment>{categoryList}</React.Fragment>;
  }

  private createMenuItemGradeList(data: any) {
    if (data.children === undefined) {
      return null;
    }

    let gradeList;

    gradeList = data.children.map((item: any) => {
      if (item.children !== undefined) {
        return (
          <li key={item.id}>
            <input id={item.id} type="checkbox" hidden />
            <label htmlFor={item.id}>
              {item.name}
              <span>
                <FontAwesomeIcon icon="angle-right"></FontAwesomeIcon>
              </span>
            </label>
            {this.createMenuItemCourseList(item)}
          </li>
        );
      } else {
        return (
          <li key={item.id}>
            <a href={item.url}>{item.name}</a>
          </li>
        );
      }
    });
    return (
      <ul className="group-list">
        <React.Fragment>
          <li key={data.id}>
            <a href={data.url}>All in {data.name}</a>
          </li>
          {gradeList}
        </React.Fragment>
      </ul>
    );
  }

  private createMenuItemCourseList(data: any) {
    if (data.children === undefined) {
      return null;
    }

    const courseLis = data.children.map((item: any) => {
      return (
        <li key={item.id}>
          <a href={item.url}>{item.name}</a>
        </li>
      );
    });

    return (
      <ul className="sub-group-list">
        <React.Fragment>
          <li key={data.id}>
            <a href={data.url}>All in {data.name}</a>
          </li>
          {courseLis}
        </React.Fragment>
      </ul>
    );
  }

  render() {
    let showKlass = "";
    if (this.state.isToggle) {
      showKlass = "open";
    }
    return (
      <div id="drop-down-menu" className={`drop-down ${showKlass}`}>
        <button
          className="btn btn-primary-outline nav-link drop-down-btn"
          ref={node => (this.menuBtnNode = node)}
        >
          {this.props.icon ? (
            <span className="drop-down-icon">
              <FontAwesomeIcon icon="th-list" />
            </span>
          ) : null}
          {this.props.displayName}
        </button>

        <ul
          className="drop-down-menu drop-down-menu-level-one"
          ref={node => (this.menuNode = node)}
        >
          {this.createMenuItemCategoryList(drawerData.items)}
        </ul>
      </div>
    );
  }
}

export default TabletDropDown;
