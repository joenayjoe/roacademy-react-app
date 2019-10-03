import React, { Component } from "react";
import Navbar from "../components/navbar/Navbar";

import { BrowserRouter, Switch } from "react-router-dom";
import Donation from "../pages/donation/Donation";
import Home from "../pages/home/Home";
import { Provider } from "react-redux";

import "./App.css";

import { ModalIdentifier } from "../datatypes/types";
import SideDrawer from "../components/sidedrawer/SideDrawer";
import ModalSelector from "../components/modal/ModalSelector";
import Category from "../pages/category/Category";
import Grade from "../pages/grade/Grade";
import Course from "../pages/course/Course";
import SearchResult from "../pages/searchresult/SearchResult";
import PublicRoute from "../pages/route/PublicRoute";
import PrivateRoute from "../pages/route/PrivateRoute";
import PageNotFound from "../pages/route/PageNotFound";
import Footer from "../components/footer/Footer";
import UserDashboard from "../pages/dashboard/UserDashboard";
import configureStore from "../store";
import { isMobileOnly } from "react-device-detect";

interface IStates {
  isSideDrawerOpen: boolean;
  currentModal: ModalIdentifier | null;
}

class App extends Component<{}, IStates> {
  state: IStates = {
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
    let sideDrawyer;
    if (isMobileOnly) {
      sideDrawyer = (
        <SideDrawer
          isOpen={this.state.isSideDrawerOpen}
          modalSwitcher={identifier => this.switchModal(identifier)}
          modalCloseHandler={this.closeModal}
          backdropClickHandler={this.backdropClickHandler}
        />
      );
    }
    const store = configureStore();
    return (
      <Provider store={store}>
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

          {sideDrawyer}

          <div className="content-wrapper width-75">
            <Switch>
              <PublicRoute exact path="/donation" component={Donation} />
              <PublicRoute
                path="/categories/:category_id/grades/:grade_id"
                component={Grade}
              />
              <PublicRoute
                exact
                path="/courses/:course_id"
                component={Course}
              />
              <PublicRoute
                exact
                path="/categories/:category_id"
                component={Category}
              />
              <PublicRoute exact path="/search" component={SearchResult} />
              <PublicRoute exact path="/" component={Home} />
              <PrivateRoute exact path="/dashboard" component={UserDashboard} />
              <PublicRoute component={PageNotFound} />
            </Switch>
          </div>
          <Footer />
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
