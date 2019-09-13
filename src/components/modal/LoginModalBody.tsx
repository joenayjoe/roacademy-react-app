import React, { Component, FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ApiManager from "../../dataManagers/ApiManager";

import "./LoginModalBody.css";
import Cookies from "universal-cookie";
import { ILoginRequest } from "../../settings/DataTypes";

interface IProps {
  showSignupModalHandler: () => void;
}
interface IStates {
  email: string;
  password: string;
}
class LoginModalBody extends Component<IProps, IStates> {
  private apiManager: ApiManager;
  constructor(props: IProps) {
    super(props);
    this.apiManager = new ApiManager();
  }
  state: IStates = {
    email: "",
    password: ""
  };

  handleLoginOnSubmit = (e: FormEvent) => {
    e.preventDefault();

    let formData: ILoginRequest = {
      email: this.state.email,
      password: this.state.password
    };
    this.apiManager
      .login(formData)
      .then(response => {
        const cookies = new Cookies();
        cookies.set("accessToken", response.data.accessToken, { path: "/" });
        cookies.set("tokenType", response.data.tokenType, { path: "/" });
        console.log("log in successfull");
      })
      .catch(error => {
        console.log("login failed", error.response.data);
      });
  };

  handleOnChange = (e: any) => {
    this.setState({ [e.currentTarget.name]: e.currentTarget.value } as IStates);
  };

  render() {
    return (
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
        <div className="dropdown-divider mt-3 mb-3"></div>
        <div>
          <form onSubmit={this.handleLoginOnSubmit}>
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
              onClick={this.props.showSignupModalHandler}
            >
              Sign Up
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginModalBody;
