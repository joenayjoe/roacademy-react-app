import React from "react";
import AuthService from "../../services/AuthService";
import { IUser, IPrimaryUser } from "../../settings/DataTypes";

interface IProps {
  styles: object;
  user: IUser | IPrimaryUser | null;
  avatarRef?: any;
}
const Avatar: React.FunctionComponent<IProps> = (props) => {
  const authService = new AuthService();

  let userAvatar;
  let userName = authService.getUserFullName(props.user);
  let userInitials = authService.getUserNameInitials(props.user);
  if (props.user && props.user.imageUrl) {
    userAvatar = (
      <img
        className={`user-avatar`}
        style={props.styles}
        src={props.user.imageUrl}
        alt={userName}
        ref={props.avatarRef}
      />
    );
  } else {
    userAvatar = (
      <span
        className={`user-avatar user-avatar-initials`}
        style={props.styles}
        ref={props.avatarRef}
      >
        {userInitials}
      </span>
    );
  }
  return <div style={props.styles}>{userAvatar}</div>;
};
export default Avatar;
