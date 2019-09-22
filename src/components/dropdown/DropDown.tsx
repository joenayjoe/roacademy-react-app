import React, { Component } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./DropDown.css";

interface iProps {
  name: string;
  showDropDown?: boolean;
  id?: string;
  icon?: IconProp;
  dropDownBtnRef?: any;
}

class DropDown extends Component<iProps, {}> {
  render() {

    let openKlass = this.props.showDropDown ? "open" : ""
    return (
      <div id={this.props.id} className={`drop-down ${openKlass}`}>
        <button className="btn btn-primary-outline nav-link drop-down-btn" ref={this.props.dropDownBtnRef}>
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
