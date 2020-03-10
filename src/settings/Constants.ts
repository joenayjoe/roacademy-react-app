import { CourseStatus } from "./DataTypes";

export const DOMAIN = "http://localhost"; //"http://192.168.1.131";

export const API_PORT = ":8080";
export const FRONT_END_PORT = ":3000";

export const API_BASE_URL = DOMAIN + API_PORT;
export const FRONT_END_BASE_URL = DOMAIN + FRONT_END_PORT;

export const ACCESS_TOKEN_COOKIE_NAME = "accessToken";
export const LOGGED_IN_USER_COOKIES_NAME = "lastAuthUserInfo";
export const COOKIE_PATH = "/";

export const OAUTH2_REDIRECT_URL = "/oauth2/redirect";
export const OAUTH2_REDIRECT_FULL_URL = FRONT_END_BASE_URL + "/oauth2/redirect";

export const FACEBOOK_AUTH_URL =
  API_BASE_URL +
  "/oauth2/authorize/facebook?redirect_uri=" +
  OAUTH2_REDIRECT_FULL_URL;

export const GOOGLE_AUTH_URL =
  API_BASE_URL +
  "/oauth2/authorize/google?redirect_uri=" +
  OAUTH2_REDIRECT_FULL_URL;

export const HOME_URL = "/";

// Admin Manage URLs
export const ADMIN_PANEL_URL = "/admin";
export const ADMIN_DASHBOARD_URL = "/admin/dashboard";
export const ADMIN_CATEGORIES_URL = "/admin/categories";
export const ADMIN_CATEGORY_URL = "/admin/categories/:category_id";
export const BUILD_ADMIN_CATEGORY_URL = (id: number) =>
  ADMIN_CATEGORY_URL.replace(":category_id", id.toString());
export const ADMIN_GRADES_URL = "/admin/grades";
export const ADMIN_GRADE_URL = "/admin/grades/:grade_id";
export const BUILD_ADMIN_GRADE_URL = (grade_id: number) =>
  ADMIN_GRADE_URL.replace(":grade_id", grade_id.toString());
export const ADMIN_COURSES_URL = "/admin/courses";
export const ADMIN_NEW_COURSE_URL = "/admin/courses/new";
export const ADMIN_COURSE_URL = ADMIN_COURSES_URL + "/:course_id";
export const BUILD_ADMIN_COURSE_URL = (courseId: number) =>
  ADMIN_COURSE_URL.replace(":course_id", courseId.toString());
export const ADMIN_EDIT_COURSE_URL = ADMIN_COURSES_URL + "/:course_id/edit";
export const BUILD_ADMIN_EDIT_COURSE_URL = (course_id: number) =>
  ADMIN_EDIT_COURSE_URL.replace(":course_id", course_id.toString());

export const ADMIN_USERS_URL = "/admin/users";
export const ADMIN_USER_URL = ADMIN_USERS_URL + "/:user_id";
export const BUILD_ADMIN_USER_URL = (user_id: number) =>
  ADMIN_USER_URL.replace(":user_id", user_id.toString());
export const ADMIN_USER_EDIT_URL = ADMIN_USER_URL + "/edit";
export const BUILD_ADMIN_USER_EDIT_URL = (userId: number) =>
  ADMIN_USER_EDIT_URL.replace(":user_id", userId.toString());

export const ADMIN_YOUTUBE_LINK = "/admin/youtube";

// Login User URLs

export const USER_DASHBOARD_URL = "/dashboard";
export const USER_ACCOUNT_SETTING_URL = "/user/account-settings";
export const USER_PROFILE_SETTING_URL = "/user/profile-settings";
export const USER_PHOTO_SETTING_URL = "/user/photo-settings";
export const USER_COURSES_URL = "/user-courses";

// Global URLs
export const CATEGORIES_URL = "/categories";
export const CATEGORY_URL = "/categories/:category_id";
export const BUILD_CATEGORY_URL = (categoryId: number) =>
  CATEGORY_URL.replace(":category_id", categoryId.toString());

export const GRADE_URL = "/grades/:grade_id";

export const BUILD_GRADE_URL = (grade_id: number) =>
  GRADE_URL.replace(":grade_id", grade_id.toString());

export const COURSE_URL = "/courses/:course_id";
export const BUILD_COURSE_URL = (course_id: number) =>
  COURSE_URL.replace(":course_id", course_id.toString());

export const COURSE_WATCH_URL = "/watch";
export const BUILD_COURSE_WATCH_URL = (
  courseId: number,
  chapterId?: number,
  lectureId?: number
) => {
  let url = COURSE_WATCH_URL + "?course_id=" + courseId;
  if (chapterId && lectureId) {
    url += "&chapter_id=" + chapterId + "&lecture_id=" + lectureId;
  }
  return url;
};

export const SEARCH_URL = "/search";
export const BUILD_SEARCH_WITH_QUERY_URL = (query: string) =>
  SEARCH_URL + "?query=" + query;

export const DONATION_URL = "/donation";

export const TEACHER_REQUEST_URL = "/teacher-request";

// default value constants
export const PAGE_SIZE = 15;
export const DEFAULT_SORTING_FIELD = "id";
export const DEFAULT_SORTING_ORDER = "desc";
export const DEFAULT_SORTING =
  DEFAULT_SORTING_FIELD + "_" + DEFAULT_SORTING_ORDER;
export const DEFAULT_COURSE_STATUS = [CourseStatus.PUBLISHED];
export const ADMIN_COURSE_STATUS = [
  CourseStatus.PENDING,
  CourseStatus.PUBLISHED,
  CourseStatus.DRAFT
];
