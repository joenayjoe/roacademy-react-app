import axios, {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  CancelTokenSource
} from "axios";
import { CookieService } from "./CookieService";

class ApiRequest {
  private axiosInstance: AxiosInstance;
  private cookiesService: CookieService;
  private source: CancelTokenSource | null;

  constructor() {
    const config = { baseURL: "http://192.168.1.61:8080/api" };
    this.axiosInstance = axios.create(config);

    this.cookiesService = new CookieService();
    this.source = null;
  }

  get<TResponse>(url: string): AxiosPromise<TResponse> {
    if (this.source) {
      this.source.cancel("Only one request at a time");
    }
    this.source = axios.CancelToken.source();
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
    if (this.source) {
      return { headers: headers, cancelToken: this.source.token };
    } else {
      return { headers: headers };
    }
  }
}

export default ApiRequest;
