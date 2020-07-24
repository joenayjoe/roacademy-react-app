import axios, {
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  CancelTokenSource,
} from "axios";
import { CookieService } from "./CookieService";
import { API_DOMAIN } from "../settings/Constants";

class ApiRequest {
  private axiosInstance: AxiosInstance;
  private cookiesService: CookieService;

  constructor() {
    const config = { baseURL: API_DOMAIN+"/api" };
    this.axiosInstance = axios.create(config);

    this.cookiesService = new CookieService();
  }

  get<TResponse>(
    url: string,
    source?: CancelTokenSource
  ): AxiosPromise<TResponse> {
    return this.axiosInstance.get(url, this.axiosConfig(source));
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

  private axiosConfig(source?: CancelTokenSource): AxiosRequestConfig {
    let accessToken = this.cookiesService.get("accessToken");
    let headers = {};

    if (accessToken !== undefined) {
      headers = { Authorization: `Bearer ${accessToken}` };
    }
    if (source) {
      return { headers: headers, cancelToken: source.token };
    } else {
      return { headers: headers };
    }
  }
}

export default ApiRequest;
