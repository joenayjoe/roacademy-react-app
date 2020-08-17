import { AxiosResponse } from "axios";

import ApiRequest from "./ApiRequest";
import {
  INewLecture,
  ILecture,
  IEditLecture,
  HTTPStatus,
  ILecturePositionUpdateRequest,
  Page,
  IComment,
  ICommentRequest,
} from "../settings/DataTypes";
import { DEFAULT_SORTING } from "../settings/Constants";

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

  public async uploadLectureResource(
    lectureId: number,
    formData: FormData
  ): Promise<AxiosResponse<ILecture>> {
    const url = "/lectures/" + lectureId + "/resources";
    return await this.apiRequest.post<FormData, ILecture>(url, formData);
  }

  public async deleteLectureResource(
    lectureId: number,
    resourceId: number
  ): Promise<AxiosResponse<HTTPStatus>> {
    const url = "/lectures/" + lectureId + "/resources/" + resourceId;
    return await this.apiRequest.delete(url);
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

  // comments
  public async getComments(
    lectureId: number,
    page: number,
    size: number,
    order = DEFAULT_SORTING
  ): Promise<AxiosResponse<Page<IComment>>> {
    const url = `/lectures/${lectureId}/comments?page=${page}&size=${size}&order=${order}`;
    return await this.apiRequest.get<Page<IComment>>(url);
  }

  public async getReplies(
    lectureId: number,
    commentId: number,
    page: number,
    size: number,
    order = "id_asc"
  ): Promise<AxiosResponse<Page<IComment>>> {
    const url = `/lectures/${lectureId}/comments/${commentId}/replies?page=${page}&size=${size}&order=${order}`;
    return await this.apiRequest.get<Page<IComment>>(url);
  }

  public async addComment(
    lectureId: number,
    comment: ICommentRequest
  ): Promise<AxiosResponse<IComment>> {
    const url = `/lectures/${lectureId}/comments`;
    return await this.apiRequest.post<ICommentRequest, IComment>(url, comment);
  }

  public async addCommentReply(
    lectureId: number,
    commentId: number,
    reply: ICommentRequest
  ): Promise<AxiosResponse<IComment>> {
    const url = `/lectures/${lectureId}/comments/${commentId}/replies`;
    return await this.apiRequest.post<ICommentRequest, IComment>(url, reply);
  }

  public async deleteComment(
    lectureId: number,
    commentId: number
  ): Promise<AxiosResponse<HTTPStatus>> {
    const url = `/lectures/${lectureId}/comments/${commentId}`;
    return await this.apiRequest.delete(url);
  }
}
export default LectureService;
