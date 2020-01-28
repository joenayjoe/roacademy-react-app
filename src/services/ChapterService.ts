import ApiRequest from "./ApiRequest";
import { AxiosResponse } from "axios";
import {
  IChapter,
  INewChapter,
  INewCategory,
  IEditChapter
} from "../settings/DataTypes";

class ChapterService {
  private apiRequest = new ApiRequest();

  public async getChaptersByCourseId(
    courseId: number
  ): Promise<AxiosResponse<IChapter[]>> {
    const url = "/courses/" + courseId + "/chapters";
    return await this.apiRequest.get(url);
  }

  public async createChapter(
    courseId: number,
    data: INewChapter
  ): Promise<AxiosResponse<IChapter>> {
    const url = "/courses/" + courseId + "/chapters";
    return await this.apiRequest.post<INewCategory, IChapter>(url, data);
  }

  public async updateChapter(
    courseId: number,
    chapterId: number,
    data: IEditChapter
  ): Promise<AxiosResponse<IChapter>> {
    const url = "/courses/" + courseId + "/chapters/" + chapterId;
    return await this.apiRequest.put<IEditChapter, IChapter>(url, data);
  }

  public async deleteChapter(
    courseId: number,
    chapterId: number
  ): Promise<AxiosResponse<IChapter>> {
    const url = "/courses/" + courseId + "/chapters/" + chapterId;
    return await this.apiRequest.delete(url);
  }
}
export default ChapterService;