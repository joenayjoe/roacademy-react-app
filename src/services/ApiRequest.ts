import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from "axios";
import { CookieService } from "./CookieService";

class ApiRequest {
  private axiosInstance: AxiosInstance;
  private cookiesService: CookieService;
  constructor() {
    const config = { baseURL: "http://192.168.1.130:8080/api" };
    this.axiosInstance = axios.create(config);
    this.cookiesService = new CookieService();
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

  patch<TRequest, TResponse>(
    url: string,
    payload: TRequest
  ): AxiosPromise<TResponse> {
    return this.axiosInstance.patch(url, payload, this.axiosConfig());
  }

  delete(url: string): AxiosPromise<any> {
    return this.axiosInstance.delete(url, this.axiosConfig());
  }

  private axiosConfig(): AxiosRequestConfig {
    let accessToken = this.cookiesService.get("accessToken");
    let headers = {};

    if (accessToken !== undefined) {
      headers = { Authorization: `Bearer ${accessToken}` };
    }
    return { headers: headers };
  }
}

export default ApiRequest;
