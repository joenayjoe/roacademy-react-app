import ApiRequest from "./ApiRequest";
import { AxiosResponse } from "axios";
import {
  IUser,
  ILoginRequest,
  ILoginResponse,
  IToken,
  ISignupRequest
} from "../settings/DataTypes";
import { CookiesService } from "./CookiesService";
import JwtDecode from "jwt-decode";
import { ContextType } from "react";
import { AuthContext } from "../contexts/AuthContext";

class AuthService {
  private apiRequest: ApiRequest;
  private cookiesService: CookiesService;
  private TOKEN_COOKIES_NAME = "accessToken";
  private TOKEN_TYPE_COOKIES_NAME = "tokenType";
  private AUTH_USER_COOKIES_NAME = "lastAuthUserInfo";
  private COOKIE_PATH = "/";

  constructor() {
    this.apiRequest = new ApiRequest();
    this.cookiesService = new CookiesService();
  }
  public async getCurrentUser(): Promise<AxiosResponse<IUser>> {
    const url = "/users/currentUser";
    return await this.apiRequest.get<IUser>(url);
  }

  public getLastAuthUserFromCookies() {
    return this.cookiesService.get(this.AUTH_USER_COOKIES_NAME);
  }

  public async login(
    loginData: ILoginRequest
  ): Promise<AxiosResponse<ILoginResponse>> {
    return await this.apiRequest.post<ILoginRequest, ILoginResponse>(
      "/auth/signin",
      loginData
    );
  }

  public async signup(signupData: ISignupRequest): Promise<AxiosResponse<any>> {
    return await this.apiRequest.post<any, any>("/auth/signup", signupData);
  }

  public async uploadProfilePhoto(
    photo: FormData,
    userId: number
  ): Promise<AxiosResponse<IUser>> {
    let url = "/users/" + userId + "/update_photo";
    return await this.apiRequest.post<any, IUser>(url, photo);
  }
  public setAuthCookies(token: string, tokenType: string) {
    this.cookiesService.set(this.TOKEN_COOKIES_NAME, token, {
      path: this.COOKIE_PATH,
      expires: this.getTokenExpirationDate(token)
    });

    this.cookiesService.set(this.TOKEN_TYPE_COOKIES_NAME, tokenType, {
      path: this.COOKIE_PATH,
      expires: this.getTokenExpirationDate(token)
    });
  }

  public setAuthUserCookies(user: IUser): void {
    this.cookiesService.set(this.AUTH_USER_COOKIES_NAME, user, {
      path: this.COOKIE_PATH,
      expires: this.getTokenExpirationDate(this.getToken())
    });
  }

  public logout(): void {
    console.log("auth service remove cookies started");
    this.cookiesService.remove(this.TOKEN_COOKIES_NAME, {
      path: this.COOKIE_PATH
    });
    this.cookiesService.remove(this.TOKEN_TYPE_COOKIES_NAME, {
      path: this.COOKIE_PATH
    });
    this.cookiesService.remove(this.AUTH_USER_COOKIES_NAME, {
      path: this.COOKIE_PATH
    });
    console.log("auth service remove cookies end");
  }

  public isLoggedIn(): boolean {
    let accessToken = this.getToken();
    return accessToken !== undefined && !this.isTokenExpired(accessToken);
  }

  public getUserFullName(context: ContextType<typeof AuthContext>): string {
    if (context && context.currentUser) {
      return context.currentUser.firstName + " " + context.currentUser.lastName;
    }
    return "";
  }

  public getUserNameInitials(context: ContextType<typeof AuthContext>): string {
    if (context && context.currentUser) {
      return context.currentUser.firstName[0] + context.currentUser.lastName[0];
    }
    return "";
  }

  public getUserEmail(context: ContextType<typeof AuthContext>): string {
    if (context && context.currentUser) {
      return context.currentUser.email;
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
    let cookiesService = new CookiesService();
    return cookiesService.get(this.TOKEN_COOKIES_NAME);
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
