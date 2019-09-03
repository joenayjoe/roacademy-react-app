import React, { Component, createRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { isMobile } from "react-device-detect";
import drawerData from "../sidedrawer/drawerData";
import DropDown from "../dropdown/DropDown";

import "./DropDownMenu.css";

interface DropDownProps {
  displayName: string;
  icon?: IconProp;
}

interface DropDownState {
  isToggle: boolean;
  selectedMenuLinkId: number | null;
  levelTwoParent: number | null;
}

class DropDownMenu extends Component<DropDownProps, DropDownState> {
  state: DropDownState = {
    isToggle: false,
    selectedMenuLinkId: null,
    levelTwoParent: null
  };

  menuBtnNode: any = createRef();
  menuNode: any = createRef();

  handleMenuLinkClick = (item: any, levelTwoPID?: number) => {
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

  handleBackBtnClick = (data: any) => {
    const ltp = this.state.levelTwoParent;
    this.setState({
      selectedMenuLinkId: ltp,
      levelTwoParent: null
    });
  };

  handleOnClick = (e: Event) => {
    if (this.menuBtnNode.current.contains(e.target)) {
      this.setState(prevState => {
        return { isToggle: !prevState.isToggle };
      });
    } else if (!isMobile || (isMobile && !this.menuNode.contains(e.target))) {
      console.log("make toggle false");
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
        {isMobile ? (
          <li
            key="back-l-3"
            className="drop-down-menu-item back-menu-link"
            onClick={() => this.handleBackBtnClick(data)}
          >
            <div>
              <FontAwesomeIcon icon="angle-left" />
              <span> {data.name} </span>
            </div>
          </li>
        ) : null}
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
        {isMobile ? (
          <li
            key="back-l-2"
            className="drop-down-menu-item back-menu-link"
            onClick={() => this.handleBackBtnClick(data)}
          >
            <div>
              <FontAwesomeIcon icon="angle-left" />
              <span> {data.name} </span>
            </div>
          </li>
        ) : null}
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
        <li
          key={item.id}
          className={`drop-down-menu-item ${openKlass} ${openParenMenu}`}
        >
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
      <DropDown
        name="Categories"
        id="drop-down-menu"
        classNames={`drop-down ${showKlass}`}
        icon="th-list"
        dropDownBtnRef={this.menuBtnNode}
      >
        {this.dropDownMenuLevelOne(drawerData.items)}
      </DropDown>
    );
  }
}
export default DropDownMenu;
