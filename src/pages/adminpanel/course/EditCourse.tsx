import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ICourse, AlertVariant } from "../../../settings/DataTypes";
import CourseForm from "./CourseForm";
import { CourseService } from "../../../services/CourseService";
import {
  BUILD_ADMIN_COURSE_URL,
  BUILD_ADMIN_EDIT_COURSE_URL
} from "../../../settings/Constants";
import FlashGenerator from "../../../components/flash/FlashGenerator";

interface MatchProp {
  course_id: string;
}
interface IProp extends RouteComponentProps<MatchProp> {}
const EditCourse: React.FunctionComponent<IProp> = props => {
  const courseId = props.match.params.course_id;
  const courseService = new CourseService();

  const handleFormSubmit = (data: ICourse) => {
    courseService.updateCourse(data).then(resp => {
      props.history.push(BUILD_ADMIN_EDIT_COURSE_URL(resp.data.id), {
        from: props.location,
        variant: AlertVariant.SUCCESS,
        message: "Course successfully saved."
      });
    });
  };
  const handleFormCancel = () => {
    props.history.push(BUILD_ADMIN_COURSE_URL(+courseId));
  };

  return (
    <div className="width-75">
      <FlashGenerator
        state={props.location.state}
        closeHandler={() => props.history.replace(props.location.pathname)}
      />
      <CourseForm
        courseId={+courseId}
        submitHandler={(data: any) => handleFormSubmit(data)}
        cancelHandler={handleFormCancel}
      />
    </div>
  );
};
export default withRouter(EditCourse);
