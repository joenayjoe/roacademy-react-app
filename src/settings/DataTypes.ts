export type ModalType = "card" | "regular";

export type ModalSize = "modal-lg" | "modal-md" | "modal-sm";

export enum ModalIdentifier {
  LOGIN_MODAL = "LoginModal",
  SIGNUP_MODAL = "SignupModal"
}

export type MenuItemType = ICategory | IGrade | ICourse;

interface ILinkItem {
  id: number;
  name: string;
  url: string;
}

export interface ICategory extends ILinkItem {
  grades: IGrade[];
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

export interface ITag {
  id: number;
  name: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}
export interface ILoginResponse {
  accessToken: string;
  tokenType: string;
}
