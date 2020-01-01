import ApiRequest from "./ApiRequest";
import { AxiosResponse } from "axios";
import {
  IGrade,
  ICourse,
  IEditGrade,
  HTTPStatus,
  INewGrade
} from "../settings/DataTypes";

export class GradeService {
  private apiRequest = new ApiRequest();

  public async getGrade(
    categoryId: string,
    gradeId: string
  ): Promise<AxiosResponse<IGrade>> {
    const url = `/categories/${categoryId}/grades/${gradeId}`;
    return await this.apiRequest.get<IGrade>(url);
  }

  public async getGradeWithCourses(
    categoryId: string,
    gradeId: string
  ): Promise<AxiosResponse<IGrade>> {
    const url = `/categories/${categoryId}/grades/${gradeId}?withCourse=true`;
    return await this.apiRequest.get<IGrade>(url);
  }

  public async getGradesForCategory(categoryId: number, sorting?: string) {
    const url = sorting
      ? `/categories/${categoryId}/grades?order=${sorting}`
      : `/categories/${categoryId}/grades`;
    return await this.apiRequest.get<IGrade[]>(url);
  }

  public async getCoursesForGrade(
    categoryId: number,
    gradeId: number
  ): Promise<AxiosResponse<ICourse[]>> {
    const url = `/categories/${categoryId}/grades/${gradeId}/courses`;
    return await this.apiRequest.get<ICourse[]>(url);
  }

  public async createGrade(
    categoryId: string,
    data: INewGrade
  ): Promise<AxiosResponse<IGrade>> {
    const url = "/categories/" + categoryId + "/grades/";
    return await this.apiRequest.post<INewGrade, IGrade>(url, data);
  }

  public async editGrade(
    categoryId: string,
    gradeId: string,
    data: IEditGrade
  ): Promise<AxiosResponse<IGrade>> {
    const url = "/categories/" + categoryId + "/grades/" + gradeId;
    return await this.apiRequest.put<IEditGrade, IGrade>(url, data);
  }

  public async deleteGrade(
    categoryId: string,
    gradeId: string
  ): Promise<AxiosResponse<HTTPStatus>> {
    const url = "/categories/" + categoryId + "/grades/" + gradeId;
    return await this.apiRequest.delete(url);
  }
}
