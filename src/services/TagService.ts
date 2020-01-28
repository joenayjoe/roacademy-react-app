import { AxiosResponse } from "axios";

import ApiRequest from "./ApiRequest";
import { ITag } from "../settings/DataTypes";

export class TagService {
  private apiRequest = new ApiRequest();
  private baseUrl = "/search/tags";

  public async search(name: string): Promise<AxiosResponse<ITag[]>> {
    const url = this.baseUrl + "?name=" + name;
    return await this.apiRequest.get(url);
  }
}
export default TagService;
