import React, { useState, useEffect, useRef, useCallback } from "react";
import { ICourse, ResourceType } from "../../settings/DataTypes";
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
  // services
  const courseService = new CourseService();

  // states
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(0);

  const [lastSlideChange, setLastSlideChange] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasMore, setHasMore] = useState<boolean>(false);

  // refs
  const observer = useRef<IntersectionObserver>();

  const lastCourseCardElementRef = useCallback(
    node => {
      if (isLoading) {
        return;
      }

      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber(pageNumber => pageNumber + 1);
          loadMore();
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    // eslint-disable-next-line
    [isLoading, hasMore]
  );

  useEffect(() => {
    setIsLoading(true);
    if (props.sourceType === ResourceType.CATEGORY) {
      courseService
        .getCoursesByCategoryId(props.sourceId, pageNumber, 10)
        .then(resp => {
          setCourses(resp.data.content);
          if (resp.data.last) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
          setIsLoading(false);
        });
    } else if (props.sourceType === ResourceType.GRADE) {
      courseService
        .getCoursesByGradeId(props.sourceId, pageNumber, 10)
        .then(resp => {
          setCourses(resp.data.content);
          if (resp.data.last) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
          setIsLoading(false);
        });
    }
    // eslint-disable-next-line
  }, [props.sourceId, props.sourceType]);

  const loadMore = () => {
    setIsLoading(true);
    if (props.sourceType === ResourceType.CATEGORY) {
      courseService
        .getCoursesByCategoryId(props.sourceId, pageNumber + 1, 10)
        .then(resp => {
          setCourses([...courses].concat(resp.data.content));
          if (resp.data.last) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
          setIsLoading(false);
        });
    } else if (props.sourceType === ResourceType.GRADE) {
      courseService
        .getCoursesByGradeId(props.sourceId, pageNumber + 1, 10)
        .then(resp => {
          setCourses([...courses].concat(resp.data.content));
          if (resp.data.last) {
            setHasMore(false);
          } else {
            setHasMore(true);
          }
          setIsLoading(false);
        });
    }
  };
  const handleSlideChange = (current: number) => {
    if (lastSlideChange < current && hasMore) {
      loadMore();
      setLastSlideChange(current);
      setPageNumber(pageNumber => pageNumber + 1);
    }
  };

  const getCourses = () => {
    if (courses.length) {
      return courses.map((course: ICourse, index: number) => {
        if (courses.length === index + 1) {
          return (
            <Link
              key={course.id}
              to={BUILD_COURSE_URL(course.id)}
              onClick={e => handleCourseOnClick(e, course)}
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
        }
      });
    }
    return <div className="alert alert-success">This has no courses yet</div>;
  };

  const handleCourseOnClick = (e: React.MouseEvent, course: ICourse) => {
    e.preventDefault();
    props.history.push(BUILD_COURSE_URL(course.id));
  };

  const mobileSlider = (
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
    slidesToShow: courses.length ? 5 : 1,
    slidesToScroll: courses.length ? 5 : 1,
    nextArrow: <SliderNextArrow />,
    prevArrow: <SliderPrevArrow />,
    afterChange: current => handleSlideChange(current),
    responsive: [
      {
        breakpoint: 769,
        settings: {
          initialSlide: 0,
          slidesToShow: courses.length ? 3 : 1,
          slidesToScroll: courses.length ? 3 : 1,
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
      {mobileSlider}
    </React.Fragment>
  );

  return <React.Fragment>{getCourseSlide}</React.Fragment>;
};
export default withRouter(CourseSlide);
