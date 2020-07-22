import React, { useContext, useState } from "react";
import { TEACHER_DASHBOARD_URL } from "../../settings/Constants";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import BreadcrumbItem from "../../components/breadcrumb/BreadcrumbItem";
import CourseForm from "../../components/form/CourseForm";
import { AlertContext } from "../../contexts/AlertContext";
import { CourseService } from "../../services/CourseService";
import { RouteComponentProps } from "react-router-dom";
import { parseError } from "../../utils/errorParser";

interface IProp extends RouteComponentProps {}

const TeacherNewCourse: React.FunctionComponent<IProp> = (props) => {
  const alertContext = useContext(AlertContext);

  const courseService = new CourseService();

  const [errors, setErrors] = useState<string[]>([]);

  const handleNewCourseSubmit = (formData: FormData) => {
    courseService
      .createCourse(formData)
      .then((resp) => {
        setErrors([]);
        props.history.push(TEACHER_DASHBOARD_URL);
        alertContext.show("Course created successfully");
      })
      .catch((err) => {
        setErrors(parseError(err));
      });
  };

  return (
    <div className="teacher-new-course-wrapper width-75 mt-2">
      <Breadcrumb>
        <BreadcrumbItem href={TEACHER_DASHBOARD_URL}>
          Teacher Dashboard
        </BreadcrumbItem>
        <BreadcrumbItem active>New Course</BreadcrumbItem>
      </Breadcrumb>

      <CourseForm
        formSubmitHandler={handleNewCourseSubmit}
        errors={errors}
        formCancelHandler={() => props.history.push(TEACHER_DASHBOARD_URL)}
      />
    </div>
  );
};
export default TeacherNewCourse;
