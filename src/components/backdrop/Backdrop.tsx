import React from "react";
import "./Backdrop.css";
interface IProps {
  closeHandler(): void;
  className?: string;
}
const Backdrop: React.FunctionComponent<IProps> = props => {
  const backGroundClickHandler = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.closeHandler();
    }
  };

  let klass = props.className ? props.className : "";

  return (
    <div
      className={`backdrop ${klass}`}
      onClick={e => backGroundClickHandler(e)}
    >
      {props.children}
    </div>
  );
};

export default Backdrop;
