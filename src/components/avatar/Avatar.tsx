import React, { Component, ContextType } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import AuthService from "../../services/AuthService";

interface IProps {
  styles: object;
  avatarRef?: any;
}
class Avatar extends Component<IProps> {
  private authService: AuthService;
  static contextType = AuthContext;
  context!: ContextType<typeof AuthContext>;

  constructor(props: IProps) {
    super(props);
    this.authService = new AuthService();
  }

  render() {
    let userAvatar;
    let userName = this.authService.getUserFullName(this.context);
    let userInitials = this.authService.getUserNameInitials(this.context);
    if (this.context && this.context.currentUser) {
      if (this.context.currentUser.imageUrl) {
        userAvatar = (
          <img
            className={`user-avatar`}
            style={this.props.styles}
            src={this.context.currentUser.imageUrl}
            alt={userName}
            ref={this.props.avatarRef}
          />
        );
      } else {
        userAvatar = (
          <span
            className={`user-avatar user-avatar-initials`}
            style={this.props.styles}
            ref={this.props.avatarRef}
          >
            {userInitials}
          </span>
        );
      }
    }
    return (
      <React.Fragment>{userAvatar}</React.Fragment>
    );
  }
}
export default Avatar;
