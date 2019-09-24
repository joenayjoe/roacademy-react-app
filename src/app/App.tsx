import React, { Component } from "react";
import Navbar from "../pages/navbar/Navbar";

import { BrowserRouter, Switch } from "react-router-dom";
import Donation from "../pages/donation/Donation";
import Home from "../pages/home/Home";

import "./App.css";

import { ModalIdentifier } from "../settings/DataTypes";
import SideDrawer from "../pages/sidedrawer/SideDrawer";
import ModalSelector from "../components/modal/ModalSelector";
import Category from "../pages/category/Category";
import Grade from "../pages/grade/Grade";
import Course from "../pages/course/Course";
import SearchResult from "../pages/searchresult/SearchResult";
import PublicRoute from "../components/route/PublicRoute";
import PageNotFound from "../components/route/PageNotFound";
import Footer from "../pages/footer/Footer";

interface AppState {
  isSideDrawerOpen: boolean;
  currentModal: ModalIdentifier | null;
}

class App extends Component<{}, AppState> {
  state: AppState = {
    isSideDrawerOpen: false,
    currentModal: null
  };

  handleDrawerToggle = () => {
    this.setState(prevState => {
      return {
        isSideDrawerOpen: !prevState.isSideDrawerOpen
      };
    });
  };

  closeModal = () => {
    this.setState({
      currentModal: null
    });
  };

  backdropClickHandler = () => {
    this.setState({
      isSideDrawerOpen: false
    });
  };
  switchModal(modalIdentifier: ModalIdentifier) {
    this.setState({ currentModal: modalIdentifier });
  }

  render() {
    return (
      <BrowserRouter>
        <ModalSelector
          modalIdentifier={this.state.currentModal}
          closeHandler={this.closeModal}
          modalSwitcher={identifier => this.switchModal(identifier)}
        />

        <Navbar
          drawerToggleHandler={this.handleDrawerToggle}
          modalCloseHandler={this.closeModal}
          modalSwitcher={identifier => this.switchModal(identifier)}
        />

        <SideDrawer
          isOpen={this.state.isSideDrawerOpen}
          modalSwitcher={identifier => this.switchModal(identifier)}
          modalCloseHandler={this.closeModal}
          backdropClickHandler={this.backdropClickHandler}
        />

        <div className="content-wrapper width-75">
          <Switch>
            <PublicRoute exact path="/donation" component={Donation} />
            <PublicRoute
              path="/categories/:category_id/grades/:grade_id"
              component={Grade}
            />
            <PublicRoute exact path="/courses/:course_id" component={Course} />
            <PublicRoute
              exact
              path="/categories/:category_id"
              component={Category}
            />
            <PublicRoute exact path="/search" component={SearchResult} />
            <PublicRoute exact path="/" component={Home} />
            <PublicRoute component={PageNotFound} />
          </Switch>
        </div>
        <Footer />
      </BrowserRouter>
    );
  }
}

export default App;
