import React, { useContext, useState, FormEvent } from "react";
import UserSettingContainer from "./UserSettingContainer";
import { AuthContext } from "../../contexts/AuthContext";
import { AlertContext } from "../../contexts/AlertContext";
import {
  AlertVariant,
  IPasswordResetRequest,
  HTTPStatus,
  IEmailUpdateRequest
} from "../../settings/DataTypes";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { HOME_URL } from "../../settings/Constants";
import UserService from "../../services/UserService";
import AuthService from "../../services/AuthService";
import { axiosErrorParser } from "../../utils/errorParser";
import Alert from "../../components/flash/Alert";

interface IProps extends RouteComponentProps {}
const AccountSetting: React.FunctionComponent<IProps> = props => {
  // context
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  // services
  const userService = new UserService();
  const authService = new AuthService();
  // states
  const [email, setEmail] = useState<string | null>(
    authContext.currentUser && authContext.currentUser.email
  );
  const [password, setPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const [passwordErrors, setPassworErrors] = useState<string[]>([]);
  const [emailError, setEmailError] = useState<string[]>([]);

  const handleEmailChangeSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (authContext.currentUser && email) {
      const data: IEmailUpdateRequest = {
        email: email
      };
      userService
        .updateEmail(authContext.currentUser.id, data)
        .then(resp => {
          setEmailError([]);
          authService.setLoggedInUserCookie(resp.data);
          alertContext.show("Email address updated successfully.");
        })
        .catch(err => {
          setEmailError(axiosErrorParser(err));
        });
    }
  };
  const handlePasswordResetSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (authContext.currentUser) {
      const data: IPasswordResetRequest = {
        oldPassword: password,
        newPassword: newPassword,
        confirmPassword: confirmNewPassword
      };
      userService
        .resetPassword(authContext.currentUser.id, data)
        .then(resp => {
          if (resp.status === HTTPStatus.OK) {
            setPassworErrors([]);
            authContext.logout();
          }
        })
        .catch(err => {
          setPassworErrors(axiosErrorParser(err));
        });
    }
  };

  const resetPasswordChanges = () => {
    setPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const emailErrorFlash = emailError.length ? (
    <Alert
      title="Following errors prevent form from saving: "
      errors={emailError}
      variant={AlertVariant.DANGER}
      closeHandler={() => setEmailError([])}
    />
  ) : null;
  const passwordErrorFlash = passwordErrors.length ? (
    <Alert
      title="Following errors prevent form from saving: "
      errors={passwordErrors}
      variant={AlertVariant.DANGER}
      closeHandler={() => setPassworErrors([])}
    />
  ) : null;

  if (authContext.currentUser) {
    return (
      <UserSettingContainer>
        <div className="user-profile-form-wrapper">
          <div className="user-profile-header mb-1 mt-2">
            <h3>Account</h3>
            <p className="text-secondary">Edit email and password here</p>
          </div>
          <div className="user-profile-edit-form">
            <div className="user-account-setting-container">
              <form onSubmit={handleEmailChangeSubmit}>
                {emailErrorFlash}
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email ? email : ""}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                  />
                </div>

                <div className="form-group action-btn-group">
                  <button
                    type="button"
                    className="btn btn-danger action-btn"
                    onClick={() =>
                      setEmail(
                        authContext.currentUser && authContext.currentUser.email
                      )
                    }
                  >
                    CANCEL
                  </button>
                  <button type="submit" className="btn btn-primary action-btn">
                    SAVE
                  </button>
                </div>
              </form>
              <hr />
              <form onSubmit={handlePasswordResetSubmit}>
                {passwordErrorFlash}
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Current Password"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmNewPassword}
                    onChange={e => setConfirmNewPassword(e.target.value)}
                    placeholder="New Password Confirmation"
                    required
                  />
                </div>
                <div className="form-group action-btn-group">
                  <button
                    type="button"
                    className="btn btn-danger action-btn"
                    onClick={resetPasswordChanges}
                  >
                    CANCEL
                  </button>
                  <button type="submit" className="btn btn-primary action-btn">
                    SAVE
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </UserSettingContainer>
    );
  } else {
    alertContext.show("Access denied", AlertVariant.DANGER);
    return <Redirect to={HOME_URL} />;
  }
};
export default AccountSetting;
