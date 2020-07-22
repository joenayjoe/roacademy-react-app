import Axios, { AxiosResponse, CancelTokenSource } from "axios";

import {
  ICourse,
  HTTPStatus,
  Page,
  ICourseStatusUpdateRequest,
  ISearchResponse,
  CourseStatus,
} from "../settings/DataTypes";
import ApiRequest from "./ApiRequest";
import {
  DEFAULT_SORTING,
  DEFAULT_COURSE_STATUS,
  PAGE_SIZE,
} from "../settings/Constants";

export class CourseService {
  private apiRequest = new ApiRequest();
  private baseUrl = "/courses";
  private source: CancelTokenSource | null = null;

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
    query: string,
    page: number,
    size: number,
    order = DEFAULT_SORTING,
    status = DEFAULT_COURSE_STATUS
  ): Promise<AxiosResponse<Page<ISearchResponse>>> {
    if (this.source) {
      this.source.cancel("Only one request at a time");
    }

    this.source = Axios.CancelToken.source();
    const url = `/search?query=${query}&page=${page}&size=${size}&order=${order}&status=${status}`;
    return await this.apiRequest.get<Page<ISearchResponse>>(url, this.source);
  }

  public async searchCoursesByKeyword(
    kw: string,
    page: number,
    size: number,
    order = DEFAULT_SORTING,
    status = DEFAULT_COURSE_STATUS
  ): Promise<AxiosResponse<Page<ICourse>>> {
    const url = `/courses/search?kw=${kw}&page=${page}&size=${size}&order=${order}&status=${status}`;
    return await this.apiRequest.get<Page<ICourse>>(url);
  }

  public async createCourse(data: FormData): Promise<AxiosResponse<ICourse>> {
    const url = this.baseUrl;
    return await this.apiRequest.post<FormData, ICourse>(url, data);
  }

  public async updateCourse(
    courseId: number,
    data: FormData
  ): Promise<AxiosResponse<ICourse>> {
    const url = this.baseUrl + "/" + courseId;
    return await this.apiRequest.put<FormData, ICourse>(url, data);
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

  public async getCoursesByTeacher(
    userId: number,
    page: number,
    size: number,
    status: CourseStatus[],
    order = DEFAULT_SORTING
  ): Promise<AxiosResponse<Page<ICourse>>> {
    const url = `/teachers/${userId}/courses?page=${page}&size=${size}&status=${status}&order=${order}`;
    return await this.apiRequest.get<Page<ICourse>>(url);
  }

  public async deleteCourse(
    courseId: string
  ): Promise<AxiosResponse<HTTPStatus>> {
    const url = this.baseUrl + "/" + courseId;
    return await this.apiRequest.delete(url);
  }
}
