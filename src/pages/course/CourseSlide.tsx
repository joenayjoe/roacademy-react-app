import React, { useRef, useCallback } from "react";
import { ICourse } from "../../settings/DataTypes";
import { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SlickSlider from "../../components/slider/SlickSlider";
import SliderNextArrow from "../../components/slider/SliderNextArrow";
import SliderPrevArrow from "../../components/slider/SliderPrevArrow";

import { withRouter, RouteComponentProps } from "react-router";
import { BUILD_COURSE_URL } from "../../settings/Constants";
import { Link } from "react-router-dom";

interface IProps extends RouteComponentProps {
  courses: ICourse[];
  slideAfterChangeHandler: (currentSlide: number) => void;
  loadNextPage: () => void;
  hasMore: boolean;
  title?: string;
  href?: string;
}

const CourseSlide: React.FunctionComponent<IProps> = (props) => {
  // refs
  const observer = useRef<IntersectionObserver>();

  const lastCourseCardElementRef = useCallback(
    (node) => {
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && props.hasMore) {
          props.loadNextPage();
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    // eslint-disable-next-line
    [props.hasMore]
  );

  const getCourses = () => {
    if (props.courses.length) {
      return props.courses.map((course: ICourse, index: number) => {
        if (props.courses.length === index + 1) {
          return (
            <Link
              key={course.id}
              to={BUILD_COURSE_URL(course.id)}
              onClick={(e) => handleCourseOnClick(e, course)}
              ref={lastCourseCardElementRef}
            >
              <div className="card slick-card">
                <div className="card-body slick-card-title">
                  <h5 className="card-title">{course.name}</h5>
                </div>
                <div className="card-footer text-secondary">
                  {course.createdBy.firstName + " " + course.createdBy.lastName}
                </div>
              </div>
            </Link>
          );
        } else {
          return (
            <Link
              key={course.id}
              to={BUILD_COURSE_URL(course.id)}
              onClick={(e) => handleCourseOnClick(e, course)}
            >
              <div className="card slick-card">
                <div className="card-body slick-card-title">
                  <h5 className="card-title">{course.name}</h5>
                </div>
                <div className="card-footer text-secondary">
                  {course.createdBy.firstName + " " + course.createdBy.lastName}
                </div>
              </div>
            </Link>
          );
        }
      });
    }
    return <div className="alert alert-success">This has no courses yet</div>;
  };

  const handleCourseOnClick = (e: React.MouseEvent, course: ICourse) => {
    e.preventDefault();
    props.history.push(BUILD_COURSE_URL(course.id));
  };

  let title = <h5 className="horizonta-scroll-header">{props.title}</h5>;
  if (props.href) {
    title = <Link to={props.href}>{title}</Link>;
  }

  const mobileSlider = (
    <div className="horizontal-scroll slider-xm">
      {title}
      <div className="horizontal-scroll-body">{getCourses()}</div>
    </div>
  );

  const settings: Settings = {
    arrows: true,
    infinite: false,
    speed: 300,
    initialSlide: 0,
    slidesToShow: props.courses.length ? 5 : 1,
    slidesToScroll: props.courses.length ? 5 : 1,
    nextArrow: <SliderNextArrow />,
    prevArrow: <SliderPrevArrow />,
    afterChange: (current) => props.slideAfterChangeHandler(current),
    responsive: [
      {
        breakpoint: 769,
        settings: {
          initialSlide: 0,
          slidesToShow: props.courses.length ? 3 : 1,
          slidesToScroll: props.courses.length ? 3 : 1,
          swipeToSlide: true,
        },
      },
    ],
  };

  const getCourseSlide = (
    <React.Fragment>
      <SlickSlider
        settings={settings}
        title={props.title}
        href={props.href}
        className="slider-lg"
      >
        {getCourses()}
      </SlickSlider>
      {mobileSlider}
    </React.Fragment>
  );

  return <React.Fragment>{getCourseSlide}</React.Fragment>;
};
export default withRouter(CourseSlide);
