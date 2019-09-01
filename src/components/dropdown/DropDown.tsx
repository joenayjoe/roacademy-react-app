import React, { Component, createRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { isMobile } from "react-device-detect";
import drawerData from "../sidedrawer/drawerData";

import "./DropDown.css";

interface DropDownProps {
  displayName: string;
  icon?: IconProp;
}

interface DropDownState {
  isToggle: boolean;
  selectedMenuLinkId: number | null;
  levelTwoParent: number | null;
}

class DropDown extends Component<DropDownProps, DropDownState> {
  state: DropDownState = {
    isToggle: false,
    selectedMenuLinkId: null,
    levelTwoParent: null
  };

  menuBtnNode: any = createRef();
  menuNode: any = createRef();

  handleMenuLinkClick = (
    item: any,
    levelTwoPID?: number
  ) => {
    if (isMobile) {
      if (item.children === undefined) {
        console.log("no sub menu, load data for link");
        // TODO
      } else {
        this.setState({
          selectedMenuLinkId: item.id,
          levelTwoParent: levelTwoPID || null
        });
      }
    } else {
      console.log("load page for ", item.url);
    }
  };
  handleOnClick = (e: Event) => {
    if (this.menuBtnNode.contains(e.target)) {
      console.log("change toggle state")
      this.setState(prevState => {
        return { isToggle: !prevState.isToggle };
      });
    } else if (!isMobile || (isMobile && !this.menuNode.contains(e.target))) {
      console.log("make toggle false")
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

  dropDownMenuLevelThree(data: any) {
    let dropDownMenuItem = data.children.map((item: any) => {
      let openKlass =
        this.state.selectedMenuLinkId === item.id ? "open-sub-menu" : "";
      return (
        <li key={item.id} className={`drop-down-menu-item ${openKlass}`}>
          <div
            className="menu-link"
            data-href={item.url}
            onClick={() => this.handleMenuLinkClick(item, data.id)}
          >
            <span>{item.name}</span>
          </div>
        </li>
      );
    });
    return (
      <ul className="drop-down-menu drop-down-menu-level-three">
        <li key={data.id} className="drop-down-menu-item">
          <div
            className="menu-link"
            data-href={data.url}
            onClick={() => this.handleMenuLinkClick(data)}
          >
            <span>All {data.name}</span>
          </div>
        </li>
        {dropDownMenuItem}
      </ul>
    );
  }

  dropDownMenuLevelTwo(data: any) {
    let dropDownMenuItem = data.children.map((item: any) => {
      let expander: any;
      let submenu: any;
      let openKlass =
        this.state.selectedMenuLinkId === item.id ? "open-sub-menu" : "";
      if (item.children !== undefined) {
        expander = (
          <span>
            <FontAwesomeIcon icon="angle-right"></FontAwesomeIcon>
          </span>
        );
        submenu = this.dropDownMenuLevelThree(item);
      }

      return (
        <li key={item.id} className={`drop-down-menu-item ${openKlass}`}>
          <div
            className="menu-link"
            data-href={item.url}
            onClick={() => this.handleMenuLinkClick(item, data.id)}
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
        <li key={data.id} className="drop-down-menu-item">
          <div
            className="menu-link"
            data-href={data.url}
            onClick={() => this.handleMenuLinkClick(data)}
          >
            <span> All {data.name}</span>
          </div>
        </li>
        {dropDownMenuItem}
      </ul>
    );
  }

  dropDownMenuLevelOne(data: any) {
    let dropDownMenuItem = data.map((item: any) => {
      let expander: any;
      let submenu: any;
      let openKlass =
        this.state.selectedMenuLinkId === item.id ? "open-sub-menu" : "";

      let openParenMenu =
        this.state.levelTwoParent === item.id ? "open-sub-menu" : "";
      if (item.children !== undefined) {
        expander = (
          <span>
            <FontAwesomeIcon icon="angle-right"></FontAwesomeIcon>
          </span>
        );
        submenu = this.dropDownMenuLevelTwo(item);
      }
      return (
        <li key={item.id} className={`drop-down-menu-item ${openKlass} ${openParenMenu}`}>
          <div
            className="menu-link"
            data-href={item.url}
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
        {this.dropDownMenuLevelOne(drawerData.items)}
      </div>
    );
  }
}
export default DropDown;
