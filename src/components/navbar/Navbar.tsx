import React, { useState, useContext, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Autocomplete from "../../components/autocomplete/Autocomplete";

import "./Navbar.css";
import logo from "../../assets/images/logo.svg";
import DropDownMenu from "./DropDownMenu";
import {
  NavLink,
  Link,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
import { ModalIdentifier, ISearchResponse } from "../../settings/DataTypes";
import ToggleBar from "../../components/togglebar/ToggleBar";
import { CourseService } from "../../services/CourseService";
import UserDropDown from "../avatar/UserDropDown";
import { AuthContext } from "../../contexts/AuthContext";
import { BUILD_SEARCH_WITH_QUERY_URL } from "../../settings/Constants";
import Login from "../../pages/user/Login";
import Signup from "../../pages/user/Signup";
import Modal from "../modal/Modal";
import { isMobileOnly, isMobile } from "react-device-detect";
import DropDown from "../dropdown/DropDown";

interface IProbs extends RouteComponentProps {
  drawerToggleHandler: () => void;
}

const Navbar: React.FunctionComponent<IProbs> = (props) => {
  // service
  const courseService = new CourseService();

  // states
  const [suggestions, setSuggestions] = useState<ISearchResponse[]>([]);
  const [showBrandName, setShowBrandName] = useState<boolean>(true);
  const [showMobileSearch, setShowMobileSearch] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [modalBody, setModalBody] = useState<JSX.Element>(<div></div>);
  const [showAuthLinksDropDown, setShowAuthLinksDropDown] = useState<boolean>(
    false
  );

  // context
  const authContext = useContext(AuthContext);

  // refs
  let authLinkDrpDwnRef = useRef<HTMLButtonElement>(null);
  let authLinkListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    document.addEventListener("mousedown", (e) => handleOnClick(e), false);

    return () => {
      document.removeEventListener("mousedown", (e) => handleOnClick(e), false);
    };
    // eslint-disable-next-line
  }, []);

  const handleOnClick = (e: MouseEvent) => {
    if (
      authLinkDrpDwnRef &&
      authLinkDrpDwnRef.current &&
      authLinkDrpDwnRef.current.contains(e.target as HTMLElement)
    ) {
      setShowAuthLinksDropDown(
        (showAuthLinksDropDown) => !showAuthLinksDropDown
      );
    } else if (
      !(
        authLinkListRef &&
        authLinkListRef.current &&
        authLinkListRef.current.contains(e.target as HTMLElement)
      )
    ) {
      setShowAuthLinksDropDown(false);
    }
  };

  const handleAutoCompleteOnChange = (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setSearchQuery(query);
      return;
    }

    courseService
      .getAutoSuggestForCourse(query, 0, 10)
      .then((response) => {
        setSuggestions(response.data.content);
      })
      .catch((err) => {
        console.log("Error:", err);
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
    setShowAuthLinksDropDown(false);
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
    setShowAuthLinksDropDown(false);
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

  let mobileAutoComplete: JSX.Element;
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

  const getAuthLinks = () => {
    if (authContext.isAuthenticated) {
      return <UserDropDown />;
    } else if (isMobile) {
      return (
        <div className="nav-link">
          <DropDown
            icon="bars"
            showDropDown={showAuthLinksDropDown}
            className="drop-down-on-hover"
            dropDownBtnRef={authLinkDrpDwnRef}
          >
            <ul
              className="drop-down-list drop-down-list-arrow-right drop-down-right"
              ref={authLinkListRef}
            >
              <li className="drop-down-list-item">
                <div className="menu-link" onClick={showLoginModal}>
                  <div>
                    <FontAwesomeIcon icon="sign-in-alt" />
                    <span className="ml-2">Login</span>
                  </div>
                </div>
              </li>
              <li className="dropdown-divider"></li>
              <li className="drop-down-list-item">
                <div className="menu-link" onClick={showSignupModal}>
                  <div>
                    <FontAwesomeIcon icon="user-plus" />
                    <span className="ml-2">Sign Up</span>
                  </div>
                </div>
              </li>
            </ul>
          </DropDown>
        </div>
      );
    } else {
      return (
        <React.Fragment>
          <div className="login nav-link" onClick={showLoginModal}>
            <button className="btn btn-outline-primary nav-btn">Log In</button>
          </div>
          <div className="signup nav-link" onClick={showSignupModal}>
            <button className="btn btn-outline-primary nav-btn">Sign Up</button>
          </div>
        </React.Fragment>
      );
    }
  };

  const modalDialog = (
    <Modal
      isOpen={showModal}
      modalTitle={modalTitle}
      modalBody={modalBody}
      onCloseHandler={() => setShowModal(false)}
    />
  );

  const getContentForMobileDevice = () => {
    if (isMobileOnly) {
      return (
        <React.Fragment>
          <ToggleBar
            classNames={hideForMobileSearch}
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
        </React.Fragment>
      );
    }
    return null;
  };
  const getNavRightContents = () => {
    return (
      <React.Fragment>
        <div className="donate nav-link">
          <NavLink to="/donation">
            <button className="btn btn-outline-success d-flex">
              <FontAwesomeIcon icon="donate" className="ra-icon" size="lg" />
              <span> Donate</span>
            </button>
          </NavLink>
        </div>
        {getAuthLinks()}
      </React.Fragment>
    );
  };

  return (
    <header className="bg-white top-header">
      {modalDialog}
      <nav className="navbar navbar-expand-md navbar-light nav-container">
        {getContentForMobileDevice()}
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

          <div className="nav-right">{getNavRightContents()}</div>
        </div>
      </nav>
    </header>
  );
};

export default withRouter(Navbar);
