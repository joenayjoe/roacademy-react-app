import React, { Component } from "react";
import NavbarNew from "../navbar/Navbar";
import SideDrawer from "../sidedrawer/SideDrawer";
import Backdrop from "../backdrop/Backdrop";

import "./App.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSignInAlt,
  faSignOutAlt,
  faSearch,
  faThList,
  faDonate,
  faBars,
  faAngleRight,
  faAngleDown,
  faCaretUp
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faSignInAlt,
  faSignOutAlt,
  faSearch,
  faThList,
  faDonate,
  faBars,
  faAngleRight,
  faAngleDown,
  faCaretUp
);

interface AppState {
  sideDrawerOpen: boolean;
}
class App extends Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      sideDrawerOpen: false
    };
  }

  drawerToggleHandler = () => {
    this.setState(prevState => {
      return { sideDrawerOpen: !prevState.sideDrawerOpen };
    });
  };

  backdropClickHandler = () => {
    this.setState({ sideDrawerOpen: false });
  };

  render() {
    let backdrop;
    if (this.state.sideDrawerOpen) {
      backdrop = <Backdrop onClickHandler={this.backdropClickHandler} />;
    }
    return (
      <React.Fragment>
        {backdrop}

        <NavbarNew drawerToggleHandler={this.drawerToggleHandler} />
        <SideDrawer isOpen={this.state.sideDrawerOpen} />
        <div className="content-wrapper">
          <div>
            Content here
            <a href="/"> A test Link</a>
            </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
