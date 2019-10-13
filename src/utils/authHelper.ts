import { CookiesService } from "../services/CookiesService";
import JwtDecode from "jwt-decode";
import { IToken } from "../settings/DataTypes";

export const isLoggedIn = () => {
  let accessToken = getToken();
  return accessToken !==undefined && !isTokenExpired(accessToken);
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = JwtDecode<IToken>(token);
    if (decoded.exp < new Date().getTime() / 1000) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return true;
  }
};

export const getToken = () => {
  let cookiesService = new CookiesService();
  return cookiesService.get("accessToken");
};

export const getTokenExpirationDate = (token: string) => {
  try {
    const decoded = JwtDecode<IToken>(token);
    return new Date(decoded.exp * 1000);
  } catch (e) {
    return new Date();
  }
};
