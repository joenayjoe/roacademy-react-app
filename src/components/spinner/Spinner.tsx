import React from "react";

import "./Spinner.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SizeProp } from "@fortawesome/fontawesome-svg-core";

interface IProps {
  classNames?: string;
  size?: SizeProp;
}
const Spinner: React.FunctionComponent<IProps> = (props) => {
  let size = props.size ? props.size : "2x";
  return (
    <div className={`spinner ${props.classNames ? props.classNames : ""}`}>
      <FontAwesomeIcon icon="circle-notch" spin size={size} color="#9FA2A2" />
    </div>
  );
};
export default Spinner;
