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
import { BUILD_COURSE_URL } from "../../settings/Constants";
import { Link } from "react-router-dom";

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
          <Link
            key={course.id}
            to={BUILD_COURSE_URL(course.id)}
            onClick={e => handleCourseOnClick(e, course)}
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
      });
    }
    return <div className="alert alert-success">This has no courses yet</div>;
  };

  const handleCourseOnClick = (e: React.MouseEvent, course: ICourse) => {
    e.preventDefault();
    props.history.push(BUILD_COURSE_URL(course.id));
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
