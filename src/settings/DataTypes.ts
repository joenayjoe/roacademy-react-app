export type ModalType = "card" | "regular";

export type ModalSize = "modal-lg" | "modal-md" | "modal-sm";

export enum ModalIdentifier {
  LOGIN_MODAL = "LoginModal",
  SIGNUP_MODAL = "SignupModal",
  NEW_CATEGORY_MODAL = "NewCategoryModal",
  CONFIRM_MODAL = "ConfirmModal"
}

export enum HTTPStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZE = 401,
  FORBIDDEN = 401,
  NOT_FOUND = 404
}

export enum RoleType {
  ADMIN = "ROLE_ADMIN",
  TEACHER = "ROLE_TEACHER",
  STUDENT = "ROLE_STUDENT"
}

export enum CourseStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  PUBLISHED = "PUBLISHED"
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

interface Auditable {
  createdAt: Date;
  updatedAt: Date;
}
export interface ILinkItem extends Auditable {
  id: number;
  name: string;
}

export interface ICategory extends ILinkItem {
  grades: IGrade[];
  catched?: boolean;
}

export interface INewCategory {
  name: string;
}
export interface IEditCategory {
  id: number;
  name: string;
}
export interface INewGrade {
  name: string;
  categoryId: number;
}
export interface IEditGrade {
  id: number;
  name: string;
  categoryId: number;
}

export interface IGrade extends ILinkItem {
  categoryId: number;
  courses: ICourse[];
  catched?: boolean;
}

export interface ICourse extends ILinkItem {
  headline: string;
  description: string;
  objectives: string[];
  requirements: string[];
  categoryId: number;
  gradeId: number;
  status: string;
  level: string;
  hits: number;
  createdBy: IUser;
  tags: ITag[];
}

export interface INewCourse {
  name: string;
  headline: string;
  description: string;
  level: string;
  objectives: string[];
  requirements: string[];
  categoryId: number;
  gradeId: number;
  status: CourseStatus;
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
