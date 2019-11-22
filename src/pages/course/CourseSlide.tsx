import React, { Component } from "react";
import { ICourse } from "../../settings/DataTypes";
import { CourseService } from "../../services/CourseService";
import { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SlickSlider from "../../components/slider/SlickSlider";
import SliderNextArrow from "../../components/slider/SliderNextArrow";
import SliderPrevArrow from "../../components/slider/SliderPrevArrow";

interface IProps {
  categoryId: number;
  title: string;
}

interface IStates {
  courses: ICourse[];
}
class CourseSlide extends Component<IProps, IStates> {
  private courseService: CourseService;
  state = { courses: [] };

  constructor(props: IProps) {
    super(props);
    this.courseService = new CourseService();
  }

  componentDidMount() {
    this.courseService
      .getCoursesByCategoryId(this.props.categoryId)
      .then(resp => {
        this.setState({ courses: resp.data });
      });
  }

  getCourses = () => {
    console.log(this.state.courses);
    return this.state.courses.map((course: ICourse) => {
      return (
        <div className="card item-card" key={course.id}>
          <img src="..." className="card-img-top" alt="..." />
          <div className="card-body">
            <h5 className="card-title">{course.name}</h5>
            <p className="card-text text-secondary">Author name here</p>
          </div>
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
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            swipeToSlide: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2,
            dots: true,
            prevArrow: undefined,
            nextArrow: undefined,
            swipeToSlide: true
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            prevArrow: undefined,
            nextArrow: undefined,
            swipeToSlide: true
          }
        }
      ]
    };

    return (
      <SlickSlider settings={settings} title={this.props.title}>
        {this.getCourses()}
      </SlickSlider>
    );
  }
}
export default CourseSlide;
