import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import AuthService from "../../services/AuthService";

interface IProps {
  styles: object;
  avatarRef?: any;
}
const Avatar: React.FunctionComponent<IProps> = props => {
  const authService = new AuthService();
  const authContext = useContext(AuthContext);

  let userAvatar;
  let userName = authService.getUserFullName(authContext.currentUser);
  let userInitials = authService.getUserNameInitials(authContext.currentUser);
  if (authContext.currentUser) {
    const currentUser = authContext.currentUser;
    if (currentUser.imageUrl) {
      userAvatar = (
        <img
          className={`user-avatar`}
          style={props.styles}
          src={currentUser.imageUrl}
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
  }
  return <div style={props.styles}>{userAvatar}</div>;
};
export default Avatar;
