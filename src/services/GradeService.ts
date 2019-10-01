import ApiRequest from "./ApiRequest";
import { AxiosResponse } from "axios";
import { IGrade, ICourse } from "../datatypes/types";

interface IGradeService {
  getGrade(categoryId: string, gradeId: string): Promise<AxiosResponse<IGrade>>;
  getCoursesForGrade(categoryId:number, gradeId:number): Promise<AxiosResponse<ICourse[]>>;
}
export class GradeService implements IGradeService {
  private apiRequest = new ApiRequest();

  public async getGradesForCategory(categoryId:number): Promise<AxiosResponse<IGrade[]>> {
    const url = `/categories/${categoryId}/grades`;
    return await this.apiRequest.get<IGrade[]>(url);
  }

  public async getGrade(
    categoryId: string,
    gradeId: string
  ): Promise<AxiosResponse<IGrade>> {
    const url = `/categories/${categoryId}/grades/${gradeId}`;
    return await this.apiRequest.get<IGrade>(url);
  }

  public async getCoursesForGrade(
    categoryId: number,
    gradeId: number
  ): Promise<AxiosResponse<ICourse[]>> {
    const url = `/categories/${categoryId}/grades/${gradeId}/courses`;
    return await this.apiRequest.get<ICourse[]>(url);
  }
}
