import React, { useState, useEffect } from "react";
import { ICourse } from "../../settings/DataTypes";
import { CourseService } from "../../services/CourseService";
import { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SlickSlider from "../../components/slider/SlickSlider";
import SliderNextArrow from "../../components/slider/SliderNextArrow";
import SliderPrevArrow from "../../components/slider/SliderPrevArrow";

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
    initialSlide: courses.length ? 5 : 1,
    slidesToShow: courses.length ? 5 : 1,
    slidesToScroll: courses.length ? 5 : 1,
    nextArrow: <SliderNextArrow />,
    prevArrow: <SliderPrevArrow />,
    responsive: [
      {
        breakpoint: 769,
        settings: {
          slidesToShow: courses.length ? 3 : 1,
          slidesToScroll: courses.length ? 3 : 1,
          initialSlide: courses.length ? 3 : 1,
          swipeToSlide: true
        }
      }
    ]
  };

  useEffect(() => {
    if (!courses.length && props.categoryId) {
      courseService
        .getCoursesByCategoryId(props.categoryId.toString())
        .then(resp => {
          setCourses(resp.data);
        });
    }
    // eslint-disable-next-line
  }, []);

  const getCourses = () => {
    if (courses.length) {
      return courses.map((course: ICourse) => {
        return (
          <div
            className="card slick-card"
            key={course.id}
            onClick={() => handleCourseOnClick(course)}
          >
            <h5 className="slick-card-title">{course.name}</h5>
            <div className="card-body">
              <p className="card-text text-secondary">
                {course.createdBy.firstName + " " + course.createdBy.lastName}
              </p>
            </div>
          </div>
        );
      });
    }
    return <div className="alert alert-success">This has no courses yet</div>;
  };

  const handleCourseOnClick = (course: ICourse) => {
    props.history.push("/courses/" + course.id);
  };

  const mobileSider = (
    <div className="horizontal-scroll slider-xm">
      {props.title}
      <div className="horizontal-scroll-body">{getCourses()}</div>
    </div>
  );
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
      {mobileSider}
    </React.Fragment>
  );

  return <React.Fragment>{getCourseSlide}</React.Fragment>;
};
export default withRouter(CourseSlide);
