import ApiRequest from "./ApiRequest";
import { AxiosResponse } from "axios";
import { IGrade, ICourse } from "../settings/DataTypes";

interface IGradeService {
  getGrade(categoryId: string, gradeId: string): Promise<AxiosResponse<IGrade>>;
  getCoursesForGrade(grade: IGrade): Promise<AxiosResponse<ICourse[]>>;
}
export class GradeService implements IGradeService {
  private apiRequest = new ApiRequest();

  public async getGrade(
    categoryId: string,
    gradeId: string
  ): Promise<AxiosResponse<IGrade>> {
    const url = `/categories/${categoryId}/grades/${gradeId}`;
    return await this.apiRequest.get<IGrade>(url);
  }

  public async getCoursesForGrade(
    grade: IGrade
  ): Promise<AxiosResponse<ICourse[]>> {
    const url = `/categories/${grade.categoryId}/grades/${grade.id}/courses`;
    return await this.apiRequest.get<ICourse[]>(url);
  }
}
