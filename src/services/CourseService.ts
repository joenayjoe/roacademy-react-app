import { AxiosResponse } from "axios";

import {
  ICourse,
  ISearchRequest,
  INewCourse,
  HTTPStatus,
  Page,
  IEditCourse,
  ICourseStatusUpdateRequest
} from "../settings/DataTypes";
import ApiRequest from "./ApiRequest";
import {
  DEFAULT_SORTING,
  DEFAULT_COURSE_STATUS,
  PAGE_SIZE
} from "../settings/Constants";

export class CourseService {
  private apiRequest = new ApiRequest();
  private baseUrl = "/courses";

  public async getCourses(
    page: number,
    size = PAGE_SIZE,
    status = DEFAULT_COURSE_STATUS,
    order = DEFAULT_SORTING
  ): Promise<AxiosResponse<Page<ICourse>>> {
    const url =
      this.baseUrl +
      "?page=" +
      page +
      "&size=" +
      size +
      "&status=" +
      status +
      "&order=" +
      order;
    return await this.apiRequest.get(url);
  }

  public async getCoursesByCategoryId(
    categoryId: number,
    page: number,
    size = PAGE_SIZE,
    status = DEFAULT_COURSE_STATUS,
    order = DEFAULT_SORTING
  ): Promise<AxiosResponse<Page<ICourse>>> {
    const url = `/courses?category_id=${categoryId}&page=${page}&size=${size}&status=${status}&order=${order}`;
    return await this.apiRequest.get<Page<ICourse>>(url);
  }

  public async getCoursesByGradeId(
    gradeId: number,
    page: number,
    size = PAGE_SIZE,
    status = DEFAULT_COURSE_STATUS,
    order = DEFAULT_SORTING
  ): Promise<AxiosResponse<Page<ICourse>>> {
    const url = `/courses?grade_id=${gradeId}&page=${page}&size=${size}&status=${status}&order=${order}`;
    return await this.apiRequest.get<Page<ICourse>>(url);
  }

  public async getAllCoursesByGradeId(
    gradeId: number,
    status = DEFAULT_COURSE_STATUS,
    order = DEFAULT_SORTING
  ): Promise<AxiosResponse<ICourse[]>> {
    const url = `/courses?grade_id=${gradeId}&status=${status}&order=${order}&pagination=false`;
    return await this.apiRequest.get<ICourse[]>(url);
  }

  public async getCourse(
    courseId: number,
    status = DEFAULT_COURSE_STATUS
  ): Promise<AxiosResponse<ICourse>> {
    const url = this.baseUrl + "/" + courseId + "?status=" + status;
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

  public async publishCourse(
    courseId: number,
    payload: ICourseStatusUpdateRequest
  ): Promise<AxiosResponse<HTTPStatus>> {
    const url = this.baseUrl + "/" + courseId;
    return await this.apiRequest.post<ICourseStatusUpdateRequest, HTTPStatus>(
      url,
      payload
    );
  }

  public async deleteCourse(
    courseId: string
  ): Promise<AxiosResponse<HTTPStatus>> {
    const url = this.baseUrl + "/" + courseId;
    return await this.apiRequest.delete(url);
  }
}
