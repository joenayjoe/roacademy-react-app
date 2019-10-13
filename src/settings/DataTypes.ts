export type ModalType = "card" | "regular";

export type ModalSize = "modal-lg" | "modal-md" | "modal-sm";

export enum ModalIdentifier {
  LOGIN_MODAL = "LoginModal",
  SIGNUP_MODAL = "SignupModal"
}

export type MenuItemType = ICategory | IGrade | ICourse;
export enum ButtonVariant {
  PRIMARY = "btn btn-primary",
  SECONDARY = "btn btn-secondary",
  SUCCESS = "btn btn-success",
  INFO = "btn btn-info",
  WARNING = "btn btn-warning",
  DANGER = "btn btn-danger"
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
export interface ILoginResponse {
  accessToken: string;
  tokenType: string;
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
