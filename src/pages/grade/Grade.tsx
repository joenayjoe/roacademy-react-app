import React, { useState, useEffect } from "react";

import "./Grade.css";
import { RouteComponentProps } from "react-router";
import { IGrade } from "../../settings/DataTypes";
import { GradeService } from "../../services/GradeService";
import Spinner from "../../components/spinner/Spinner";
import CourseSlide from "../course/CourseSlide";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import BreadcrumbItem from "../../components/breadcrumb/BreadcrumbItem";
import {
  BUILD_CATEGORY_URL,
  DEFAULT_COURSE_STATUS
} from "../../settings/Constants";

interface matchedParams {
  grade_id: string;
}

interface IProps extends RouteComponentProps<matchedParams> {}

const Grade: React.FunctionComponent<IProps> = props => {
  const gradeId = props.match.params.grade_id;
  const gradeService = new GradeService();

  const [grade, setGrade] = useState<IGrade | null>(null);

  useEffect(() => {
    gradeService
      .getGradeWithCourses(gradeId, DEFAULT_COURSE_STATUS)
      .then(response => {
        setGrade(response.data);
      });
    // eslint-disable-next-line
  }, [gradeId]);

  let gradeContainerItems: JSX.Element = <Spinner size="3x" />;
  if (grade) {
    gradeContainerItems = (
      <React.Fragment>
        <Breadcrumb className="bg-transparent">
          <BreadcrumbItem href={BUILD_CATEGORY_URL(grade.primaryCategory.id)}>
            {grade.primaryCategory.name}
          </BreadcrumbItem>
          <BreadcrumbItem active>{grade.name}</BreadcrumbItem>
        </Breadcrumb>
        <div className="course-list">
          <CourseSlide
            title={`Popular Courses in ${grade.name}`}
            courses={grade.courses}
          />
        </div>

        <div className="course-list">
          <CourseSlide
            title={`All Courses in ${grade.name}`}
            courses={grade.courses}
          />
        </div>
      </React.Fragment>
    );
  }
  return <div className="grade-container width-75">{gradeContainerItems}</div>;
};
export default Grade;
