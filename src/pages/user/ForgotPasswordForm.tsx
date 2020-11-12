import React, { FormEvent, useContext, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";

interface IProps {
  closeHandler: () => void;
}

const ForgotPasswordForm: React.FunctionComponent<IProps> = (props) => {
  const authContext = useContext(AuthContext);

  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: implement form submit logic
    setMessage(
      "We sent a password reset link to your email. Please check you email and open the link to reset a new passport within 24hrs."
    );
  };

  let modalBody = (
    <form onSubmit={handleFormSubmit}>
      <div className="form-group">
        <label>Enter your email to reset password</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          autoFocus={true}
        />
      </div>

      <div className="form-group action-btn-group">
        <button
          type="button"
          className="btn btn-danger action-btn btn-sm"
          onClick={props.closeHandler}
        >
          CANCEL
        </button>
        <button type="submit" className="btn btn-primary action-btn btn-sm">
          RESET PASSWORD
        </button>
      </div>
    </form>
  );

  if (message.length > 0) {
    modalBody = <p>{message}</p>;
  }

  return <div>{modalBody}</div>;
};
export default ForgotPasswordForm;
