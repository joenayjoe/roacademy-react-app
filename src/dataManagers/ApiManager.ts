import ApiRequest from "./ApiRequest";
import { AxiosResponse } from "axios";
import {
  IGrade,
  ICourse,
  ILoginRequest,
  ILoginResponse,
  ICategory,
  ISearchRequest,
  IUser
} from "../settings/DataTypes";

class ApiManager {
  private apiRequest: ApiRequest;
  constructor() {
    this.apiRequest = new ApiRequest();
  }
  // Methods for Categories

  public async getCategories(): Promise<AxiosResponse<ICategory[]>> {
    return await this.apiRequest.get<ICategory[]>("/categories");
  }

  public async getCategory(
    categoryId: string
  ): Promise<AxiosResponse<ICategory>> {
    const url = "/categories/" + categoryId;
    return await this.apiRequest.get<ICategory>(url);
  }

  // Methods for Category END

  // Methods for Grade

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
  // Methods for Grade END

  // Methods for Course

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
  // Methods for Course END

  // Methods for User

  public async getCurrentUser(): Promise<AxiosResponse<IUser>> {
    const url = "/users/currentUser";
    return await this.apiRequest.get<IUser>(url);
  }

  // Methods for Authentication
  public async login(
    loginData: ILoginRequest
  ): Promise<AxiosResponse<ILoginResponse>> {
    return await this.apiRequest.post<ILoginRequest, ILoginResponse>(
      "/auth/signin",
      loginData
    );
  }
  // Methods for Authentication END
}
export default ApiManager;
