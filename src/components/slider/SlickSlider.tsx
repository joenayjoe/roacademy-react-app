import React from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

interface IProps {
  title: string;
  settings: Settings;
  href?: string;
}
const SlickSlider: React.FunctionComponent<IProps> = props => {
  let title = <h5>{props.title}</h5>;
  if (props.href) {
    title = (
      <Link to={props.href}>
        <h6>{props.title}</h6>
      </Link>
    );
  }
  return (
    <div>
      {title}
      <Slider {...props.settings}>{props.children}</Slider>
    </div>
  );
};
export default SlickSlider;
