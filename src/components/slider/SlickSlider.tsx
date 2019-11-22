import React, { Component } from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface IProps {
  title: string;
  settings: Settings;
}
class SlickSlider extends Component<IProps> {
  render() {
    return (
      <div>
        <h5>{this.props.title}</h5>
        <Slider {...this.props.settings}>{this.props.children}</Slider>
      </div>
    );
  }
}
export default SlickSlider;
