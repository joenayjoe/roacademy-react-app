import { AxiosResponse } from "axios";
import { ICategory, INewCategory, ICourse } from "../settings/DataTypes";
import ApiRequest from "./ApiRequest";

export class CategoryService {
  private apiRequest = new ApiRequest();

  public async createCategory(
    data: INewCategory
  ): Promise<AxiosResponse<ICategory>> {
    return await this.apiRequest.post<INewCategory, ICategory>(
      "/categories",
      data
    );
  }

  public async getCategories(): Promise<AxiosResponse<ICategory[]>> {
    return await this.apiRequest.get<ICategory[]>("/categories");
  }

  public async getCategoriesWithGrades(): Promise<AxiosResponse<ICategory[]>> {
    return await this.apiRequest.get<ICategory[]>("/categories?withGrade=true");
  }

  public async getCategory(
    categoryId: string
  ): Promise<AxiosResponse<ICategory>> {
    const url = "/categories/" + categoryId;
    return await this.apiRequest.get<ICategory>(url);
  }

  public async getCategoryWithGrades(
    categoryId: string
  ): Promise<AxiosResponse<ICategory>> {
    const url = "/categories/" + categoryId + "?withGrade=true";
    return await this.apiRequest.get<ICategory>(url);
  }

  public async getCoursesForCategory(
    categoryId: string
  ): Promise<AxiosResponse<ICourse[]>> {
    const url = "/categories/" + categoryId + "/get_courses";
    return await this.apiRequest.get(url);
  }

  public async getCategoryWithGradesAndCourses(
    categoryId: string
  ): Promise<AxiosResponse<ICategory>> {
    const url = "/categories/" + categoryId + "?withGrade=true&withCourse=true";
    return await this.apiRequest.get<ICategory>(url);
  }
}
