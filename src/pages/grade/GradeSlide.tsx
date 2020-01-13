import React, { useState, useEffect } from "react";
import { IGrade } from "../../settings/DataTypes";
import SlickSlider from "../../components/slider/SlickSlider";
import SliderNextArrow from "../../components/slider/SliderNextArrow";
import SliderPrevArrow from "../../components/slider/SliderPrevArrow";
import { Settings } from "react-slick";
import { withRouter, RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { BUILD_GRADE_URL } from "../../settings/Constants";
import { GradeService } from "../../services/GradeService";

interface IProps extends RouteComponentProps {
  title: string;
  categoryId?: number;
  grades?: IGrade[];
  href?: string;
}

const GradeSlide: React.FunctionComponent<IProps> = props => {
  const gradeService = new GradeService();

  const [grades, setGrade] = useState<IGrade[]>(
    props.grades ? props.grades : []
  );

  const settings: Settings = {
    arrows: true,
    infinite: false,
    speed: 300,
    initialSlide: grades.length ? 5 : 1,
    slidesToShow: grades.length ? 5 : 1,
    slidesToScroll: grades.length ? 5 : 1,
    rows: grades.length >= 10 ? 2 : 1,
    nextArrow: <SliderNextArrow />,
    prevArrow: <SliderPrevArrow />,
    responsive: [
      {
        breakpoint: 769,
        settings: {
          slidesToShow: grades.length ? 3 : 1,
          slidesToScroll: grades.length ? 3 : 1,
          initialSlide: grades.length ? 3 : 1,
          swipeToSlide: true,
          rows: grades.length >= 6 ? 2 : 1
        }
      }
    ]
  };

  useEffect(() => {
    if (!props.grades && props.categoryId) {
      gradeService.getGradesByCategoryId(props.categoryId).then(resp => {
        setGrade(resp.data);
      });
    }
    // eslint-disable-next-line
  }, []);

  const handleGradeOnClick = (grade: IGrade) => {
    const url = BUILD_GRADE_URL(grade.id);
    props.history.push(url);
  };

  const getGradeItemForSlide = () => {
    if (grades.length) {
      return grades.map(grade => {
        return (
          <div
            className="card slick-card"
            key={grade.id}
            onClick={() => handleGradeOnClick(grade)}
          >
            <div className="card-body">{grade.name}</div>
          </div>
        );
      });
    } else {
      return (
        <div className="alert alert-success">
          This category has no topics yet
        </div>
      );
    }
  };

  let gradeScrollClass = grades.length > 6 ? "grade-scroll" : "";

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
