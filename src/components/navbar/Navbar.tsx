import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Autocomplete from "../autocomplete/Autocomplete";

import DrawerToggleButton from "../sidedrawer/DrawerToggleButton";

import "./Navbar.css";
import logo from "../../assets/images/logo.svg";
import DropDown from "../dropdown/DropDown";

interface NavbarProbs {
  drawerToggleHandler: () => void;
}

class NavbarNew extends Component<NavbarProbs, any> {
  handleAutoCompleteOnChange = () => {
    console.log("changing");
  };

  render() {
    return (
      <header className="shadow-sm bg-white rounded top-header">
        <nav className="navbar navbar-expand-md navbar-light bg-light nav-container">
          <DrawerToggleButton onClikHandler={this.props.drawerToggleHandler} />

          <div className="mobile-spacer" />

          <a className="navbar-brand" href="/">
            <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt=""
            />
            Rohingya Academy
          </a>

          <div className="navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto nav-left">
              <li className="nav-item">
              <DropDown displayName="Categories" icon="th-list" />
              </li>
              <li className="nav-item nav-search">
                <Autocomplete
                  icon="search"
                  onChangeHandler={this.handleAutoCompleteOnChange}
                />
              </li>
            </ul>

            <div className="nav-right">
              <div className="donate nav-link">
                <a href="/">
                  <FontAwesomeIcon icon="donate" className="icon" />
                  Donate
                </a>
              </div>
              <div className="login nav-link">
                <a href="/">Log In</a>
              </div>
              <div className="signup nav-link">
                <a href="/">Sign Up</a>
              </div>
            </div>
          </div>
        </nav>
      </header>
    );
  }
}

export default NavbarNew;
