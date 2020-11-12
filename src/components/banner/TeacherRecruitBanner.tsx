import React from "react";
import { TEACHER_REQUEST_URL } from "../../settings/Constants";
import { withRouter, RouteComponentProps } from "react-router-dom";
import "./Banner.css";

interface IProps extends RouteComponentProps {}
const TeacherRecruitBanner: React.FunctionComponent<IProps> = (props) => {
  const teacherRequestClick = () => {
    props.history.push(TEACHER_REQUEST_URL);
  };

  return (
    <div className="banner teacher-recruitment-banner">
      <h1 className="banner-header d-none d-md-block">Do you like teaching?</h1>
      <p className="banner-subheader">
        Join <strong>Roacademy</strong> as an Instructor!
      </p>
      <hr className="my-4 d-none d-md-block" />
      <p className="banner-text d-none d-md-block">
        Your one lecture can change the life of several Rohingyas who are denied
        their basic right to Education in their home land
      </p>

      <button className="btn btn-info btn-lg" onClick={teacherRequestClick}>
        Join as Instructor today
      </button>
    </div>
  );
};

export default withRouter(TeacherRecruitBanner);
