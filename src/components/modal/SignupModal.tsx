import React, { Component, FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ModalIdentifier,
  ISignupRequest,
  AlertVariant
} from "../../settings/DataTypes";
import Modal from "./Modal";
import AuthService from "../../services/AuthService";
import { RouteComponentProps, withRouter } from "react-router";
import { parseError } from "../../utils/errorParser";
import Flash from "../flash/Flash";

interface IProps extends RouteComponentProps {
  showLoginModalHandler: (identifier: ModalIdentifier) => void;
  closeHandler: () => void;
}

interface IStates {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  errorMessages: string[];
}
class SignupModal extends Component<IProps, IStates> {
  private authService: AuthService;

  constructor(props: IProps) {
    super(props);
    this.authService = new AuthService();
  }
  state: IStates = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    errorMessages: []
  };

  handleSignUpSubmit = (e: FormEvent) => {
    e.preventDefault();
    let [firstName, ...rest] = this.state.fullName.split(" ");
    let lastName = rest.join(" ");

    let formData: ISignupRequest = {
      firstName: firstName,
      lastName: lastName,
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword
    };
    this.authService
      .signup(formData)
      .then(resp => {
        this.props.closeHandler();
        this.props.history.push("/", {
          from: this.props.location,
          variant: AlertVariant.SUCCESS,
          message: "User Registration successfull. Please login to continue"
        });
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
    const heading = "Signup and Start Learning!";
    let flashError: JSX.Element | undefined;
    if (this.state.errorMessages.length) {
      flashError = (
        <Flash
          variant={AlertVariant.DANGER}
          errors={this.state.errorMessages}
        />
      );
    }
    return (
      <Modal
        heading={heading}
        modalType="regular"
        size="modal-md"
        closeHandler={this.props.closeHandler}
      >
        <div className="auth-modal signup-modal">
          <div>
            <form onSubmit={this.handleSignUpSubmit}>
              {flashError}
              <div className="form-group">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">
                      <FontAwesomeIcon icon="user" />
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    name="fullName"
                    value={this.state.fullName}
                    placeholder="Full Name"
                    aria-label="Full Name"
                    aria-describedby="basic-addon1"
                    required
                    autoFocus
                    onChange={e => this.handleOnChange(e)}
                  />
                </div>
              </div>
              <div className="form-group">
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="basic-addon1">
                      <FontAwesomeIcon icon="envelope" />
                    </span>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    name="email"
                    value={this.state.email}
                    placeholder="Email"
                    aria-label="Email"
                    aria-describedby="basic-addon1"
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
                    className="form-control"
                    name="password"
                    value={this.state.password}
                    placeholder="Password"
                    aria-label="Password"
                    aria-describedby="basic-addon2"
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
                    className="form-control"
                    name="confirmPassword"
                    value={this.state.confirmPassword}
                    placeholder="Confirm Password"
                    aria-label="Confirm Password"
                    aria-describedby="basic-addon2"
                    required
                    onChange={e => this.handleOnChange(e)}
                  />
                </div>
              </div>
              <button className="btn btn-primary btn-block" type="submit">
                Sign Up
              </button>
            </form>
          </div>
          <div className="modal-center-footer">
            <div>
              <small className="small-text">
                By signing up, you agree to our <a href="/">Terms of Use</a> and{" "}
                <a href="/">Privacy Policy</a>.
              </small>

              <div className="dropdown-divider mt-3 mb-2"></div>

              <div>
                <span className="pr-2">Already have an account?</span>
                <span
                  className="span-as-link"
                  onClick={() =>
                    this.props.showLoginModalHandler(
                      ModalIdentifier.LOGIN_MODAL
                    )
                  }
                >
                  Log In
                </span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
export default withRouter(SignupModal);
