import { AxiosResponse } from "axios";

import ApiRequest from "./ApiRequest";
import {
  IYoutubeCredentialUpdateRequest,
  IYoutubeCredentials
} from "../settings/DataTypes";

export class YoutubeService {
  private apiRequest = new ApiRequest();

  public async getCredentials(): Promise<AxiosResponse<IYoutubeCredentials>> {
    const url = "/oauth2";
    return await this.apiRequest.get(url);
  }
  public async updateCredentials(
    data: IYoutubeCredentialUpdateRequest
  ): Promise<AxiosResponse<IYoutubeCredentials>> {
    const url = "/oauth2/";
    return await this.apiRequest.post<
      IYoutubeCredentialUpdateRequest,
      IYoutubeCredentials
    >(url, data);
  }
}
export default YoutubeService;
