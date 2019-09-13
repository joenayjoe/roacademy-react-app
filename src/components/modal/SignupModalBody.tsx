import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IProps {
  showLoginModalHandler: () => void;
}
class SignupModalBody extends Component<IProps, {}> {
  render() {

    return (
      <div className="auth-modal signup-modal">
        <div>
          <form>
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
                  placeholder="Full Name"
                  aria-label="Full Name"
                  aria-describedby="basic-addon1"
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
                  placeholder="Email"
                  aria-label="Email"
                  aria-describedby="basic-addon1"
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
                  placeholder="Password"
                  aria-label="Password"
                  aria-describedby="basic-addon2"
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
              <span className="pr-2">Alredy have an account?</span>
              <span
                className="span-as-link"
                onClick={this.props.showLoginModalHandler}
              >
                Log In
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default SignupModalBody;
