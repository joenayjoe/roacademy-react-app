import { AxiosResponse } from "axios";
import { ICategory } from "../settings/DataTypes";
import ApiRequest from "./ApiRequest";

interface ICategoryService {
  getCategories(): Promise<AxiosResponse<ICategory[]>>;
  getCategory(categoryId: string): Promise<AxiosResponse<ICategory>>;
}

export class CategoryService implements ICategoryService {
  private apiRequest = new ApiRequest();

  public async getCategories(): Promise<AxiosResponse<ICategory[]>> {
    return await this.apiRequest.get<ICategory[]>("/categories");
  }

  public async getCategory(
    categoryId: string
  ): Promise<AxiosResponse<ICategory>> {
    const url = "/categories/" + categoryId;
    return await this.apiRequest.get<ICategory>(url);
  }
}
