import ApiRequest from "./ApiRequest";
import { AxiosResponse } from "axios";
import { IGrade, ICourse } from "../settings/DataTypes";

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

  public async getGradesForCategory(categoryId: number) {
    const url = `/categories/${categoryId}/grades`;
    return await this.apiRequest.get<IGrade[]>(url);
  }

  public async getCoursesForGrade(
    categoryId: number,
    gradeId: number
  ): Promise<AxiosResponse<ICourse[]>> {
    const url = `/categories/${categoryId}/grades/${gradeId}/courses`;
    return await this.apiRequest.get<ICourse[]>(url);
  }
}
