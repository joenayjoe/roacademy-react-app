import { AxiosResponse } from "axios";

import { ICourse, ISearchRequest } from "../settings/DataTypes";
import ApiRequest from "./ApiRequest";

export class CourseService {
  private apiRequest = new ApiRequest();

  public async getCoursesByCategoryId(
    categoryId: number
  ): Promise<AxiosResponse<ICourse[]>> {
    const url = "/categories/" + categoryId + "/courses";
    return await this.apiRequest.get(url);
  }

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
