import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IProps {
  onClikHandler: () => void;
  id?: string;
  classNames?: string;
}

class ToggleBar extends Component<IProps, {}> {
  render() {
    return (
      <div className={`nav-item toggler ${this.props.classNames}`} id={this.props.id}>
        <button className="btn btn-primary-outline" onClick={this.props.onClikHandler}>
          <FontAwesomeIcon icon="bars" size="lg"/>
        </button>
      </div>
    );
  }
}

export default ToggleBar;
