import { AxiosResponse } from "axios";

import ApiRequest from "./ApiRequest";
import {
  IUser,
  Page,
  HTTPStatus,
  IUserEditRequest,
  IPasswordResetRequest,
  IEmailUpdateRequest,
  IUserProfileUpdateRequest,
  ICourseSubscribeRequest,
  ICourseSubscriptionCheckResponse,
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

  public async updateUserProfilePhoto(
    photo: FormData,
    userId: number
  ): Promise<AxiosResponse<IUser>> {
    let url = "/users/" + userId + "/update_photo";
    return await this.apiRequest.post<any, IUser>(url, photo);
  }

  public async updateProfile(
    userId: number,
    data: IUserProfileUpdateRequest
  ): Promise<AxiosResponse<IUser>> {
    let url = `/users/${userId}/update_profile`;
    return await this.apiRequest.post<IUserProfileUpdateRequest, IUser>(
      url,
      data
    );
  }

  public async updateEmail(
    userId: number,
    data: IEmailUpdateRequest
  ): Promise<AxiosResponse<IUser>> {
    const url = `/users/${userId}/reset_email`;
    return await this.apiRequest.post<IEmailUpdateRequest, IUser>(url, data);
  }
  public async resetPassword(
    userId: number,
    data: IPasswordResetRequest
  ): Promise<AxiosResponse<IUser>> {
    let url = `/users/${userId}/reset_password`;
    return await this.apiRequest.post<IPasswordResetRequest, IUser>(url, data);
  }

  public async subscribeCourse(
    userId: number,
    data: ICourseSubscribeRequest
  ): Promise<AxiosResponse<HTTPStatus>> {
    const url = `/students/${userId}/course_subscription`;
    return await this.apiRequest.put<ICourseSubscribeRequest, HTTPStatus>(
      url,
      data
    );
  }

  public async isSubscribed(
    userId: number,
    courseId: number
  ): Promise<AxiosResponse<ICourseSubscriptionCheckResponse>> {
    const url = `/students/${userId}/courses/${courseId}/is_subscribed`;
    return await this.apiRequest.get<ICourseSubscriptionCheckResponse>(url);
  }

  public async deleteUser(userId: number): Promise<AxiosResponse<HTTPStatus>> {
    const url = `/users/${userId}`;
    return await this.apiRequest.delete(url);
  }
}
export default UserService;
