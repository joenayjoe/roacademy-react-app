import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { AlertContext } from "../../contexts/AlertContext";
import {
  AlertVariant,
  ICourse,
  IChapter,
  HTTPStatus,
  RoleType,
  ICourseSubscribeRequest,
  CommentableType,
} from "../../settings/DataTypes";
import { CourseService } from "../../services/CourseService";
import {
  ADMIN_COURSE_STATUS,
  HOME_URL,
  TEACHER_DASHBOARD_URL,
  BUILD_TEACHER_EDIT_COURSE_URL,
} from "../../settings/Constants";
import { axiosErrorParser } from "../../utils/errorParser";
import ChapterService from "../../services/ChapterService";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";
import BreadcrumbItem from "../../components/breadcrumb/BreadcrumbItem";
import CourseDetail from "../course/CourseDetail";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmDialog from "../../components/modal/ConfirmDialog";
import Alert from "../../components/flash/Alert";
import Spinner from "../../components/spinner/Spinner";
import UserService from "../../services/UserService";
import CommentModule from "../../components/comment/CommentModule";
import PageNotFound from "../route/PageNotFound";

interface MatchParams {
  course_id: string;
}

interface IProp extends RouteComponentProps<MatchParams> {}

const TeacherCourse: React.FunctionComponent<IProp> = (props) => {
  const courseId: string = props.match.params.course_id;

  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const courseService = new CourseService();
  const chapterService = new ChapterService();
  const userService = new UserService();

  const [course, setCourse] = useState<ICourse | null>(null);
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [flashErrors, setFlashErrors] = useState<string[]>([]);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [found, setFound] = useState<boolean>(true);

  useEffect(() => {
    if (authContext.currentUser && authContext.hasRole(RoleType.TEACHER)) {
      loadCourse(+courseId);
      loadChapters(+courseId);
      checkIsSubscribe(authContext.currentUser.id, +courseId);
    } else {
      alertContext.show("Access denied", AlertVariant.DANGER);
      props.history.push(HOME_URL);
    }
    // eslint-disable-next-line
  }, [courseId]);

  const loadCourse = (courseId: number) => {
    setIsLoading(true);
    courseService
      .getCourse(courseId, ADMIN_COURSE_STATUS)
      .then((resp) => {
        setCourse(resp.data);
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

  const checkIsSubscribe = (userId: number, courseId: number) => {
    userService
      .isSubscribed(userId, courseId)
      .then((resp) => {
        setIsSubscribed(resp.data.subscribed);
      })
      .catch((err) => {
        setIsSubscribed(false);
      });
  };

  const subscribeCourse = () => {
    const request: ICourseSubscribeRequest = {
      studentId: authContext.currentUser!.id,
      courseId: course!.id,
    };
    userService
      .subscribeCourse(authContext.currentUser!.id, request)
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
  };

  const handleDeleteCourse = () => {
    setShowConfirmModal(false);
    courseService
      .deleteCourse(courseId)
      .then((resp) => {
        if (resp.status === HTTPStatus.OK) {
          alertContext.show("Course successfully deleted.");
          props.history.push(TEACHER_DASHBOARD_URL);
        }
      })
      .catch((err) => {
        setFlashErrors(axiosErrorParser(err));
      });
  };

  const getFlashErrors = () => {
    if (flashErrors.length) {
      return (
        <Alert
          errors={flashErrors}
          variant={AlertVariant.WARNING}
          closeHandler={() => setFlashErrors([])}
        />
      );
    }
    return null;
  };

  const getConfirmDialog = () => {
    if (course && !isLoading) {
      return (
        <ConfirmDialog
          isOpen={showConfirmModal}
          onConfirmHandler={handleDeleteCourse}
          onDismissHandler={() => setShowConfirmModal(false)}
        />
      );
    }
    return null;
  };

  if (isLoading) {
    return <Spinner size="3x" />;
  } else if (authContext.currentUser && course) {
    return (
      <div className="teacher-course-wrapper">
        <div className="teacher-course-view">
          {getFlashErrors()}
          {getConfirmDialog()}
          <Breadcrumb className="width-75 bg-transparent">
            <BreadcrumbItem href={TEACHER_DASHBOARD_URL}>
              Teacher Dashboard
            </BreadcrumbItem>
            <BreadcrumbItem active>Course Details</BreadcrumbItem>
          </Breadcrumb>
          <CourseDetail
            course={course}
            chapters={chapters}
            isSubscribed={isSubscribed}
            subscribeHandler={subscribeCourse}
          />

          <div className="action-btn-group my-2">
            <button
              className="btn btn-danger action-btn"
              onClick={() => setShowConfirmModal(true)}
            >
              <FontAwesomeIcon icon="trash" className="pr-1" />
              DELETE
            </button>
            <Link
              to={BUILD_TEACHER_EDIT_COURSE_URL(
                authContext.currentUser.id,
                course.id
              )}
            >
              <button className="btn btn-primary action-btn">
                <FontAwesomeIcon icon="edit" className="pr-1" />
                EDIT
              </button>
            </Link>
          </div>

          <CommentModule
            commentableType={CommentableType.COURSE}
            commentableId={course.id}
            className="width-75"
          />
        </div>
      </div>
    );
  } else if (!found) {
    return <PageNotFound />;
  } else {
    return null;
  }
};
export default TeacherCourse;
