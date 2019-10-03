import { AxiosResponse } from "axios";
import { ICategory } from "../settings/DataTypes";
import ApiRequest from "./ApiRequest";

export class CategoryService {
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
