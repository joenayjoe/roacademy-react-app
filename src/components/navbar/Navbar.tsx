import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Autocomplete from "../../components/autocomplete/Autocomplete";

import "./Navbar.css";
import logo from "../../assets/images/logo.svg";
import DropDownMenu from "./DropDownMenu";
import {
  NavLink,
  Link,
  RouteComponentProps,
  withRouter
} from "react-router-dom";
import {
  ModalIdentifier,
  ILinkItem,
  ISearchRequest
} from "../../settings/DataTypes";
import ToggleBar from "../../components/togglebar/ToggleBar";
import { CourseService } from "../../services/CourseService";
import UserDropDown from "../avatar/UserDropDown";
import { AuthContext } from "../../contexts/AuthContext";
import { BUILD_SEARCH_WITH_QUERY_URL } from "../../settings/Constants";
import Login from "../../pages/user/Login";
import Signup from "../../pages/user/Signup";
import Modal from "../modal/Modal";

interface IProbs extends RouteComponentProps {
  drawerToggleHandler: () => void;
}

const Navbar: React.FunctionComponent<IProbs> = props => {
  const courseService = new CourseService();

  const [suggestions, setSuggestions] = useState<ILinkItem[]>([]);
  const [showBrandName, setShowBrandName] = useState<boolean>(true);
  const [showMobileSearch, setShowMobileSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalBody, setModalBody] = useState<JSX.Element>(<div></div>);

  const authContext = useContext(AuthContext);

  const handleAutoCompleteOnChange = (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setSearchQuery(query);
      return;
    }
    let payload: ISearchRequest = { query };
    courseService.getAutoSuggestForCourse(payload).then(response => {
      setSuggestions(response.data);
    });
  };

  const handleAutocompleteOnClose = () => {
    setShowMobileSearch(false);
    setSuggestions([]);
  };

  const showMobileAutocomplete = () => {
    setShowMobileSearch(true);
    setSuggestions([]);
  };

  const handleAutoCompleteOnSubmit = (query: string) => {
    setSearchQuery(query);
    props.history.push(BUILD_SEARCH_WITH_QUERY_URL(query));
  };

  const handleShowBrandNameToggle = () => {
    setShowBrandName(!showBrandName);
  };

  const switchModal = (modal: ModalIdentifier) => {
    switch (modal) {
      case ModalIdentifier.LOGIN_MODAL:
        showLoginModal();
        break;
      case ModalIdentifier.SIGNUP_MODAL:
        showSignupModal();
        break;
    }
  };
  const showLoginModal = () => {
    setShowModal(true);
    setModalTitle("Login to Your Account");
    setModalBody(
      <Login
        closeHandler={() => setShowModal(false)}
        modalSwitchHandler={(modal: ModalIdentifier) => switchModal(modal)}
      />
    );
  };

  const showSignupModal = () => {
    setShowModal(true);
    setModalTitle("Signup and Start Learning!");
    setModalBody(
      <Signup
        closeHandler={() => setShowModal(false)}
        modalSwitchHandler={(modal: ModalIdentifier) => switchModal(modal)}
      />
    );
  };

  let brandNameDisplayKlass = showBrandName
    ? "d-lg-inline-block"
    : "d-md-none d-sm-none d-none d-lg-inline-block";

  let hideForMobileSearch = showMobileSearch ? "d-none" : "";

  let mobileAutoComplete;
  if (showMobileSearch) {
    mobileAutoComplete = (
      <div className={`autocomplete-mobile`}>
        <Autocomplete
          query={searchQuery}
          autoFoucs
          backdrop
          icon="search"
          suggestions={suggestions}
          placeholder="Search courses ..."
          onChangeHandler={(q: string) => handleAutoCompleteOnChange(q)}
          onSubmitHandler={(q: string) => handleAutoCompleteOnSubmit(q)}
          onCloseHandler={handleAutocompleteOnClose}
        />
      </div>
    );
  }

  let authLinks;
  if (authContext.isAuthenticated) {
    authLinks = <UserDropDown />;
  } else {
    authLinks = (
      <React.Fragment>
        <div className="login nav-link" onClick={showLoginModal}>
          <button className="btn btn-outline-primary nav-btn">Log In</button>
        </div>
        <div className="signup nav-link" onClick={showSignupModal}>
          <button className="btn btn-outline-primary nav-btn">Sign Up </button>
        </div>
      </React.Fragment>
    );
  }

  const modalDialog = (
    <Modal
      isOpen={showModal}
      modalTitle={modalTitle}
      modalBody={modalBody}
      onCloseHandler={() => setShowModal(false)}
    />
  );
  return (
    <header className="bg-white rounded top-header">
      {modalDialog}
      <nav className="navbar navbar-expand-md navbar-light nav-container">
        <ToggleBar
          classNames={hideForMobileSearch}
          id="side-drawer-toggler"
          onClikHandler={props.drawerToggleHandler}
        />

        <div
          className={`mobile-search-icon pl-3 ${hideForMobileSearch}`}
          onClick={showMobileAutocomplete}
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

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto nav-left">
            <li className="nav-item">
              <DropDownMenu displayName="Categories" icon="th-list" />
            </li>
            <li className="nav-item nav-search">
              <Autocomplete
                query={searchQuery}
                suggestions={suggestions}
                placeholder="Search courses ..."
                icon="search"
                onChangeHandler={(q: string) => handleAutoCompleteOnChange(q)}
                onSubmitHandler={(q: string) => handleAutoCompleteOnSubmit(q)}
                onFocusHandler={handleShowBrandNameToggle}
              />
            </li>
          </ul>

          <div className="nav-right">
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
            {authLinks}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default withRouter(Navbar);
