import React, { Component, FormEvent, ContextType } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./LoginModal.css";
import { ILoginRequest, ModalIdentifier } from "../../settings/DataTypes";
import Modal from "./Modal";
import { withRouter, RouteComponentProps } from "react-router";
import { parseError } from "../../utils/errorParser";
import ErrorFlash from "../flash/ErrorFlash";
import AuthService from "../../services/AuthService";
import { AuthContext } from "../../contexts/AuthContext";

interface IProps extends RouteComponentProps {
  showSignupModalHandler: (modalIdentifier: ModalIdentifier) => void;
  closeHandler: () => void;
}
interface IStates {
  email: string;
  password: string;
  errorMessages: string[];
}
class LoginModal extends Component<IProps, IStates> {
  private authService: AuthService;
  static contextType = AuthContext;
  context!: ContextType<typeof AuthContext>;

  constructor(props: IProps) {
    super(props);
    this.authService = new AuthService();
  }

  state: IStates = {
    email: "",
    password: "",
    errorMessages: []
  };

  handleLoginOnSubmit = (e: FormEvent) => {
    e.preventDefault();

    let formData: ILoginRequest = {
      email: this.state.email,
      password: this.state.password
    };
    this.authService
      .login(formData)
      .then(response => {
        this.authService.setAuthCookies(
          response.data.accessToken,
          response.data.tokenType
        );
        this.props.closeHandler();
        this.context && this.context.updateAuthContext();
        this.props.history.push("/dashboard");
      })
      .catch(error => {
        const errorMessages: string[] = parseError(error);
        this.setState({ errorMessages: errorMessages });
      });
  };

  handleOnChange = (e: any) => {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value } as IStates);
  };

  render() {
    const heading = "Login to Your Account";
    let flashError: JSX.Element | undefined;
    if (this.state.errorMessages.length) {
      flashError = <ErrorFlash errors={this.state.errorMessages} />;
    }
    return (
      <Modal
        heading={heading}
        size="modal-md"
        modalType="regular"
        closeHandler={this.props.closeHandler}
      >
        <div className="auth-modal login-modal">
          <div className="social-login">
            <div className="social-btn facebook-login">
              <a href="/">
                <span>
                  <FontAwesomeIcon
                    icon={["fab", "facebook-f"]}
                    className="ra-icon"
                    size="2x"
                  />
                </span>
                <span className="pl-2">Contnue with Facebook</span>
              </a>
            </div>
            <div className="social-btn google-login">
              <a href="/">
                <span>
                  <FontAwesomeIcon
                    icon={["fab", "google"]}
                    className="ra-icon"
                    size="lg"
                  />
                </span>
                <span className="pl-2">Contnue with Google</span>
              </a>
            </div>
          </div>
          <div className="dropdown-divider"></div>
          <div>
            <form onSubmit={this.handleLoginOnSubmit}>
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
                    value={this.state.email}
                    className="form-control"
                    placeholder="Email"
                    aria-label="Email"
                    aria-describedby="basic-addon1"
                    autoFocus
                    required
                    onChange={e => this.handleOnChange(e)}
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
                    value={this.state.password}
                    className="form-control"
                    placeholder="Password"
                    aria-label="Password"
                    aria-describedby="basic-addon2"
                    required
                    onChange={e => this.handleOnChange(e)}
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
              <a href="/">Forgot Password?</a>
            </div>

            <div className="signup-link">
              <span className="pr-2">Don't have an account?</span>
              <span
                className="span-as-link"
                onClick={() =>
                  this.props.showSignupModalHandler(
                    ModalIdentifier.SIGNUP_MODAL
                  )
                }
              >
                Sign Up
              </span>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default withRouter(LoginModal);
