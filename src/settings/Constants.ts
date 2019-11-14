export const API_BASE_URL = "http://localhost:8080";

export const ACCESS_TOKEN_COOKIE_NAME = "accessToken";
export const LOGGED_IN_USER_COOKIES_NAME = "lastAuthUserInfo";
export const COOKIE_PATH = "/";

export const OAUTH2_REDIRECT_URL = "http://localhost:3000/oauth2/redirect";

export const FACEBOOK_AUTH_URL =
  API_BASE_URL +
  "/oauth2/authorize/facebook?redirect_uri=" +
  OAUTH2_REDIRECT_URL;
