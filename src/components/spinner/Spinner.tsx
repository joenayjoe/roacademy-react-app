import React, { Component } from "react";

import "./Spinner.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SizeProp } from "@fortawesome/fontawesome-svg-core";

interface IProps {
  classNames?: string;
  size?:SizeProp;
}
class Spinner extends Component<IProps> {
  render() {
    let size = this.props.size ? this.props.size : "2x";
    return (
      <div className={`spinner ${this.props.classNames}`}>
        <FontAwesomeIcon icon="circle-notch" spin size={size} />
      </div>
    );
  }
}
export default Spinner;
