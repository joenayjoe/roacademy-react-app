import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Autocomplete from "../../components/autocomplete/Autocomplete";

import DrawerToggleButton from "../sidedrawer/DrawerToggleButton";

import "./Navbar.css";
import logo from "../../assets/images/logo.svg";
import DropDownMenu from "./DropDownMenu";
import { NavLink } from "react-router-dom";
import { ModalDataType, ModalType, ModalSize } from "../../settings/DataTypes";
import LoginModalBody from "../../components/modal/LoginModalBody";
import SignupModalBody from "../../components/modal/SignupModalBody";

interface NavbarProbs {
  drawerToggleHandler: () => void;
  modalShowHandler: (
    modalData: ModalDataType,
    size?: ModalSize,
    modalType?: ModalType
  ) => void;
  modalCloseHandler: () => void;
}

class NavbarNew extends Component<NavbarProbs, {}> {
  handleAutoCompleteOnChange = () => {
    console.log("changing");
  };

  showLoginModal = () => {
    const modalData: ModalDataType = {
      heading: "Log In to Your Account!",
      modalBody: <LoginModalBody showSignupModalHandler={this.showSignupModal}/>
    };

    this.props.modalShowHandler(modalData);
  };

  showSignupModal = () => {
    const modalData: ModalDataType = {
      heading: "Sign Up and Start Learning!",
      modalBody: <SignupModalBody showLoginModalHandler = {this.showLoginModal}/>
    };

    this.props.modalShowHandler(modalData);
  };



  render() {
    return (
      <header className="shadow-sm bg-white rounded top-header">
        <nav className="navbar navbar-expand-md navbar-light bg-light nav-container">
          <DrawerToggleButton onClikHandler={this.props.drawerToggleHandler} />

          <div className="mobile-spacer" />

          <NavLink to="/" className="navbar-brand">
            <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt=""
            />
            Rohingya Academy
          </NavLink>

          <div className="navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto nav-left">
              <li className="nav-item">
                <DropDownMenu displayName="Categories" icon="th-list" />
              </li>
              <li className="nav-item nav-search">
                <Autocomplete
                  placeholder="Search anything ..."
                  icon="search"
                  onChangeHandler={this.handleAutoCompleteOnChange}
                />
              </li>
            </ul>

            <div className="nav-right">
              <div className="login nav-link" onClick={this.showLoginModal}>
                <button className="btn btn-outline-primary nav-btn">
                  Log In
                </button>
              </div>
              <div className="signup nav-link" onClick={this.showSignupModal}>
                <button className="btn btn-primary nav-btn">Sign Up </button>
              </div>
              <div className="donate nav-link">
                <NavLink to="/donation">
                  <button className="btn btn-outline-success">
                    <FontAwesomeIcon
                      icon="donate"
                      className="ra-icon"
                      size="lg"
                    />
                    Donate
                  </button>
                </NavLink>
              </div>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

export default NavbarNew;
