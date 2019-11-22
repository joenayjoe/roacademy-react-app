import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IProps {
  onClick?: () => void;
  style?: any;
  className? :any;
}
class SliderNextArrow extends Component<IProps> {
  render() {
    return (
      <button
        className={`btn btn-secondary ${this.props.className}`}
        style={this.props.style}
        onClick={this.props.onClick}
      >
        <FontAwesomeIcon icon="angle-right" />
      </button>
    );
  }
}
export default SliderNextArrow;
