import React from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from "react-router-dom";

interface IProps {
  title: string;
  settings: Settings;
  href?: string;
  className?: string;
}
const SlickSlider: React.FunctionComponent<IProps> = props => {
  let title = <h5>{props.title}</h5>;
  if (props.href) {
    title = (
      <Link to={props.href}>
        <h5>{props.title}</h5>
      </Link>
    );
  }
  return (
    <div className={props.className ? props.className : ""}>
      {title}
      <Slider {...props.settings}>{props.children}</Slider>
    </div>
  );
};
export default SlickSlider;
