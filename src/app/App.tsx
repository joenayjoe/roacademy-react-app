import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";

import { BrowserRouter, Switch } from "react-router-dom";
import Donation from "../pages/donation/Donation";
import Home from "../pages/home/Home";

import "./App.css";

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
import { isMobile } from "react-device-detect";
import { AuthContextProvider } from "../contexts/AuthContext";
import ProfileSetting from "../pages/user/ProfileSetting";
import UserCourse from "../pages/course/UserCourse";
import AccountSetting from "../pages/user/AccountSetting";
import UserPhotoSetting from "../pages/user/UserPhotoSetting";
import OAuth2RedirectHandler from "../pages/oauth2redirect/OAuth2RedirectHandler";
import CategoryList from "../pages/category/CategoryList";
import ModalContextProvider from "../contexts/ModalContext";

const App = () => {
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsSideDrawerOpen(!isSideDrawerOpen);
  };

  const backdropClickHandler = () => {
    setIsSideDrawerOpen(false);
  };

  let sideDrawer;
  if (isMobile) {
    sideDrawer = (
      <SideDrawer
        isOpen={isSideDrawerOpen}
        backdropClickHandler={backdropClickHandler}
      />
    );
  }

  return (
    <AuthContextProvider>
      <ModalContextProvider>
        <BrowserRouter>
          <ModalSelector />

          <Navbar drawerToggleHandler={handleDrawerToggle} />

          {sideDrawer}

          <div className="content-wrapper width-75">
            <Switch>
              <PublicRoute exact path="/donation" component={Donation} />
              <PublicRoute exact path="/categories" component={CategoryList} />
              <PublicRoute
                exact
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
              <PrivateRoute
                exact
                path="/user/account-settings"
                component={AccountSetting}
              />
              <PrivateRoute
                exact
                path="/user/profile-settings"
                component={ProfileSetting}
              />
              <PrivateRoute
                exact
                path="/user/photo-settings"
                component={UserPhotoSetting}
              />
              <PrivateRoute exact path="/user-courses" component={UserCourse} />
              <PublicRoute
                path="/oauth2/redirect"
                component={OAuth2RedirectHandler}
              />
              <PublicRoute component={PageNotFound} />
            </Switch>
          </div>
          <Footer />
        </BrowserRouter>
      </ModalContextProvider>
    </AuthContextProvider>
  );
};

export default App;
