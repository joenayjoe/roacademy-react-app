import React, { Component } from "react";
import Navbar from "../navbar/Navbar";
import SideDrawer from "../sidedrawer/SideDrawer";
import Backdrop from "../backdrop/Backdrop";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import Donation from "../donation/Donation";
import Home from "../home/Home";

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
  faAngleLeft,
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
  faAngleLeft,
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
      <BrowserRouter>
        {backdrop}

        <Navbar drawerToggleHandler={this.drawerToggleHandler} />
        <SideDrawer isOpen={this.state.sideDrawerOpen} />

        <div className="content-wrapper">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/donation" component={Donation} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
