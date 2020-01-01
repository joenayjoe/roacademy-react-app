import { AxiosResponse } from "axios";
import {
  ICategory,
  INewCategory,
  ICourse,
  HTTPStatus,
  IEditCategory
} from "../settings/DataTypes";
import ApiRequest from "./ApiRequest";

export class CategoryService {
  private apiRequest = new ApiRequest();
  private baseUrl = "/categories";

  public async createCategory(
    data: INewCategory
  ): Promise<AxiosResponse<ICategory>> {
    return await this.apiRequest.post<INewCategory, ICategory>(
      this.baseUrl,
      data
    );
  }

  public async getCategories(
    order?: string
  ): Promise<AxiosResponse<ICategory[]>> {
    const url = order ? this.baseUrl + "?order=" + order : this.baseUrl;
    return await this.apiRequest.get<ICategory[]>(url);
  }

  public async getCategoriesWithGrades(): Promise<AxiosResponse<ICategory[]>> {
    const url = this.baseUrl + "?withGrade=true";
    return await this.apiRequest.get<ICategory[]>(url);
  }

  public async getCategory(
    categoryId: string
  ): Promise<AxiosResponse<ICategory>> {
    const url = this.baseUrl + "/" + categoryId;
    return await this.apiRequest.get<ICategory>(url);
  }

  public async getCategoryWithGrades(
    categoryId: string
  ): Promise<AxiosResponse<ICategory>> {
    const url = this.baseUrl + "/" + categoryId + "?withGrade=true";
    return await this.apiRequest.get<ICategory>(url);
  }

  public async getCoursesForCategory(
    categoryId: string
  ): Promise<AxiosResponse<ICourse[]>> {
    const url = this.baseUrl + "/" + categoryId + "/get_courses";
    return await this.apiRequest.get(url);
  }

  public async getCategoryWithGradesAndCourses(
    categoryId: string
  ): Promise<AxiosResponse<ICategory>> {
    const url = this.baseUrl + categoryId + "?withGrade=true&withCourse=true";
    return await this.apiRequest.get<ICategory>(url);
  }

  public async editCategory(
    categoryId: string,
    data: IEditCategory
  ): Promise<AxiosResponse<ICategory>> {
    const url = this.baseUrl + "/" + categoryId;
    return await this.apiRequest.put<IEditCategory, ICategory>(url, data);
  }

  public async deleteCategory(
    categoryId: string
  ): Promise<AxiosResponse<HTTPStatus>> {
    const url = this.baseUrl + "/" + categoryId;
    return await this.apiRequest.delete(url);
  }
}
