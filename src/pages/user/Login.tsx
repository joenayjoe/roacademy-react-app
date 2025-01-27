import React, { FormEvent, useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./UserSetting.css";
import {
  ILoginRequest,
  ModalIdentifier,
  AlertVariant,
} from "../../settings/DataTypes";
import { withRouter, RouteComponentProps } from "react-router";
import { axiosErrorParser } from "../../utils/errorParser";
import Alert from "../../components/flash/Alert";
import AuthService from "../../services/AuthService";
import { AuthContext } from "../../contexts/AuthContext";
import {
  FACEBOOK_AUTH_URL,
  GOOGLE_AUTH_URL,
  HOME_URL,
  USER_DASHBOARD_URL,
} from "../../settings/Constants";

interface IProps extends RouteComponentProps {
  closeHandler: () => void;
  modalSwitchHandler: (modal: ModalIdentifier) => void;
}

const Login: React.FunctionComponent<IProps> = (props) => {
  const authService = new AuthService();

  const authContext = useContext(AuthContext);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handleLoginOnSubmit = (e: FormEvent) => {
    e.preventDefault();

    let formData: ILoginRequest = {
      email: email,
      password: password,
    };
    authService
      .login(formData)
      .then((resp) => {
        authContext && authContext.login(resp.data);
        if (props.location.pathname === HOME_URL) {
          props.history.replace(USER_DASHBOARD_URL);
        } else {
          props.history.replace(props.location.pathname);
        }
        props.closeHandler();
      })
      .catch((error) => {
        const errorMessages: string[] = axiosErrorParser(error);
        setErrorMessages(errorMessages);
      });
  };

  let flashError: JSX.Element | undefined;
  if (errorMessages.length) {
    flashError = <Alert variant={AlertVariant.DANGER} errors={errorMessages} />;
  }
  return (
    <div className="auth-modal login-modal">
      <div className="social-login">
        <a className={"social-btn facebook-login"} href={FACEBOOK_AUTH_URL}>
          <span>
            <FontAwesomeIcon
              icon={["fab", "facebook-f"]}
              className="ra-icon"
              size="2x"
            />
          </span>
          <span className="pl-2">Continue with Facebook</span>
        </a>

        <a className="social-btn google-login" href={GOOGLE_AUTH_URL}>
          <span>
            <FontAwesomeIcon
              icon={["fab", "google"]}
              className="ra-icon"
              size="lg"
            />
          </span>
          <span className="pl-2">Continue with Google</span>
        </a>
      </div>
      <div className="dropdown-divider"></div>
      <div>
        <form onSubmit={handleLoginOnSubmit}>
          {flashError}
          <div className="form-group">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon1">
                  <FontAwesomeIcon icon="envelope" />
                </span>
              </div>
              <input
                type="text"
                name="email"
                value={email}
                className="form-control"
                placeholder="Email"
                aria-label="Email"
                aria-describedby="basic-addon1"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="basic-addon2">
                  <FontAwesomeIcon icon="lock" />
                </span>
              </div>
              <input
                type="password"
                name="password"
                value={password}
                className="form-control"
                placeholder="Password"
                aria-label="Password"
                aria-describedby="basic-addon2"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button className="btn btn-primary btn-block" type="submit">
            Login
          </button>
        </form>
      </div>

      <div className="modal-center-footer">
        <div className="forgot-password">
          <span className="pr-2">or</span>
         <span className="span-as-link" onClick={() => props.modalSwitchHandler(ModalIdentifier.FORGOT_PASSWORD_MODAL)}>
         Forgot Password?
         </span>
        </div>

        <div className="signup-link">
          <span className="pr-2">Don't have an account?</span>
          <span
            className="span-as-link"
            onClick={() =>
              props.modalSwitchHandler(ModalIdentifier.SIGNUP_MODAL)
            }
          >
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Login);
