import { AxiosResponse } from "axios";

import ApiRequest from "./ApiRequest";
import {
  IUser,
  Page,
  HTTPStatus,
  IUserEditRequest
} from "../settings/DataTypes";
import { DEFAULT_SORTING } from "../settings/Constants";

export class UserService {
  private apiRequest = new ApiRequest();

  public async getUsers(
    page: number,
    size: number,
    sorting = DEFAULT_SORTING
  ): Promise<AxiosResponse<Page<IUser>>> {
    const url = `/users/?page=${page}&size=${size}&order=${sorting}`;
    return await this.apiRequest.get(url);
  }

  public async getUser(userId: number): Promise<AxiosResponse<IUser>> {
    const url = `/users/${userId}`;
    return await this.apiRequest.get(url);
  }

  public async updateUser(
    userId: number,
    userData: IUserEditRequest
  ): Promise<AxiosResponse<IUser>> {
    const url = `/users/${userId}`;
    return await this.apiRequest.post<IUserEditRequest, IUser>(url, userData);
  }

  public async deleteUser(userId: number): Promise<AxiosResponse<HTTPStatus>> {
    const url = `/users/${userId}`;
    return await this.apiRequest.delete(url);
  }
}
export default UserService;
