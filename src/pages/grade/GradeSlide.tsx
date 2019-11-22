import React, { Component } from "react";
import { IGrade } from "../../settings/DataTypes";
import { GradeService } from "../../services/GradeService";
import SlickSlider from "../../components/slider/SlickSlider";
import SliderNextArrow from "../../components/slider/SliderNextArrow";
import SliderPrevArrow from "../../components/slider/SliderPrevArrow";
import { Settings } from "react-slick";
import { withRouter, RouteComponentProps } from "react-router";
import { isMobileOnly } from "react-device-detect";

interface IProps extends RouteComponentProps {
  title: string;
  categoryId?: number;
  grades?: IGrade[];
}

interface IState {
  grades: IGrade[];
}
class GradeSlide extends Component<IProps, IState> {
  private gradeService: GradeService;
  constructor(props: IProps) {
    super(props);
    this.gradeService = new GradeService();
  }

  state = { grades: this.props.grades ? this.props.grades : [] };

  componentDidMount() {
    if (this.props.categoryId) {
      this.gradeService
        .getGradesForCategory(this.props.categoryId)
        .then(resp => {
          this.setState({ grades: resp.data });
        });
    }
  }

  handleGradeOnClick = (grade: IGrade) => {
    const url = "/categories/" + grade.categoryId + "/grades/" + grade.id;
    this.props.history.push(url);
  };

  getGradeItemForSlide = () => {
    return this.state.grades.map(grade => {
      return (
        <div
          className="card slick-item"
          key={grade.id}
          onClick={() => this.handleGradeOnClick(grade)}
        >
          <div className="card-body">{grade.name}</div>
        </div>
      );
    });
  };
  render() {
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
          breakpoint: 768,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            initialSlide: 3,
            swipeToSlide: true
          }
        }
      ]
    };

    let gradeSlide: JSX.Element;
    const gradeItems: JSX.Element = (
      <div className="horizontal-scroll-body">
        {this.getGradeItemForSlide()}
      </div>
    );
    if (isMobileOnly) {
      gradeSlide = (
        <div className="horizontal-scroll">
          <h5 className="horizonta-scroll-header">{this.props.title}</h5>
          {this.state.grades.length > 0 ? gradeItems : null}
        </div>
      );
    } else {
      gradeSlide = (
        <SlickSlider settings={settings} title={this.props.title}>
          {this.getGradeItemForSlide()}
        </SlickSlider>
      );
    }

    return <React.Fragment>{gradeSlide}</React.Fragment>;
  }
}
export default withRouter(GradeSlide);
