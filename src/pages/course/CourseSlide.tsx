import React, { useState, useEffect } from "react";
import { ICourse } from "../../settings/DataTypes";
import { CourseService } from "../../services/CourseService";
import { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SlickSlider from "../../components/slider/SlickSlider";
import SliderNextArrow from "../../components/slider/SliderNextArrow";
import SliderPrevArrow from "../../components/slider/SliderPrevArrow";

import { isMobileOnly } from "react-device-detect";
import { withRouter, RouteComponentProps } from "react-router";

interface IProps extends RouteComponentProps {
  title: string;
  categoryId?: number;
  courses?: ICourse[];
  href?: string;
}

const CourseSlide: React.FunctionComponent<IProps> = props => {
  const courseService = new CourseService();
  const [courses, setCourses] = useState<ICourse[]>(
    props.courses ? props.courses : []
  );

  const settings: Settings = {
    arrows: true,
    infinite: false,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 5,
    nextArrow: <SliderNextArrow />,
    prevArrow: <SliderPrevArrow />,
    responsive: [
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 3,
          swipeToSlide: true
        }
      }
    ]
  };

  useEffect(() => {
    if (!courses.length && props.categoryId) {
      courseService.getCoursesByCategoryId(props.categoryId).then(resp => {
        setCourses(resp.data);
      });
    }
    // eslint-disable-next-line
  }, []);

  const getCourses = () => {
    return courses.map((course: ICourse) => {
      return (
        <div
          className="card slick-card"
          key={course.id}
          onClick={() => handleCourseOnClick(course)}
        >
          <h5 className="slick-card-title">{course.name}</h5>
          <div className="card-body">
            <p className="card-text text-secondary">Author name here</p>
          </div>
        </div>
      );
    });
  };

  const handleCourseOnClick = (course: ICourse) => {
    props.history.push("/courses/" + course.id);  
  };

  const getCourseSlide = () => {
    if (isMobileOnly) {
      const courseItems: JSX.Element = (
        <div className="horizontal-scroll-body">{getCourses()}</div>
      );
      return (
        <div className="horizontal-scroll">
          {props.title}
          {courses.length > 0 ? courseItems : null}
        </div>
      );
    } else {
      return (
        <SlickSlider settings={settings} title={props.title} href={props.href}>
          {getCourses()}
        </SlickSlider>
      );
    }
  };

  return <React.Fragment>{getCourseSlide()}</React.Fragment>;
};
export default withRouter(CourseSlide);
