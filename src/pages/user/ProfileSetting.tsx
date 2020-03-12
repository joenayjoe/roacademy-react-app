import React, { useContext, useState, FormEvent } from "react";
import UserSettingContainer from "./UserSettingContainer";
import { AuthContext } from "../../contexts/AuthContext";
import { Redirect } from "react-router-dom";
import { HOME_URL } from "../../settings/Constants";
import { AlertContext } from "../../contexts/AlertContext";
import {
  AlertVariant,
  IUser,
  IUserProfileUpdateRequest
} from "../../settings/DataTypes";
import UserService from "../../services/UserService";
import { parseError } from "../../utils/errorParser";
import Alert from "../../components/flash/Alert";

const ProfileSetting: React.FunctionComponent = () => {
  // context
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  // service
  const userService = new UserService();

  const [user, setUser] = useState<IUser | null>(authContext.currentUser);
  const [formError, setFormError] = useState<string[]>([]);

  const resetForm = () => {
    setUser(authContext.currentUser);
  };

  const submitForm = (e: FormEvent) => {
    e.preventDefault();
    if (user) {
      const data: IUserProfileUpdateRequest = {
        firstName: user.firstName,
        lastName: user.lastName
      };
      userService
        .updateProfile(user.id, data)
        .then(resp => {
          setFormError([]);
          window.location.reload();
        })
        .catch(err => {
          setFormError(parseError(err));
        });
    }
  };

  const formErrorFlash = formError.length ? (
    <Alert
      variant={AlertVariant.DANGER}
      errors={formError}
      closeHandler={() => setFormError([])}
    />
  ) : null;

  if (user) {
    return (
      <UserSettingContainer>
        <div className="user-profile-form-wrapper">
          <div className="user-profile-header mb-2 mt-2">
            <h3>Profile</h3>
            <p className="text-secondary">Add information about yourself</p>
          </div>
          <div className="user-profile-edit-form">
            <div className="public-profile-edit-container">
              <form onSubmit={submitForm}>
                {formErrorFlash}
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user.firstName}
                    onChange={e =>
                      setUser({ ...user, firstName: e.target.value })
                    }
                    placeholder="First Name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user.lastName}
                    onChange={e =>
                      setUser({ ...user, lastName: e.target.value })
                    }
                    placeholder="Last Name"
                    required
                  />
                </div>
                <div className="form-group action-btn-group">
                  <button
                    type="button"
                    className="btn btn-danger action-btn"
                    onClick={resetForm}
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

export default ProfileSetting;
