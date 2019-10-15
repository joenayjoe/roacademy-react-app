import React, { Component } from "react";

interface IProps {
  styles: object;
  classNames?: string;
  avatarRef?: any;
}
class Avatar extends Component<IProps> {
  render() {
    return (
      <div
        className={`user-avatar ${this.props.classNames}`}
        style={this.props.styles}
        ref={this.props.avatarRef}
      >
        {this.props.children}
      </div>
    );
  }
}
export default Avatar;
