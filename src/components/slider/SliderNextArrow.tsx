import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IProps {
  onClick?: () => void;
  style?: any;
  className?: any;
}

const SliderNextArrow: React.FunctionComponent<IProps> = props => {
  return (
    <button
      className={`btn btn-secondary ${props.className}`}
      style={props.style}
      onClick={props.onClick}
    >
      <FontAwesomeIcon icon="angle-right" />
    </button>
  );
};
export default SliderNextArrow;
