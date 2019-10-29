import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from "axios";
import { CookiesService } from "./CookiesService";

class ApiRequest {
  private axiosInstance: AxiosInstance;
  private cookiesService: CookiesService;
  constructor() {
    const config = { baseURL: "http://192.168.1.62:8080/api"};
    this.axiosInstance = axios.create(config);
    this.cookiesService = new CookiesService();
  }

  get<TResponse>(url: string): AxiosPromise<TResponse> {
    return this.axiosInstance.get(url, this.axiosConfig());
  }

  post<TRequest, TResponse>(
    url: string,
    payload: TRequest
  ): AxiosPromise<TResponse> {
    return this.axiosInstance.post(url, payload, this.axiosConfig());
  }

  put<TRequest, TResponse>(
    url: string,
    payload: TRequest
  ): AxiosPromise<TResponse> {
    return this.axiosInstance.put(url, payload, this.axiosConfig());
  }

  delete(url: string): AxiosPromise<any> {
    return this.axiosInstance.delete(url, this.axiosConfig());
  }

  private axiosConfig(): AxiosRequestConfig {

    let accessToken = this.cookiesService.get("accessToken");
    let tokenType = this.cookiesService.get("tokenType");
    let headers = {};

    if (accessToken !== undefined && accessToken !== undefined) {
      headers = { Authorization: `${tokenType} ${accessToken}` };
    }
    return {headers: headers};
  }
}

export default ApiRequest;
