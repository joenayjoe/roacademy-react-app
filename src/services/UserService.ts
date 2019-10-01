import ApiRequest from "./ApiRequest";
import { AxiosResponse } from "axios";
import { IUser, ILoginRequest, ILoginResponse } from "../datatypes/types";

interface IUserService {
  getCurrentUser(): Promise<AxiosResponse<IUser>>;
  login(loginData: ILoginRequest): Promise<AxiosResponse<ILoginResponse>>;
}
export class UserService implements IUserService {
  private apiRequest = new ApiRequest();

  public async getCurrentUser(): Promise<AxiosResponse<IUser>> {
    const url = "/users/currentUser";
    return await this.apiRequest.get<IUser>(url);
  }

  public async login(
    loginData: ILoginRequest
  ): Promise<AxiosResponse<ILoginResponse>> {
    return await this.apiRequest.post<ILoginRequest, ILoginResponse>(
      "/auth/signin",
      loginData
    );
  }
}
