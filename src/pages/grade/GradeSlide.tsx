import React, { useState, useEffect } from "react";
import { IGrade } from "../../settings/DataTypes";
import SlickSlider from "../../components/slider/SlickSlider";
import SliderNextArrow from "../../components/slider/SliderNextArrow";
import SliderPrevArrow from "../../components/slider/SliderPrevArrow";
import { Settings } from "react-slick";
import { withRouter, RouteComponentProps } from "react-router";
import { isMobileOnly } from "react-device-detect";
import { Link } from "react-router-dom";
import { CategoryService } from "../../services/CategoryService";
import { BUILD_GRADE_URL } from "../../settings/Constants";

interface IProps extends RouteComponentProps {
  title: string;
  categoryId?: number;
  grades?: IGrade[];
  href?: string;
}

const GradeSlide: React.FunctionComponent<IProps> = props => {
  const categoryService = new CategoryService();

  const [grades, setGrade] = useState<IGrade[]>(
    props.grades ? props.grades : []
  );

  const settings: Settings = {
    arrows: true,
    infinite: false,
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 5,
    rows: props.grades && props.grades.length >= 10 ? 2 : 1,
    nextArrow: <SliderNextArrow />,
    prevArrow: <SliderPrevArrow />,
    responsive: [
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 3,
          swipeToSlide: true,
          rows: props.grades && props.grades.length >= 6 ? 2 : 1
        }
      }
    ]
  };

  useEffect(() => {
    if (!props.grades && props.categoryId) {
      categoryService.getGradesForCategory(props.categoryId).then(resp => {
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
  };

  let gradeScrollClass = grades.length > 6 ? "grade-scroll" : "";
  let gradeSlide: JSX.Element;
  const gradeItems: JSX.Element = (
    <div className={`horizontal-scroll-body ${gradeScrollClass}`}>
      {getGradeItemForSlide()}
    </div>
  );
  if (isMobileOnly) {
    let title = <h6 className="horizonta-scroll-header">{props.title}</h6>;
    if (props.href) {
      title = <Link to={props.href}>{title}</Link>;
    }

    gradeSlide = (
      <div className="horizontal-scroll">
        {title}
        {grades.length > 0 ? gradeItems : null}
      </div>
    );
  } else {
    gradeSlide = (
      <SlickSlider settings={settings} title={props.title} href={props.href}>
        {getGradeItemForSlide()}
      </SlickSlider>
    );
  }

  return <React.Fragment>{gradeSlide}</React.Fragment>;
};
export default withRouter(GradeSlide);
