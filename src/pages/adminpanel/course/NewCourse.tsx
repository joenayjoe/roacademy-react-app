import React from "react";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import {
  ADMIN_COURSES_URL,
  ADMIN_PANEL_URL
} from "../../../settings/Constants";
import BreadcrumbItem from "../../../components/breadcrumb/BreadcrumbItem";
import CourseForm from "./CourseForm";

interface IProp {}

const NewCourse: React.FunctionComponent<IProp> = props => {
  return (
    <div className="new-course width-75">
      <Breadcrumb>
        <BreadcrumbItem href={ADMIN_PANEL_URL}>Admin</BreadcrumbItem>
        <BreadcrumbItem href={ADMIN_COURSES_URL}>Courses</BreadcrumbItem>
        <BreadcrumbItem active>New Course</BreadcrumbItem>
      </Breadcrumb>

      <CourseForm />
    </div>
  );
};
export default NewCourse;
