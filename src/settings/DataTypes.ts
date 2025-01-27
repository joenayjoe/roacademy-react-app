export type ModalType = "card" | "regular";

export type ModalSize = "modal-lg" | "modal-md" | "modal-sm";

export enum ModalIdentifier {
  LOGIN_MODAL = "LoginModal",
  SIGNUP_MODAL = "SignupModal",
  NEW_CATEGORY_MODAL = "NewCategoryModal",
  CONFIRM_MODAL = "ConfirmModal",
  FORGOT_PASSWORD_MODAL = "ForgotPasswordModal",
}

export enum HTTPStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZE = 401,
  FORBIDDEN = 401,
  NOT_FOUND = 404,
}

export enum RoleType {
  ADMIN = "ROLE_ADMIN",
  TEACHER = "ROLE_TEACHER",
  STUDENT = "ROLE_STUDENT",
}

export enum CourseStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  PUBLISHED = "PUBLISHED",
}

export type MenuItemType = ICategory | IGrade | ICourse;

export enum CommentableType {
  COURSE = "Course",
  LECTURE = "Lecture",
}

export enum ResourceType {
  CATEGORY = "Category",
  GRADE = "Grade",
  COURSE = "Course",
}
export enum AlertVariant {
  PRIMARY = "alert alert-primary",
  SECONDARY = "alert alert-secondary",
  SUCCESS = "alert alert-success",
  INFO = "alert alert-info",
  WARNING = "alert alert-warning",
  DANGER = "alert alert-danger",
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
  imageUrl: string;
}

interface IAuditable {
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory extends IPrimaryCategory, IAuditable {
  grades: IGrade[];
}

export interface INewCategory {
  name: string;
}
export interface IEditCategory extends INewCategory {
  id: number;
}

export interface IGrade extends IPrimaryGrade, IAuditable {
  primaryCategory: IPrimaryCategory;
  courses: ICourse[];
}

export interface INewGrade {
  name: string;
  categoryId: number;
}
export interface IEditGrade extends INewGrade {
  id: number;
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
  imageUrl: string;
}

export interface ICourseSubscribeRequest {
  studentId: number;
  courseId: number;
}

export interface ICourseSubscriptionCheckResponse {
  studentId: number;
  courseId: number;
  subscribed: boolean;
}

export interface IDetailCourse extends ICourse {
  chapters: IChapter[];
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

export interface IEditCourse extends INewCourse {
  id: number;
}

export interface ICourseStatusUpdateRequest {
  id: number;
  status: CourseStatus;
}

export interface IPrimaryChapter {
  id: number;
  name: string;
}

export interface IChapter extends IPrimaryChapter, IAuditable {
  primaryCourse: IPrimaryCourse;
  lectures: ILecture[];
  position: number;
}

export interface INewChapter {
  name: string;
  courseId: number;
  position: number;
}

export interface IEditChapter {
  id: number;
  name: string;
}

export interface IChapterPositinUpdateRequest {
  chapterId: number;
  position: number;
}

export interface IPrimaryLecture {
  id: number;
  name: string;
}
export interface ILecture extends IPrimaryLecture, IAuditable {
  description: string;
  position: number;
  tags: string[];
  lectureResources: ILectureResource[];
}

export interface INewLecture {
  name: string;
  description: string;
  chapterId: number;
  position: number;
  tags: string[];
}
export interface IEditLecture {
  id: number;
  name: string;
  description: string;
  chapterId: number;
  tags: string[];
}

export interface ILecturePositionUpdateRequest {
  chapterId: number;
  lectureId: number;
  position: number;
}

export interface ILectureResource extends IAuditable {
  id: number;
  fileName: string;
  contentType: string;
  fileSize: string;
  fileUrl: string;
  resourceId: string;
}

export interface ITag {
  id: number;
  name: string;
}

export interface IUser extends IPrimaryUser, IAuditable {
  roles: IRole[];
}

export interface IUserEditRequest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roleIds: number[];
}

export interface IUserProfileUpdateRequest {
  firstName: string;
  lastName: string;
}

export interface IEmailUpdateRequest {
  email: string;
}

export interface IPasswordResetRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
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

export interface IToken {
  sub: string;
  exp: number;
  iat: number;
}

export interface ISearchResponse {
  id: number;
  name: string;
  type: string;
  url: string;
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

export interface IComment extends IAuditable {
  id: number;
  commentBody: string;
  commentedBy: IPrimaryUser;
  parentId: number;
  numberOfReplies: number;
}

export interface ICommentRequest {
  commentBody: string;
}

export interface ICommentEditRequest {
  id: number;
  commentBody: string;
}
