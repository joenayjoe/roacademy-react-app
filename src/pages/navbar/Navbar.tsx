import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Autocomplete from "../../components/autocomplete/Autocomplete";

import "./Navbar.css";
import logo from "../../assets/images/logo.svg";
import DropDownMenu from "./DropDownMenu";
import { NavLink, Link } from "react-router-dom";
import {
  ModalIdentifier,
  ILinkItem,
  ISearchRequest
} from "../../settings/DataTypes";
import ApiManager from "../../dataManagers/ApiManager";
import ToggleBar from "../../components/togglebar/ToggleBar";
import AutocompleteMobile from "../../components/autocomplete/AutocompleteMobile";

interface IProbs {
  drawerToggleHandler: () => void;
  modalCloseHandler: () => void;
  modalSwitcher: (modalIdentifier: ModalIdentifier) => void;
}

interface IStates {
  suggestions: ILinkItem[];
  showBrandName: boolean;
  showMobileSearch: boolean;
}

class NavbarNew extends Component<IProbs, IStates> {
  private apiManager: ApiManager;
  constructor(props: IProbs) {
    super(props);
    this.state = {
      suggestions: [],
      showBrandName: true,
      showMobileSearch: false
    };
    this.apiManager = new ApiManager();
  }
  handleAutoCompleteOnChange = (query: string) => {
    if (query.length < 2) {
      this.setState({ suggestions: [] });
      return;
    }
    let payload: ISearchRequest = { query };
    this.apiManager
      .getAutoSuggestForCourse(payload)
      .then(response => {
        this.setState({ suggestions: response.data });
      })
      .catch(error => {
        console.log(error.response.data);
      });
  };

  handleMobileSearchToggle = () => {
    this.setState(prevState => {
      return {
        showMobileSearch: !prevState.showMobileSearch,
        suggestions: []
      };
    });
  };

  handleAutoCompleteOnSubmit = (query: string) => {
    console.log("autocomplete submited with: ", query);
  };

  handleShowBrandNameToggle = () => {
    this.setState(prevState => {
      return { showBrandName: !prevState.showBrandName };
    });
  };

  showLoginModal = () => {
    this.props.modalSwitcher(ModalIdentifier.LOGIN_MODAL);
  };

  showSignupModal = () => {
    this.props.modalSwitcher(ModalIdentifier.SIGNUP_MODAL);
  };

  render() {
    let brandNameDisplayKlass = this.state.showBrandName
      ? "d-lg-inline-block"
      : "d-md-none d-sm-none d-none d-lg-inline-block";

    let hideForMobileSearch = this.state.showMobileSearch ? "d-none" : "";

    let mobileAutoComplete;
    if (this.state.showMobileSearch) {
      mobileAutoComplete = (
        <div className={`autocomplete-mobile`}>
          <AutocompleteMobile
            suggestions={this.state.suggestions}
            placeholder="Search courses ..."
            onChangeHandler={(q: string) => this.handleAutoCompleteOnChange(q)}
            onSubmitHandler={(q: string) => this.handleAutoCompleteOnSubmit(q)}
            onCloseHandler={this.handleMobileSearchToggle}
          />
        </div>
      );
    }
    return (
      <header className="shadow-sm bg-white rounded top-header">
        <nav className="navbar navbar-expand-md navbar-light bg-light nav-container">
          <ToggleBar
            classNames={hideForMobileSearch}
            id="side-drawer-toggler"
            onClikHandler={this.props.drawerToggleHandler}
          />

          <div
            className={`mobile-search-icon pl-3 ${hideForMobileSearch}`}
            onClick={this.handleMobileSearchToggle}
          >
            <FontAwesomeIcon icon="search" />
          </div>
          {mobileAutoComplete}
          <div className="mobile-spacer" />

          <div className={`${hideForMobileSearch}`}>
            <Link to="/" className={`navbar-brand d-flex`}>
              <img
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top"
                alt=""
              />
              <div className={`brand-title ${brandNameDisplayKlass}`}>
                Rohingya Academy
              </div>
            </Link>
          </div>

          <div className="navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto nav-left">
              <li className="nav-item">
                <DropDownMenu displayName="Categories" icon="th-list" />
              </li>
              <li className="nav-item nav-search">
                <Autocomplete
                  suggestions={this.state.suggestions}
                  placeholder="Search courses ..."
                  icon="search"
                  onChangeHandler={(q: string) =>
                    this.handleAutoCompleteOnChange(q)
                  }
                  onSubmitHandler={(q: string) =>
                    this.handleAutoCompleteOnSubmit(q)
                  }
                  onFocusHandler={this.handleShowBrandNameToggle}
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
