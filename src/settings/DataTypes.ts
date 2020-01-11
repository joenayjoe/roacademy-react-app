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

export interface IPrimaryCategory {
  id: number;
  name: string;
}

export interface IPrimaryGrade {
  id: number;
  name: string;
}
export interface IPrimaryCourse {
  id: number;
  name: string;
}
export interface IPrimaryUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IPrimaryChapter {
  id: number;
  name: string;
}

interface IAuditable {
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory extends IPrimaryCategory, IAuditable {
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

export interface IGrade extends IPrimaryGrade, IAuditable {
  primaryCategory: IPrimaryCategory;
  courses: ICourse[];
  catched?: boolean;
}

export interface ICourse extends IPrimaryCourse, IAuditable {
  headline: string;
  description: string;
  objectives: string[];
  requirements: string[];
  primaryCategory: IPrimaryCategory;
  primaryGrade: IPrimaryGrade;
  status: string;
  level: string;
  hits: number;
  createdBy: IPrimaryUser;
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

export interface IChapter extends IPrimaryChapter, IAuditable {
  primaryCourse: IPrimaryCourse;
}

export interface ITag extends IAuditable {
  id: number;
  name: string;
}

export interface IUser extends IPrimaryUser, IAuditable {
  imageUrl: string;
  roles: IRole[];
}

export interface IRole extends IAuditable {
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
export interface ISearchResponse {
  id: number;
  name: string;
}

export interface IToken {
  sub: string;
  exp: number;
  iat: number;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  number: number;
  totalElements: number;
  numberOfElements: number;
  size: number;
  first: boolean;
  last: boolean;
}
