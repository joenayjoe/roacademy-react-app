import { AxiosResponse } from "axios";

import { ICourse, ISearchRequest } from "../datatypes/types";
import ApiRequest from "./ApiRequest";

interface ICourseService {
  getCourse(courseId: string): Promise<AxiosResponse<ICourse>>;
  getAutoSuggestForCourse(
    query: ISearchRequest
  ): Promise<AxiosResponse<ICourse[]>>;
}

export class CourseService implements ICourseService {
  private apiRequest = new ApiRequest();
  public async getCourse(courseId: string): Promise<AxiosResponse<ICourse>> {
    const url = "/courses/" + courseId;
    return await this.apiRequest.get(url);
  }

  public async getAutoSuggestForCourse(
    query: ISearchRequest
  ): Promise<AxiosResponse<ICourse[]>> {
    const url = "/search";
    return await this.apiRequest.post<ISearchRequest, ICourse[]>(url, query);
  }
}
