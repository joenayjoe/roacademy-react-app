import { AxiosResponse } from "axios";

import {
  ICourse,
  ISearchRequest,
  INewCourse,
  HTTPStatus
} from "../settings/DataTypes";
import ApiRequest from "./ApiRequest";

export class CourseService {
  private apiRequest = new ApiRequest();
  private baseUrl = "/courses";
  public async getCourses(order?: string): Promise<AxiosResponse<ICourse[]>> {
    const url = order ? this.baseUrl + "?order=" + order : this.baseUrl;
    return await this.apiRequest.get(url);
  }

  public async getCoursesByCategoryId(
    categoryId: number
  ): Promise<AxiosResponse<ICourse[]>> {
    const url = "/categories/" + categoryId + "/courses";
    return await this.apiRequest.get(url);
  }

  public async getCourse(courseId: string): Promise<AxiosResponse<ICourse>> {
    const url = this.baseUrl + "/" + courseId;
    return await this.apiRequest.get(url);
  }

  public async getAutoSuggestForCourse(
    query: ISearchRequest
  ): Promise<AxiosResponse<ICourse[]>> {
    const url = "/search";
    return await this.apiRequest.post<ISearchRequest, ICourse[]>(url, query);
  }

  public async createCourse(data: INewCourse): Promise<AxiosResponse<ICourse>> {
    const url = this.baseUrl;
    return await this.apiRequest.post<INewCourse, ICourse>(url, data);
  }

  public async deleteCourse(
    courseId: string
  ): Promise<AxiosResponse<HTTPStatus>> {
    const url = this.baseUrl + "/" + courseId;
    return await this.apiRequest.delete(url);
  }
}
