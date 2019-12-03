import React, { useState, useEffect } from "react";

import "./Grade.css";
import { RouteComponentProps } from "react-router";
import { IGrade } from "../../settings/DataTypes";
import { GradeService } from "../../services/GradeService";
import Spinner from "../../components/spinner/Spinner";
import CourseSlide from "../course/CourseSlide";

interface matchedParams {
  category_id: string;
  grade_id: string;
}

interface IProps extends RouteComponentProps<matchedParams> {}

const Grade: React.FunctionComponent<IProps> = props => {
  const categoryId: string = props.match.params.category_id;
  const gradeId = props.match.params.grade_id;
  const gradeService = new GradeService();

  const [grade, setGrade] = useState<IGrade | null>(null);

  useEffect(() => {
    gradeService.getGradeWithCourses(categoryId, gradeId).then(response => {
      setGrade(response.data);
    });
    // eslint-disable-next-line
  }, []);

  let gradeContainerItems: JSX.Element = <Spinner size="3x" />;
  if (grade) {
    gradeContainerItems = (
      <React.Fragment>
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
  return <div className="grade-container">{gradeContainerItems}</div>;
};
export default Grade;
