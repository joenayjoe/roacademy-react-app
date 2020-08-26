import React, { useState, useEffect, useContext } from "react";

import "./Course.css";
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
        })
        .catch((err) => {
          alertContext.show(
            "Couldn't determine course subscription status.",
            AlertVariant.DANGER
          );
        });
    }
  };

  const loadCourse = (courseId: number) => {
    courseService
      .getCourse(courseId, DEFAULT_COURSE_STATUS)
      .then((response) => {
        setCourse(response.data);
      })
      .catch((err) => {
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
        setChapters(resp.data);
      })
      .catch((err) => {
        alertContext.show(
          axiosErrorParser(err).join(", "),
          AlertVariant.DANGER
        );
      });
  };

  const subscribeCourse = () => {
    if (authContext.currentUser) {
      const request: ICourseSubscribeRequest = {
        userId: authContext.currentUser.id,
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

  const getCourseView = (course: ICourse) => {
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  };

  if (course) {
    return (
      <div className="course-container full-width">{getCourseView(course)}</div>
    );
  }
  return <Spinner size="3x" />;
};

export default Course;
