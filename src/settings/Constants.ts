export const DOMAIN = "http://localhost"; //"http://192.168.1.62";

export const API_PORT = ":8080";
export const FRONT_END_PORT = ":3000";

export const API_BASE_URL = DOMAIN + API_PORT;
export const FRONT_END_BASE_URL = DOMAIN + FRONT_END_PORT;

export const ACCESS_TOKEN_COOKIE_NAME = "accessToken";
export const LOGGED_IN_USER_COOKIES_NAME = "lastAuthUserInfo";
export const COOKIE_PATH = "/";

export const OAUTH2_REDIRECT_URL = FRONT_END_BASE_URL + "/oauth2/redirect";

export const FACEBOOK_AUTH_URL =
  API_BASE_URL +
  "/oauth2/authorize/facebook?redirect_uri=" +
  OAUTH2_REDIRECT_URL;

export const GOOGLE_AUTH_URL =
  API_BASE_URL + "/oauth2/authorize/google?redirect_uri=" + OAUTH2_REDIRECT_URL;
