import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { ICourse } from "../../../settings/DataTypes";
import CourseForm from "./CourseForm";
import { CourseService } from "../../../services/CourseService";
import { BUILD_ADMIN_COURSE_URL } from "../../../settings/Constants";

interface MatchProp {
  course_id: string;
}
interface IProp extends RouteComponentProps<MatchProp> {}
const EditCourse: React.FunctionComponent<IProp> = props => {
  const courseId = props.match.params.course_id;
  const courseService = new CourseService();

  const handleFormSubmit = (data: ICourse) => {
    courseService.updateCourse(data).then(resp => {
      console.log("Update successful");
      props.history.push(BUILD_ADMIN_COURSE_URL(resp.data.id));
    });
  };
  const handleFormCancel = () => {
    props.history.push(BUILD_ADMIN_COURSE_URL(+courseId));
  };

  return (
    <div className="width-75">
      <CourseForm
        courseId={+courseId}
        submitHandler={(data: any) => handleFormSubmit(data)}
        cancelHandler={handleFormCancel}
      />
    </div>
  );
};
export default withRouter(EditCourse);
