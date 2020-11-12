import React, { useState } from "react";
import Navbar from "../components/navbar/Navbar";

import { BrowserRouter, Switch } from "react-router-dom";
import Donation from "../pages/donation/Donation";
import Home from "../pages/home/Home";

import SideDrawer from "../components/sidedrawer/SideDrawer";
import Category from "../pages/category/Category";
import Grade from "../pages/grade/Grade";
import Course from "../pages/course/Course";
import SearchResult from "../pages/searchresult/SearchResult";
import PublicRoute from "../pages/route/PublicRoute";
import PrivateRoute from "../pages/route/PrivateRoute";
import PageNotFound from "../pages/route/PageNotFound";
import Footer from "../components/footer/Footer";
import UserDashboard from "../pages/user/UserDashboard";
import AuthContextProvider from "../contexts/AuthContext";
import ProfileSetting from "../pages/user/ProfileSetting";
import UserCourse from "../pages/user/UserCourses";
import AccountSetting from "../pages/user/AccountSetting";
import UserPhotoSetting from "../pages/user/UserPhotoSetting";
import OAuth2RedirectHandler from "../pages/oauth2redirect/OAuth2RedirectHandler";
import CategoryList from "../pages/category/CategoryList";
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
  ADMIN_CATEGORY_URL,
  ADMIN_GRADE_URL,
  ADMIN_USERS_URL,
  ADMIN_NEW_COURSE_URL,
  ADMIN_COURSE_URL,
  ADMIN_USER_URL,
  ADMIN_EDIT_COURSE_URL,
  COURSE_WATCH_URL,
  TEACHER_REQUEST_URL,
  ADMIN_USER_EDIT_URL,
  ADMIN_OAUTH2_CONFIG_URL,
  TEACHER_DASHBOARD_URL,
  TEACHER_NEW_COURSE_URL,
  TEACHER_COURSE_URL,
  TEACHER_EDIT_COURSE_URL,
  PUBLIC_USER_PROFILE_URL,
} from "../settings/Constants";
import AdminGradeList from "../pages/adminpanel/grade/AdminGradeList";
import AdminCategoryList from "../pages/adminpanel/category/AdminCategoryList";
import AdminCategory from "../pages/adminpanel/category/AdminCategory";
import AdminGrade from "../pages/adminpanel/grade/AdminGrade";
import AdminCourseList from "../pages/adminpanel/course/AdminCourseList";
import AdminUserList from "../pages/adminpanel/user/AdminUserList";
import NewCourse from "../pages/adminpanel/course/NewCourse";
import AdminCourse from "../pages/adminpanel/course/AdminCourse";
import AdminUser from "../pages/adminpanel/user/AdminUser";
import EditCourse from "../pages/adminpanel/course/EditCourse";
import AlertContextProvider from "../contexts/AlertContext";
import AlertSelector from "../components/flash/AlertSelector";
import CoursePlayer from "../pages/player/CoursePlayer";
import TeacherRequest from "../pages/user/TeacherRequest";
import AdminUserEdit from "../pages/adminpanel/user/AdminUserEdit";
import { isMobileOnly } from "react-device-detect";
import AdminOAuth2Config from "../pages/adminpanel/admin_oauth2_config/AdminOAuth2Config";
import TeacherDashboard from "../pages/teacher/TeacherDashboard";
import TeacherNewCourse from "../pages/teacher/TeacherNewCourse";
import TeacherCourse from "../pages/teacher/TeacherCourse";
import TeacherEditCourse from "../pages/teacher/TeacherEditCourse";
import PublicProfile from "../pages/user/PublicProfile";

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
      <AlertContextProvider>
        <BrowserRouter>
          <Navbar drawerToggleHandler={handleDrawerToggle} />
          {isMobileOnly ? (
            <SideDrawer
              isOpen={isSideDrawerOpen}
              backdropClickHandler={backdropClickHandler}
            />
          ) : null}
          <div className="content-wrapper">
            <AlertSelector />
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
              <PublicRoute
                exact
                path={COURSE_WATCH_URL}
                component={CoursePlayer}
              />
              <PublicRoute
                path={OAUTH2_REDIRECT_URL}
                component={OAuth2RedirectHandler}
              />
              <PublicRoute
                exact
                path={PUBLIC_USER_PROFILE_URL}
                component={PublicProfile}
              />

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
              <PrivateRoute
                exact
                path={TEACHER_REQUEST_URL}
                component={TeacherRequest}
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
                component={AdminGradeList}
              />
              <PrivateRoute
                role={RoleType.ADMIN}
                exact
                path={ADMIN_GRADE_URL}
                component={AdminGrade}
              />
              <PrivateRoute
                role={RoleType.ADMIN}
                exact
                path={ADMIN_COURSES_URL}
                component={AdminCourseList}
              />
              <PrivateRoute
                role={RoleType.ADMIN}
                exact
                path={ADMIN_NEW_COURSE_URL}
                component={NewCourse}
              />
              <PrivateRoute
                role={RoleType.ADMIN}
                exact
                path={ADMIN_COURSE_URL}
                component={AdminCourse}
              />

              <PrivateRoute
                role={RoleType.ADMIN}
                exact
                path={ADMIN_EDIT_COURSE_URL}
                component={EditCourse}
              />

              <PrivateRoute
                role={RoleType.ADMIN}
                exact
                path={ADMIN_USERS_URL}
                component={AdminUserList}
              />
              <PrivateRoute
                role={RoleType.ADMIN}
                exact
                path={ADMIN_USER_URL}
                component={AdminUser}
              />
              <PrivateRoute
                role={RoleType.ADMIN}
                exact
                path={ADMIN_USER_EDIT_URL}
                component={AdminUserEdit}
              />
              <PrivateRoute
                role={RoleType.ADMIN}
                exact
                path={ADMIN_OAUTH2_CONFIG_URL}
                component={AdminOAuth2Config}
              />

              <PrivateRoute
                role={RoleType.TEACHER}
                exact
                path={TEACHER_DASHBOARD_URL}
                component={TeacherDashboard}
              />
              <PrivateRoute
                role={RoleType.TEACHER}
                exact
                path={TEACHER_COURSE_URL}
                component={TeacherCourse}
              ></PrivateRoute>
              <PrivateRoute
                role={RoleType.TEACHER}
                exact
                path={TEACHER_NEW_COURSE_URL}
                component={TeacherNewCourse}
              ></PrivateRoute>
              <PrivateRoute
                role={RoleType.TEACHER}
                exact
                path={TEACHER_EDIT_COURSE_URL}
                component={TeacherEditCourse}
              ></PrivateRoute>
              <PublicRoute component={PageNotFound} />
            </Switch>
          </div>
          <Footer />
        </BrowserRouter>
      </AlertContextProvider>
    </AuthContextProvider>
  );
};

export default App;
