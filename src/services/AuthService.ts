import ApiRequest from "./ApiRequest";
import { AxiosResponse } from "axios";
import {
  IUser,
  ILoginRequest,
  ILoginResponse,
  IToken,
  ISignupRequest,
  ISocialLoginRequest
} from "../settings/DataTypes";
import { CookieService } from "./CookieService";
import JwtDecode from "jwt-decode";
import {
  LOGGED_IN_USER_COOKIES_NAME,
  ACCESS_TOKEN_COOKIE_NAME,
  COOKIE_PATH
} from "../settings/Constants";

class AuthService {
  private apiRequest: ApiRequest;
  private cookiesService: CookieService;

  constructor() {
    this.apiRequest = new ApiRequest();
    this.cookiesService = new CookieService();
  }
  public async getCurrentUser(): Promise<AxiosResponse<IUser>> {
    const url = "/users/currentUser";
    return await this.apiRequest.get<IUser>(url);
  }

  public getLastAuthUserFromCookies() {
    return this.cookiesService.get(LOGGED_IN_USER_COOKIES_NAME);
  }

  public async login(
    loginData: ILoginRequest
  ): Promise<AxiosResponse<ILoginResponse>> {
    return await this.apiRequest.post<ILoginRequest, ILoginResponse>(
      "/auth/signin",
      loginData
    );
  }

  public async facebookLogin(
    data: ISocialLoginRequest
  ): Promise<AxiosResponse<ILoginResponse>> {
    return await this.apiRequest.post<ISocialLoginRequest, ILoginResponse>(
      "/facebookLogin",
      data
    );
  }

  public async signup(signupData: ISignupRequest): Promise<AxiosResponse<any>> {
    return await this.apiRequest.post<any, any>("/auth/signup", signupData);
  }

  // helper methds

  public setAccessTokenCookie(token: string) {
    this.cookiesService.set(ACCESS_TOKEN_COOKIE_NAME, token, {
      path: COOKIE_PATH,
      expires: this.getTokenExpirationDate(token)
    });
  }

  public setLoggedInUserCookie(user: IUser): void {
    this.cookiesService.set(LOGGED_IN_USER_COOKIES_NAME, user, {
      path: COOKIE_PATH,
      expires: this.getTokenExpirationDate(this.getToken())
    });
  }

  public logout(): void {
    this.cookiesService.remove(ACCESS_TOKEN_COOKIE_NAME, {
      path: COOKIE_PATH
    });
    this.cookiesService.remove(LOGGED_IN_USER_COOKIES_NAME, {
      path: COOKIE_PATH
    });
  }

  public isLoggedIn(): boolean {
    let accessToken = this.getToken();
    return accessToken !== undefined && !this.isTokenExpired(accessToken);
  }

  public getUserFullName(user: IUser | null): string {
    if (user) {
      return user.firstName + " " + user.lastName;
    }
    return "";
  }

  public getUserNameInitials(user: IUser | null): string {
    if (user) {
      return user.firstName[0] + user.lastName[0];
    }
    return "";
  }

  public getUserEmail(user: IUser | null): string {
    if (user) {
      return user.email;
    }
    return "";
  }

  // private methods

  private getTokenExpirationDate(token: string): Date {
    try {
      const decoded = JwtDecode<IToken>(token);
      return new Date(decoded.exp * 1000);
    } catch (e) {
      return new Date();
    }
  }

  private getToken(): string {
    let cookiesService = new CookieService();
    return cookiesService.get(ACCESS_TOKEN_COOKIE_NAME);
  }

  private isTokenExpired(token: string): boolean {
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
  }
}
export default AuthService;
