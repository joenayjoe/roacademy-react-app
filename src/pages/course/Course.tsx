import React, { Component } from "react";

import "./Course.css";
import { RouteComponentProps } from "react-router";
import { ICourse } from "../../datatypes/types";
import { CourseService } from "../../services/CourseService";

interface matchedParams {
  course_id: string;
}
interface IProps extends RouteComponentProps<matchedParams> {}
interface IStates {
  course: ICourse | null;
}

class Course extends Component<IProps, IStates> {
  private courseId: string;
  private courseService: CourseService;

  constructor(props: IProps) {
    super(props);
    this.courseId = this.props.match.params.course_id;
    this.courseService = new CourseService();
    this.state = {
      course: null
    };
  }
  componentDidMount() {
    this.courseService
      .getCourse(this.courseId)
      .then(response => {
        this.setState({ course: response.data });
      })
      .catch(error => {
        console.log("error =>", error.response.data);
      });
  }
  render() {
    let courseContainerItems: JSX.Element = (
      <div className="spinner">Loading ...</div>
    );
    if (this.state.course) {
      courseContainerItems = (
        <div className="chapter-list">
          <h4>{this.state.course.name}</h4>
          <p>All chapters goes here</p>
        </div>
      );
    }
    return <div className="course-container">{courseContainerItems}</div>;
  }
}
export default Course;
