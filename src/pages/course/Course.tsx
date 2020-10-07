import React, { useState, useEffect, useContext } from "react";

import { RouteComponentProps } from "react-router";
import {
  ICourse,
  IChapter,
  AlertVariant,
  CommentableType,
  ICourseSubscribeRequest,
  HTTPStatus,
} from "../../settings/DataTypes";
import { CourseService } from "../../services/CourseService";
import Spinner from "../../components/spinner/Spinner";
import CourseDetail from "./CourseDetail";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import BreadcrumbItem from "../../components/breadcrumb/BreadcrumbItem";
import {
  BUILD_CATEGORY_URL,
  BUILD_GRADE_URL,
  DEFAULT_COURSE_STATUS,
} from "../../settings/Constants";
import ChapterService from "../../services/ChapterService";
import { AlertContext } from "../../contexts/AlertContext";
import { axiosErrorParser } from "../../utils/errorParser";
import CommentModule from "../../components/comment/CommentModule";
import { AuthContext } from "../../contexts/AuthContext";
import UserService from "../../services/UserService";
import PageNotFound from "../route/PageNotFound";

interface matchedParams {
  course_id: string;
}
interface IProps extends RouteComponentProps<matchedParams> {}

const Course: React.FunctionComponent<IProps> = (props) => {
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);

  const courseId: string = props.match.params.course_id;
  const courseService = new CourseService();
  const chapterService = new ChapterService();
  const userService = new UserService();

  const [course, setCourse] = useState<ICourse | null>(null);
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [found, setFound] = useState<boolean>(true);

  useEffect(() => {
    setIsSubscribed(false);
    loadCourse(+courseId);
    loadChapters(+courseId);
    checkSubscribe(+courseId);
    // eslint-disable-next-line
  }, [courseId]);

  const checkSubscribe = (courseId: number) => {
    if (authContext.currentUser) {
      userService
        .isSubscribed(authContext.currentUser.id, courseId)
        .then((resp) => {
          setIsSubscribed(resp.data.subscribed);
        });
    }
  };

  const loadCourse = (courseId: number) => {
    setIsLoading(true);
    courseService
      .getCourse(courseId, DEFAULT_COURSE_STATUS)
      .then((response) => {
        setCourse(response.data);
      })
      .catch((err) => {
        setIsLoading(false);
        setFound(false);
        alertContext.show(
          axiosErrorParser(err).join(", "),
          AlertVariant.DANGER
        );
      });
  };
  const loadChapters = (courseId: number) => {
    chapterService
      .getChaptersByCourseId(courseId)
      .then((resp) => {
        setIsLoading(false);
        setChapters(resp.data);
      })
      .catch((err) => {
        setIsLoading(false);
        alertContext.show(
          axiosErrorParser(err).join(", "),
          AlertVariant.DANGER
        );
      });
  };

  const subscribeCourse = () => {
    if (authContext.currentUser) {
      const request: ICourseSubscribeRequest = {
        studentId: authContext.currentUser.id,
        courseId: course!.id,
      };
      userService
        .subscribeCourse(authContext.currentUser.id, request)
        .then((resp) => {
          if (resp.status === HTTPStatus.OK) {
            setIsSubscribed(!isSubscribed);
          }
        })
        .catch((err) => {
          alertContext.show(
            axiosErrorParser(err).join(", "),
            AlertVariant.DANGER
          );
        });
    } else {
      alertContext.show(
        "Access Denied! You're not logged in",
        AlertVariant.DANGER
      );
    }
  };

  if (isLoading) {
    return <Spinner size="3x" />;
  } else if (course) {
    return (
      <div className="course-container full-width">
        <Breadcrumb className="width-75 bg-transparent">
          <BreadcrumbItem href={BUILD_CATEGORY_URL(course.primaryCategory.id)}>
            {course.primaryCategory.name}
          </BreadcrumbItem>
          <BreadcrumbItem href={BUILD_GRADE_URL(course.primaryGrade.id)}>
            {course.primaryGrade.name}
          </BreadcrumbItem>
          <BreadcrumbItem active>{course.name}</BreadcrumbItem>
        </Breadcrumb>
        <CourseDetail
          course={course}
          chapters={chapters}
          isSubscribed={isSubscribed}
          subscribeHandler={subscribeCourse}
        />

        <CommentModule
          commentableType={CommentableType.COURSE}
          commentableId={course.id}
          className="width-75"
        />
      </div>
    );
  } else if (!found) {
    return <PageNotFound />;
  } else {
    return null;
  }
};

export default Course;
