import React, { useRef, useCallback } from "react";
import { IGrade } from "../../settings/DataTypes";
import SlickSlider from "../../components/slider/SlickSlider";
import SliderNextArrow from "../../components/slider/SliderNextArrow";
import SliderPrevArrow from "../../components/slider/SliderPrevArrow";
import { Settings } from "react-slick";
import { withRouter, RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { BUILD_GRADE_URL } from "../../settings/Constants";

interface IProps extends RouteComponentProps {
  grades: IGrade[];
  hasMore: boolean;
  loadNextPage: () => void;
  slideAfterChangeHandler: (current: number) => void;
  title?: string;
  href?: string;
}

const GradeSlide: React.FunctionComponent<IProps> = props => {
  // refs
  const observer = useRef<IntersectionObserver>();

  const lastGradeCardElementRef = useCallback(
    node => {
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver(entries => {
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

  const handleGradeOnClick = (e: React.MouseEvent, grade: IGrade) => {
    e.preventDefault();
    const url = BUILD_GRADE_URL(grade.id);
    props.history.push(url);
  };

  const getGradeItemForSlide = () => {
    if (props.grades.length) {
      return props.grades.map((grade, index) => {
        if (props.grades.length === index + 1) {
          return (
            <Link
              key={grade.id}
              to={BUILD_GRADE_URL(grade.id)}
              onClick={e => handleGradeOnClick(e, grade)}
              ref={lastGradeCardElementRef}
            >
              <div className="card slick-card">
                <div className="card-body">{grade.name}</div>
              </div>
            </Link>
          );
        } else {
          return (
            <Link
              key={grade.id}
              to={BUILD_GRADE_URL(grade.id)}
              onClick={e => handleGradeOnClick(e, grade)}
            >
              <div className="card slick-card">
                <div className="card-body">{grade.name}</div>
              </div>
            </Link>
          );
        }
      });
    } else {
      return <div className="alert alert-success">This has no topics yet</div>;
    }
  };

  let gradeScrollClass = props.grades.length > 6 ? "grade-scroll" : "";

  const gradeItemsMobile: JSX.Element = (
    <div className={`horizontal-scroll-body ${gradeScrollClass}`}>
      {getGradeItemForSlide()}
    </div>
  );

  let title = <h5 className="horizonta-scroll-header">{props.title}</h5>;
  if (props.href) {
    title = <Link to={props.href}>{title}</Link>;
  }

  const gradeSlideMobile = (
    <div className="horizontal-scroll slider-xm">
      {title}
      {gradeItemsMobile}
    </div>
  );

  const settings: Settings = {
    arrows: true,
    infinite: false,
    speed: 300,
    initialSlide: 0,
    slidesToShow: props.grades.length ? 5 : 1,
    slidesToScroll: props.grades.length ? 5 : 1,
    rows: props.grades.length >= 10 ? 2 : 1,
    nextArrow: <SliderNextArrow />,
    prevArrow: <SliderPrevArrow />,
    afterChange: current => props.slideAfterChangeHandler(current),
    responsive: [
      {
        breakpoint: 769,
        settings: {
          slidesToShow: props.grades.length ? 3 : 1,
          slidesToScroll: props.grades.length ? 3 : 1,
          initialSlide: props.grades.length ? 3 : 1,
          swipeToSlide: true,
          rows: props.grades.length >= 6 ? 2 : 1
        }
      }
    ]
  };

  const gradeSlide = (
    <React.Fragment>
      <SlickSlider
        settings={settings}
        title={props.title}
        href={props.href}
        className="slider-lg"
      >
        {getGradeItemForSlide()}
      </SlickSlider>
      {gradeSlideMobile}
    </React.Fragment>
  );

  return <React.Fragment>{gradeSlide}</React.Fragment>;
};
export default withRouter(GradeSlide);
