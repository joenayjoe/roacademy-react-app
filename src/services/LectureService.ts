import { AxiosResponse } from "axios";

import ApiRequest from "./ApiRequest";
import {
  INewLecture,
  ILecture,
  IEditLecture,
  HTTPStatus,
  ILecturePositionUpdateRequest
} from "../settings/DataTypes";

export class LectureService {
  private apiRequest = new ApiRequest();

  public async createLecture(
    courseId: number,
    chapterId: number,
    lecture: INewLecture
  ): Promise<AxiosResponse<ILecture>> {
    const url = "/courses/" + courseId + "/chapters/" + chapterId + "/lectures";
    return await this.apiRequest.post<INewLecture, ILecture>(url, lecture);
  }

  public async updateLecture(
    courseId: number,
    chapterId: number,
    lectureId: number,
    lecture: IEditLecture
  ): Promise<AxiosResponse<ILecture>> {
    const url =
      "/courses/" +
      courseId +
      "/chapters/" +
      chapterId +
      "/lectures/" +
      lectureId;
    return await this.apiRequest.put<IEditLecture, ILecture>(url, lecture);
  }

  public async updateLecturePositions(
    positions: ILecturePositionUpdateRequest[]
  ): Promise<AxiosResponse<HTTPStatus>> {
    const url = "/lectures/update_positions";
    return await this.apiRequest.post<
      ILecturePositionUpdateRequest[],
      HTTPStatus
    >(url, positions);
  }

  public async deleteLecture(
    courseId: number,
    chapterId: number,
    lectureId: number
  ): Promise<AxiosResponse<HTTPStatus>> {
    const url =
      "/courses/" +
      courseId +
      "/chapters/" +
      chapterId +
      "/lectures/" +
      lectureId;
    return await this.apiRequest.delete(url);
  }
}
export default LectureService;
