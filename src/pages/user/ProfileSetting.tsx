import React, { Component } from "react";
import UserSettingContainer from "./UserSettingContainer";

class ProfileSetting extends Component {
  render() {
    return (
      <UserSettingContainer>
        <div className="user-profile-form-wrapper">
          <div className="user-profile-header mb-2 mt-2">
            <h3>Profile</h3>
            <p className="text-secondary">Add information about yourself</p>
          </div>
          <div className="user-profile-edit-form">Profile Editing Area</div>
        </div>
      </UserSettingContainer>
    );
  }
}

export default ProfileSetting;
