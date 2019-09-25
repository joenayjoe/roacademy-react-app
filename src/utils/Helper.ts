import { CookiesService } from "../services/CookiesService";

export const parseError = (error: any): string[] => {
  let errorMessages: string[] = [];
  let errorResponse = error.response.data;
  if (errorResponse.errors) {
    for (let [, value] of Object.entries(errorResponse.errors)) {
      let val: any = value;
      errorMessages.push(val[0]["message"]);
    }
  } else {
    errorMessages.push(errorResponse.detail);
  }
  return errorMessages;
};

export const parseQueryParams = (query: any) => {
  query = query.substring(1);
  let params = query.split("&");
  let paramMap: any = {};
  for (let i of params) {
    let j = i.split("=");
    let k: string = j[0];
    let v: any = j[1];
    paramMap[k] = v;
  }
  return paramMap;
};

export const isLoggedIn = () => {
  let cookiesService = new CookiesService();
  let accessToken = cookiesService.get("accessToken");
  return accessToken !== undefined;
};
