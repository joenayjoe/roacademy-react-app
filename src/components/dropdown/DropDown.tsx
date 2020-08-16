import React, { Component } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface iProps {
  showDropDown?: boolean;
  name?: string;
  id?: string;
  className?: string;
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
        className={`drop-down ${
          this.props.className ? this.props.className : ""
        } ${openKlass}`}
        onMouseEnter={this.props.handleMouseEnter}
      >
        <button
          className="btn btn-primary-outline drop-down-btn d-flex"
          ref={this.props.dropDownBtnRef}
        >
          {this.props.icon ? (
            <span className="ra-icon">
              <FontAwesomeIcon icon={this.props.icon} />
            </span>
          ) : null}
          {this.props.name ? <span>{this.props.name}</span> : null}
        </button>
        {this.props.children}
      </div>
    );
  }
}
export default DropDown;
