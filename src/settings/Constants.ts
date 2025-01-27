import { CourseStatus } from "./DataTypes";

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

export const ADMIN_OAUTH2_CONFIG_URL = "/admin/oauth2-config";

// Login User URLs

export const USER_DASHBOARD_URL = "/dashboard";
export const USER_ACCOUNT_SETTING_URL = "/user/account-settings";
export const USER_PROFILE_SETTING_URL = "/user/profile-settings";
export const USER_PHOTO_SETTING_URL = "/user/photo-settings";
export const USER_COURSES_URL = "/user-courses";

// teacher urls
export const TEACHER_DASHBOARD_URL = "/teacher-dashboard";
export const TEACHER_COURSE_URL = "/teachers/:teacher_id/courses/:course_id";
export const TEACHER_NEW_COURSE_URL = "/teacher/courses/new";
export const BUILD_TEACHER_COURSE_URL = (teacherId: number, courseId: number) =>
  TEACHER_COURSE_URL.replace(":teacher_id", teacherId.toString()).replace(
    ":course_id",
    courseId.toString()
  );
export const TEACHER_EDIT_COURSE_URL = TEACHER_COURSE_URL + "/edit";
export const BUILD_TEACHER_EDIT_COURSE_URL = (
  teacherId: number,
  courseId: number
) => BUILD_TEACHER_COURSE_URL(teacherId, courseId) + "/edit";

// Global URLs

export const FRONT_END_DOMAIN = window.location.href;

export const API_DOMAIN = window.location.href.startsWith("http://localhost:")
  ? "http://localhost:8080"
  : "https://roacademy-backend.azurewebsites.net"

export const HOME_URL = "/";
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

export const PUBLIC_USER_PROFILE_URL = "/users/:user_id";

export const BUILD_PUBLIC_USER_PROFILE_URL = (userId: number) =>
  PUBLIC_USER_PROFILE_URL.replace(":user_id", userId.toString());

// OAuth2 URLS

export const OAUTH2_REDIRECT_URL = "/oauth2/redirect";
export const OAUTH2_REDIRECT_FULL_URL = FRONT_END_DOMAIN + "/oauth2/redirect";
export const ADMIN_OAUTH2_REDIRECT_URL =
  FRONT_END_DOMAIN + ADMIN_OAUTH2_CONFIG_URL;

export const FACEBOOK_AUTH_URL =
  API_DOMAIN +
  "/oauth2/authorize/facebook?redirect_uri=" +
  OAUTH2_REDIRECT_FULL_URL;

export const GOOGLE_AUTH_URL =
  API_DOMAIN +
  "/oauth2/authorize/google?redirect_uri=" +
  OAUTH2_REDIRECT_FULL_URL;

export const BOX_AUTH_URL =
  API_DOMAIN +
  "/api/oauth2/authorize/box?redirect_uri=" +
  ADMIN_OAUTH2_REDIRECT_URL;

export const IMGUR_AUTH_URL =
  API_DOMAIN +
  "/api/oauth2/authorize/imgur?redirect_uri=" +
  ADMIN_OAUTH2_REDIRECT_URL;

export const YOUTUBE_AUTH_URL =
  API_DOMAIN +
  "/api/oauth2/authorize/youtube?redirect_uri=" +
  ADMIN_OAUTH2_REDIRECT_URL;

// cookie constants
export const ACCESS_TOKEN_COOKIE_NAME = "accessToken";
export const LOGGED_IN_USER_COOKIES_NAME = "lastAuthUserInfo";
export const COOKIE_PATH = "/";

// default value constants
export const PAGE_SIZE = 10;
export const DEFAULT_SORTING_FIELD = "id";
export const DEFAULT_SORTING_ORDER = "desc";
export const DEFAULT_SORTING =
  DEFAULT_SORTING_FIELD + "_" + DEFAULT_SORTING_ORDER;
export const DEFAULT_COURSE_STATUS = [CourseStatus.PUBLISHED];
export const ADMIN_COURSE_STATUS = [
  CourseStatus.PENDING,
  CourseStatus.PUBLISHED,
  CourseStatus.DRAFT,
];
