export type ModalType = "card" | "regular";

export type ModalSize = "modal-lg" | "modal-md" | "modal-sm";

export enum ModalIdentifier {
  LOGIN_MODAL = "LoginModal",
  SIGNUP_MODAL = "SignupModal"
}

export enum RoleType {
  ADMIN = "ROLE_ADMIN",
  TEACHER = "ROLE_TEACHER",
  STUDENT = "ROLE_STUDENT"
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

export interface ITag extends ILinkItem {}

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  imageUrl: string;
  email: string;
  roles: IRole[];
}

export interface IRole extends ILinkItem {}

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

export interface IToken {
  sub: string;
  exp: number;
  iat: number;
}
