import { AxiosResponse } from "axios";

import ApiRequest from "./ApiRequest";
import { IRole } from "../settings/DataTypes";

export class RoleService {
  private apiRequest = new ApiRequest();

  public async getRoles(): Promise<AxiosResponse<IRole[]>> {
    const url = "/roles";
    return await this.apiRequest.get(url);
  }
}
export default RoleService;
