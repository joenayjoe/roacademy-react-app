import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./DrawerToggleButton.css";

interface DrawerToggleButtonProps {
  onClikHandler: () => void;
}

class DrawerToggleButton extends Component<DrawerToggleButtonProps, any> {
  render() {
    return (
      <div className="nav-item" id="drawer-toggler">
        <button className="btn btn-primary-outline" onClick={this.props.onClikHandler}>
          <FontAwesomeIcon icon="bars" size="lg"/>
        </button>
      </div>
    );
  }
}

export default DrawerToggleButton;
