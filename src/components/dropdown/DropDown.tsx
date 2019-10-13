import React, { Component } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./DropDown.css";

interface iProps {
  name: string;
  showDropDown?: boolean;
  id?: string;
  classNames?: string;
  icon?: IconProp;
  dropDownBtnRef?: any;
  handleMouseEnter?(): void;
}

class DropDown extends Component<iProps, {}> {
  render() {
    let openKlass = this.props.showDropDown ? "open" : "";
    return (
      <div
        id={this.props.id}
        className={`drop-down ${this.props.classNames} ${openKlass}`}
        onMouseEnter={this.props.handleMouseEnter}
      >
        <button
          className="btn btn-primary-outline drop-down-btn"
          ref={this.props.dropDownBtnRef}
        >
          {this.props.icon ? (
            <span className="ra-icon">
              <FontAwesomeIcon icon={this.props.icon} />
            </span>
          ) : null}
          {this.props.name}
        </button>
        {this.props.children}
      </div>
    );
  }
}
export default DropDown;
