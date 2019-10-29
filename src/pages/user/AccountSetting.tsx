import React, { Component } from "react";
import UserSettingContainer from "./UserSettingContainer";

class AccountSetting extends Component {
  render() {
    return (
      <UserSettingContainer>
        <div className="user-profile-form-wrapper">
          <div className="user-profile-header mb-1 mt-2">
            <h3>Account</h3>
            <p className="text-secondary">Edit email and password here</p>
          </div>
          <div className="user-profile-edit-form">Account Editing Area</div>
        </div>
      </UserSettingContainer>
    );
  }
}
export default AccountSetting;
