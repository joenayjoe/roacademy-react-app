import React from "react";

interface IProp {
  className?: string;
}

const EditComment: React.FunctionComponent<IProp> = (props) => {
  return (
    <div
      className={`edit-comment-form-wrapper ${
        props.className ? props.className : ""
      }`}
    >
      This is Edit form
    </div>
  );
};
export default EditComment;
