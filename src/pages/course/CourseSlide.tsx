import React, { useState, useEffect } from "react";
import { ICourse, ResourceType, Page } from "../../settings/DataTypes";
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
  sourceId: number;
  sourceType: ResourceType;
  title?: string;
  href?: string;
}

const CourseSlide: React.FunctionComponent<IProps> = props => {
  const courseService = new CourseService();
  const [coursePage, setCoursePage] = useState<Page<ICourse> | null>(null);

  const [lastSlideChange, setLastSlideChange] = useState<number>(0);

  useEffect(() => {
    if (props.sourceType === ResourceType.CATEGORY) {
      courseService.getCoursesByCategoryId(props.sourceId, 0, 10).then(resp => {
        setCoursePage(resp.data);
      });
    } else if (props.sourceType === ResourceType.GRADE) {
      courseService.getCoursesByGradeId(props.sourceId, 0, 10).then(resp => {
        setCoursePage(resp.data);
      });
    }
    // eslint-disable-next-line
  }, []);

  const handleSlideChange = (current: number) => {
    if (coursePage === null) {
      return;
    }

    if (lastSlideChange < current && current % 5 === 0) {
      if (props.sourceType === ResourceType.CATEGORY) {
        courseService
          .getCoursesByCategoryId(props.sourceId, coursePage.number + 1, 10)
          .then(resp => {
            let newPage: Page<ICourse> = {
              ...coursePage,
              number: coursePage.number + 1,
              content: coursePage.content.concat(resp.data.content)
            };
            setCoursePage(newPage);
          });
      } else if (props.sourceType === ResourceType.GRADE) {
        courseService
          .getCoursesByGradeId(props.sourceId, coursePage.number + 1, 10)
          .then(resp => {
            let newPage: Page<ICourse> = {
              ...coursePage,
              number: coursePage.number + 1,
              content: coursePage.content.concat(resp.data.content)
            };
            setCoursePage(newPage);
          });
      }
      setLastSlideChange(current);
    }
  };

  const getCourses = () => {
    if (coursePage && coursePage.content.length) {
      return coursePage.content.map((course: ICourse) => {
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

  const settings: Settings = {
    arrows: true,
    infinite: false,
    speed: 300,
    initialSlide: 0,
    slidesToShow: coursePage && coursePage.content.length ? 5 : 1,
    slidesToScroll: coursePage && coursePage.content.length ? 5 : 1,
    nextArrow: <SliderNextArrow />,
    prevArrow: <SliderPrevArrow />,
    afterChange: current => handleSlideChange(current),
    responsive: [
      {
        breakpoint: 769,
        settings: {
          initialSlide: 0,
          slidesToShow: coursePage && coursePage.content.length ? 3 : 1,
          slidesToScroll: coursePage && coursePage.content.length ? 3 : 1,
          swipeToSlide: true
        }
      }
    ]
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
      {mobileSider}
    </React.Fragment>
  );

  return <React.Fragment>{getCourseSlide}</React.Fragment>;
};
export default withRouter(CourseSlide);
