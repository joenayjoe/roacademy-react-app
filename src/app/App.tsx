import React, { Component } from "react";
import Navbar from "../pages/navbar/Navbar";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import Donation from "../pages/donation/Donation";
import Home from "../pages/home/Home";

import "./App.css";

import { ModalIdentifier } from "../settings/DataTypes";
import SideDrawerNew from "../pages/sidedrawer/SideDrawerNew";
import ModalSelector from "../components/modal/ModalSelector";
import Category from "../pages/category/Category";
import Grade from "../pages/grade/Grade";
import Course from "../pages/course/Course";

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

        <SideDrawerNew
          isOpen={this.state.isSideDrawerOpen}
          modalSwitcher={identifier => this.switchModal(identifier)}
          modalCloseHandler={this.closeModal}
          backdropClickHandler={this.backdropClickHandler}
        />

        <div className="content-wrapper">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/donation" component={Donation} />
            <Route
              path="/categories/:category_id/grades/:grade_id"
              render={props => (
                <Grade key={props.match.params.grade_id} {...props} />
              )}
            />
              <Route
              path="/courses/:course_id"
              render={props => (
                <Course key={props.match.params.course_id} {...props} />
              )}
            />
            <Route
              path="/categories/:category_id"
              render={props => (
                <Category key={props.match.params.category_id} {...props} />
              )}
            />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
