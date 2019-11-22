import { AxiosResponse } from "axios";
import { ICategory } from "../settings/DataTypes";
import ApiRequest from "./ApiRequest";

export class CategoryService {
  private apiRequest = new ApiRequest();

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

  public async getCategoryWithGrade(
    categoryId: string
  ): Promise<AxiosResponse<ICategory>> {
    const url = "/categories/" + categoryId + "?withGrade=true";
    return await this.apiRequest.get<ICategory>(url);
  }
}
