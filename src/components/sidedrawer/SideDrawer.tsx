import React, { Component } from "react";

import "./SideDrawer.css";

import drawerData from "./drawerData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface SideDrawerProps {
  isOpen: boolean;
}

interface SideDrawerState {
  hoverItemId: number | null;
}

class SideDrawer extends Component<SideDrawerProps, SideDrawerState> {
  constructor(props: SideDrawerProps) {
    super(props);
    this.state = {
      hoverItemId: null
    };
  }

  handleAuthClick = () => {
    // load signup / login page
  };

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
    let drawerClasses = "side-drawer overflow-auto";
    if (this.props.isOpen) {
      drawerClasses = "side-drawer overflow-auto open";
    }

    return (
      <nav className={drawerClasses} role="navigation">
        <ul className="side-drawer-items">
          <li key={0} className="auth-link border-bottom">
            <a href="/">Sign Up / Log In</a>
          </li>

          {this.createMenuItemCategoryList(drawerData.items)}
        </ul>
      </nav>
    );
  }
}

export default SideDrawer;
