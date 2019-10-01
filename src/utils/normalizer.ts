import { normalize, schema } from "normalizr";
import { ICategory, ICourse, IGrade } from "../datatypes/types";

export const courseSchema = new schema.Entity("courses");

export const gradeSchema = new schema.Entity("grades", {
  courses: [courseSchema]
});

export const categorySchema = new schema.Entity("categories", {
  grades: [gradeSchema]
});

export const normalizeCategories = (categories: ICategory[]) => {
  return normalize(categories, [categorySchema]);
};

export const normalizeGrades = (grades: IGrade[]) => {
  return normalize(grades, [gradeSchema]);
};

export const normalizeCourses = (courses: ICourse[]) => {
  return normalize(courses, [courseSchema]);
};
