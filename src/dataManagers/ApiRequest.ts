import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from "axios";
import Cookies from "universal-cookie";

class ApiRequest {
  private axiosInstance: AxiosInstance;
  constructor() {
    const config = { baseURL: "http://192.168.1.151:8080/api"};
    this.axiosInstance = axios.create(config);
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
    let cookies = new Cookies();
    let accessToken = cookies.get("accessToken");
    let tokenType = cookies.get("tokenType");
    let headers = {};

    if (accessToken !== undefined || accessToken != null) {
      headers = { Authorization: `${tokenType} ${accessToken}` };
    }
    return {headers: headers};
  }
}

export default ApiRequest;
