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
import AuthContextProvider from "../contexts/AuthContext";
import ProfileSetting from "../pages/user/ProfileSetting";
import UserCourse from "../pages/course/UserCourse";
import AccountSetting from "../pages/user/AccountSetting";
import UserPhotoSetting from "../pages/user/UserPhotoSetting";
import OAuth2RedirectHandler from "../pages/oauth2redirect/OAuth2RedirectHandler";
import CategoryList from "../pages/category/CategoryList";
import ModalContextProvider from "../contexts/ModalContext";
import AdminDashboard from "../pages/adminpanel/AdminDashboard";
import { RoleType } from "../settings/DataTypes";
import {
  ADMIN_PANEL_URL,
  GRADE_URL,
  COURSE_URL,
  CATEGORY_URL,
  SEARCH_URL,
  HOME_URL,
  USER_DASHBOARD_URL,
  USER_ACCOUNT_SETTING_URL,
  USER_PROFILE_SETTING_URL,
  USER_PHOTO_SETTING_URL,
  USER_COURSES_URL,
  DONATION_URL,
  CATEGORIES_URL,
  OAUTH2_REDIRECT_URL,
  ADMIN_CATEGORIES_URL,
  ADMIN_GRADES_URL,
  ADMIN_COURSES_URL,
  ADMIN_CATEGORY_URL
} from "../settings/Constants";
import AdminCourse from "../pages/adminpanel/AdminCourse";
import AdminGrade from "../pages/adminpanel/AdminGrade";
import AdminCategoryList from "../pages/adminpanel/AdminCategoryList";
import AdminCategory from "../pages/adminpanel/AdminCategory";

const App = () => {
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsSideDrawerOpen(!isSideDrawerOpen);
  };

  const backdropClickHandler = () => {
    setIsSideDrawerOpen(false);
  };

  return (
    <AuthContextProvider>
      <ModalContextProvider>
        <BrowserRouter>
          <ModalSelector sideDrawerCloseHandler={backdropClickHandler} />

          <Navbar drawerToggleHandler={handleDrawerToggle} />

          <SideDrawer
            isOpen={isSideDrawerOpen}
            backdropClickHandler={backdropClickHandler}
          />

          <div className="content-wrapper width-75">
            <Switch>
              <PublicRoute exact path={DONATION_URL} component={Donation} />
              <PublicRoute
                exact
                path={CATEGORIES_URL}
                component={CategoryList}
              />
              <PublicRoute exact path={GRADE_URL} component={Grade} />
              <PublicRoute exact path={COURSE_URL} component={Course} />
              <PublicRoute exact path={CATEGORY_URL} component={Category} />
              <PublicRoute exact path={SEARCH_URL} component={SearchResult} />
              <PublicRoute exact path={HOME_URL} component={Home} />
              <PrivateRoute
                exact
                path={USER_DASHBOARD_URL}
                component={UserDashboard}
              />
              <PrivateRoute
                exact
                path={USER_ACCOUNT_SETTING_URL}
                component={AccountSetting}
              />
              <PrivateRoute
                exact
                path={USER_PROFILE_SETTING_URL}
                component={ProfileSetting}
              />
              <PrivateRoute
                exact
                path={USER_PHOTO_SETTING_URL}
                component={UserPhotoSetting}
              />
              <PrivateRoute
                exact
                path={USER_COURSES_URL}
                component={UserCourse}
              />
              <PublicRoute
                path={OAUTH2_REDIRECT_URL}
                component={OAuth2RedirectHandler}
              />
              <PrivateRoute
                role={RoleType.ADMIN}
                exact
                path={ADMIN_PANEL_URL}
                component={AdminDashboard}
              />
              <PrivateRoute
                role={RoleType.ADMIN}
                exact
                path={ADMIN_CATEGORIES_URL}
                component={AdminCategoryList}
              />
              <PrivateRoute
                role={RoleType.ADMIN}
                exact
                path={ADMIN_CATEGORY_URL}
                component={AdminCategory}
              />
              <PrivateRoute
                role={RoleType.ADMIN}
                exact
                path={ADMIN_GRADES_URL}
                component={AdminGrade}
              />
              <PrivateRoute
                role={RoleType.ADMIN}
                exact
                path={ADMIN_COURSES_URL}
                component={AdminCourse}
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
