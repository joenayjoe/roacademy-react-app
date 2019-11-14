export type ModalType = "card" | "regular";

export type ModalSize = "modal-lg" | "modal-md" | "modal-sm";

export enum ModalIdentifier {
  LOGIN_MODAL = "LoginModal",
  SIGNUP_MODAL = "SignupModal"
}

export type MenuItemType = ICategory | IGrade | ICourse;
export enum AlertVariant {
  PRIMARY = "alert alert-primary",
  SECONDARY = "alert alert-secondary",
  SUCCESS = "alert alert-success",
  INFO = "alert alert-info",
  WARNING = "alert alert-warning",
  DANGER = "alert alert-danger"
}

export interface ILinkItem {
  id: number;
  name: string;
  url: string;
}

export interface ICategory extends ILinkItem {
  grades: IGrade[];
  catched?: boolean;
}

export interface IGrade extends ILinkItem {
  categoryId: number;
  courses: ICourse[];
  catched?: boolean;
}

export interface ICourse extends ILinkItem {
  gradeId: number;
  tags: ITag[];
}

export interface IChapter extends ILinkItem {
  courseId: number;
}

export interface ITag {
  id: number;
  name: string;
}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  imageUrl: string;
  email: string;
  roles: IRole[];
  url: string;
}

export interface IRole {
  id: number;
  name: string;
}

export interface ISignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ISocialLoginRequest {
  id: string;
  accessToken: string;
}

export interface ILoginResponse {
  accessToken: string;
}

export interface ISearchRequest {
  query: string;
}
export interface IAutoSuggest {
  name: string;
  url: string;
}

export interface IToken {
  sub: string;
  exp: number;
  iat: number;
}
