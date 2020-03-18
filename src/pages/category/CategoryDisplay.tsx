import React from "react";
import { ICategory, ICourse } from "../../settings/DataTypes";
import CourseSlide from "../course/CourseSlide";
import GradeSlide from "../grade/GradeSlide";

interface IProps {
  category: ICategory;
  courses: ICourse[];
}

const CategoryDisplay: React.FunctionComponent<IProps> = props => {
  return (
    <div className="category-display-container">
      <div className="popular-courses">
        <CourseSlide
          title={`Popular Courses in ${props.category.name}`}
          courses={props.courses}
        />
      </div>

      <div className="subject-list">
        <GradeSlide
          grades={props.category.grades}
          title={`Topics in ${props.category.name}`}
        />
      </div>

      <div className="course-list">
        <CourseSlide
          title={`All Courses in ${props.category.name}`}
          courses={props.courses}
        />
      </div>
    </div>
  );
};
export default CategoryDisplay;
