import React, { FormEvent, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ModalIdentifier,
  ISignupRequest,
  AlertVariant
} from "../../settings/DataTypes";
import Modal from "../../components/modal/Modal";
import AuthService from "../../services/AuthService";
import { RouteComponentProps, withRouter } from "react-router";
import { parseError } from "../../utils/errorParser";
import Flash from "../../components/flash/Flash";
import { ModalContext } from "../../contexts/ModalContext";

interface IProps extends RouteComponentProps {
  sideDrawerCloseHandler?: () => void;
}

const Signup: React.FunctionComponent<IProps> = props => {
  const authService = new AuthService();
  const modalContext = useContext(ModalContext);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handleSignUpSubmit = (e: FormEvent) => {
    e.preventDefault();
    let [firstName, ...rest] = fullName.split(" ");
    let lastName = rest.join(" ");

    let formData: ISignupRequest = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      confirmPassword: confirmPassword
    };
    authService
      .signup(formData)
      .then(resp => {
        props.history.push("/", {
          from: props.location,
          variant: AlertVariant.SUCCESS,
          message: "User Registration successfull. Please login to continue"
        });
        modalContext.closeModal();
        props.sideDrawerCloseHandler && props.sideDrawerCloseHandler();
      })
      .catch(error => {
        const errorMessages: string[] = parseError(error);
        setErrorMessages(errorMessages);
      });
  };

  const heading = "Signup and Start Learning!";
  let flashError: JSX.Element | undefined;
  if (errorMessages.length) {
    flashError = <Flash variant={AlertVariant.DANGER} errors={errorMessages} />;
  }
  return (
    <Modal heading={heading} modalType="regular" size="modal-md">
      <div className="auth-modal signup-modal">
        <div>
          <form onSubmit={handleSignUpSubmit}>
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
                  value={fullName}
                  placeholder="Full Name"
                  aria-label="Full Name"
                  aria-describedby="basic-addon1"
                  required
                  onChange={e => setFullName(e.target.value)}
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
                  value={email}
                  placeholder="Email"
                  aria-label="Email"
                  aria-describedby="basic-addon1"
                  required
                  onChange={e => setEmail(e.target.value)}
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
                  value={password}
                  placeholder="Password"
                  aria-label="Password"
                  aria-describedby="basic-addon2"
                  required
                  onChange={e => setPassword(e.target.value)}
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
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  aria-label="Confirm Password"
                  aria-describedby="basic-addon2"
                  required
                  onChange={e => setConfirmPassword(e.target.value)}
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
                  modalContext.switchModal(ModalIdentifier.LOGIN_MODAL)
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
};
export default withRouter(Signup);
