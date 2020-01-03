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

  public async getCoursesForGrade(
    gradeId: number
  ): Promise<AxiosResponse<ICourse[]>> {
    const url = `/grades/${gradeId}/courses`;
    return await this.apiRequest.get<ICourse[]>(url);
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
