import ApiRequest from "./ApiRequest";
import { AxiosResponse } from "axios";
import {
  IGrade,
  IEditGrade,
  HTTPStatus,
  INewGrade,
  Page
} from "../settings/DataTypes";
import { DEFAULT_SORTING } from "../settings/Constants";

export class GradeService {
  private apiRequest = new ApiRequest();

  public async getGrades(
    page: number,
    size: number,
    sorting = DEFAULT_SORTING
  ) {
    const url = `/grades?page=${page}&size=${size}&order=${sorting}`;
    return await this.apiRequest.get<Page<IGrade>>(url);
  }

  public async getGradesByCategoryId(
    categoryId: number,
    sorting = DEFAULT_SORTING
  ) {
    const url = `/grades?category_id=${categoryId}&order=${sorting}`;

    return await this.apiRequest.get<IGrade[]>(url);
  }
  public async getGrade(gradeId: string): Promise<AxiosResponse<IGrade>> {
    const url = `/grades/${gradeId}`;
    return await this.apiRequest.get<IGrade>(url);
  }

  public async getGradeWithCourses(
    gradeId: string
  ): Promise<AxiosResponse<IGrade>> {
    const url = `/grades/${gradeId}?withCourse=true`;
    return await this.apiRequest.get<IGrade>(url);
  }

  public async createGrade(data: INewGrade): Promise<AxiosResponse<IGrade>> {
    const url = "/grades/";
    return await this.apiRequest.post<INewGrade, IGrade>(url, data);
  }

  public async editGrade(
    gradeId: string,
    data: IEditGrade
  ): Promise<AxiosResponse<IGrade>> {
    const url = "/grades/" + gradeId;
    return await this.apiRequest.put<IEditGrade, IGrade>(url, data);
  }

  public async deleteGrade(
    gradeId: string
  ): Promise<AxiosResponse<HTTPStatus>> {
    const url = "/grades/" + gradeId;
    return await this.apiRequest.delete(url);
  }
}
