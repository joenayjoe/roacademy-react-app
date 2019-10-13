import ApiRequest from "./ApiRequest";
import { AxiosResponse } from "axios";
import { IUser, ILoginRequest, ILoginResponse } from "../settings/DataTypes";

export class UserService {
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
