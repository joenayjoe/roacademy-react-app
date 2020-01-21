import { AxiosResponse } from "axios";

import {
  ICourse,
  ISearchRequest,
  INewCourse,
  HTTPStatus,
  CourseStatus,
  Page,
  IEditCourse
} from "../settings/DataTypes";
import ApiRequest from "./ApiRequest";
import { DEFAULT_SORTING } from "../settings/Constants";

export class CourseService {
  private apiRequest = new ApiRequest();
  private baseUrl = "/courses";

  public async getCourses(
    page: number,
    size: number,
    order = DEFAULT_SORTING
  ): Promise<AxiosResponse<Page<ICourse>>> {
    const url =
      this.baseUrl + "?page=" + page + "&size=" + size + "&order=" + order;
    return await this.apiRequest.get(url);
  }

  public async getCoursesByCategoryId(
    categoryId: string,
    status?: CourseStatus[],
    order = DEFAULT_SORTING
  ): Promise<AxiosResponse<ICourse[]>> {
    const st = status ? status : CourseStatus.PUBLISHED;
    const url = `/courses?category_id=${categoryId}&status=${st}&order=${order}`;
    return await this.apiRequest.get<ICourse[]>(url);
  }

  public async getCoursesByGradeId(
    gradeId: number,
    status?: CourseStatus[],
    order = DEFAULT_SORTING
  ): Promise<AxiosResponse<ICourse[]>> {
    const st = status ? status : CourseStatus.PUBLISHED;
    const url = `/courses?grade_id=${gradeId}&status=${st}&order=${order}`;
    return await this.apiRequest.get<ICourse[]>(url);
  }

  public async getCourse(courseId: number): Promise<AxiosResponse<ICourse>> {
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

  public async updateCourse(
    data: IEditCourse
  ): Promise<AxiosResponse<ICourse>> {
    const url = this.baseUrl + "/" + data.id;
    return await this.apiRequest.put<IEditCourse, ICourse>(url, data);
  }

  public async deleteCourse(
    courseId: string
  ): Promise<AxiosResponse<HTTPStatus>> {
    const url = this.baseUrl + "/" + courseId;
    return await this.apiRequest.delete(url);
  }
}
