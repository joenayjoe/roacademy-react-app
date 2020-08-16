import React, { useState, useContext, FormEvent } from "react";
import Avatar from "../avatar/Avatar";
import { AuthContext } from "../../contexts/AuthContext";

interface IProp {
  commentBody: string;
  onSubmit: (text: string) => void;
  onCancel?: () => void;
  autoFocus?: boolean;
  className?: string;
}

const NewComment: React.FunctionComponent<IProp> = (props) => {
  const authContext = useContext(AuthContext);
  const avatarStyle = { width: "48px", height: "48px", cursor: "pointer" };
  const [commentBody, setCommentBody] = useState<string>(props.commentBody);

  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();
    props.onSubmit(commentBody);
  };
  const handleOnCancle = (e: FormEvent) => {
    e.preventDefault();
    setCommentBody("");
    if (props.onCancel) {
      props.onCancel();
    }
  };
  return (
    <div
      className={`new-comment d-flex flex-row ${
        props.className ? props.className : ""
      }`}
    >
      <div className="avatar mr-2">
        <Avatar
          user={authContext.currentUser ? authContext.currentUser : null}
          styles={avatarStyle}
        />
      </div>
      <form className="comment-form flex-fill" onSubmit={handleOnSubmit}>
        <div className="form-group">
          <textarea
            className="form-control"
            value={commentBody}
            placeholder="Add a public comment"
            onChange={(e) => setCommentBody(e.target.value)}
            autoFocus={props.autoFocus ? true : false}
            required={true}
          />
        </div>
        <div className="form-group float-right">
          <button
            type="button"
            className="btn btn-danger btn-sm mr-2"
            onClick={handleOnCancle}
          >
            CANCEL
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            COMMENT
          </button>
        </div>
      </form>
    </div>
  );
};
export default NewComment;
