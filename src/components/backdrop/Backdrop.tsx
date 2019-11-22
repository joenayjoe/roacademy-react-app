import React from "react";
import "./Backdrop.css";
interface IProps {
  closeHandler(): void;
}
const Backdrop: React.FunctionComponent<IProps> = props => {
  const backGroundClickHandler = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.closeHandler();
    }
  };

  return (
    <div className="backdrop" onClick={e => backGroundClickHandler(e)}>
      {props.children}
    </div>
  );
};

export default Backdrop;
