import React, { Component } from "react";
import "./Backdrop.css";
interface IProps {
  closeHandler(): void;
}
class Backdrop extends Component<IProps, {}> {
  backGroundClickHandler = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      this.props.closeHandler();
    }
  };

  render() {
    return (
      <div className="backdrop" onClick={e => this.backGroundClickHandler(e)}>
        {this.props.children}
      </div>
    );
  }
}

export default Backdrop;
