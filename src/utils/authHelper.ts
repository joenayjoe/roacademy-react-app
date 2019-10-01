import { CookiesService } from "../services/CookiesService";

export const isLoggedIn = () => {
  let cookiesService = new CookiesService();
  let accessToken = cookiesService.get("accessToken");
  return accessToken !== undefined;
};
