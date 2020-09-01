import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps, withRouter, Link } from "react-router-dom";
import {
  ICourse,
  HTTPStatus,
  AlertVariant,
  IChapter,
  ICourseSubscribeRequest,
  RoleType,
  CommentableType,
} from "../../../settings/DataTypes";
import { CourseService } from "../../../services/CourseService";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import BreadcrumbItem from "../../../components/breadcrumb/BreadcrumbItem";
import {
  ADMIN_PANEL_URL,
  ADMIN_COURSES_URL,
  BUILD_ADMIN_EDIT_COURSE_URL,
  ADMIN_COURSE_STATUS,
  HOME_URL,
} from "../../../settings/Constants";
import Spinner from "../../../components/spinner/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmDialog from "../../../components/modal/ConfirmDialog";
import { axiosErrorParser } from "../../../utils/errorParser";
import CourseDetail from "../../course/CourseDetail";
import { AlertContext } from "../../../contexts/AlertContext";
import ChapterService from "../../../services/ChapterService";
import UserService from "../../../services/UserService";
import { AuthContext } from "../../../contexts/AuthContext";
import CommentModule from "../../../components/comment/CommentModule";
import PageNotFound from "../../route/PageNotFound";

interface MatchParams {
  course_id: string;
}

interface IProps extends RouteComponentProps<MatchParams> {}

const AdminCourse: React.FunctionComponent<IProps> = (props) => {
  const alertContext = useContext(AlertContext);
  const authContext = useContext(AuthContext);

  const courseId: string = props.match.params.course_id;

  const [course, setCourse] = useState<ICourse | null>(null);
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [found, setFound] = useState<boolean>(true);

  const courseService = new CourseService();
  const chapterService = new ChapterService();
  const userService = new UserService();

  useEffect(() => {
    if (authContext.currentUser && authContext.hasRole(RoleType.ADMIN)) {
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
      userId: authContext.currentUser!.id,
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
          props.history.push(ADMIN_COURSES_URL);
        }
      })
      .catch((err) => {
        alertContext.show(
          axiosErrorParser(err).join(", "),
          AlertVariant.DANGER
        );
      });
  };

  let confirmDialog = (
    <ConfirmDialog
      isOpen={showConfirmModal}
      onConfirmHandler={handleDeleteCourse}
      onDismissHandler={() => setShowConfirmModal(false)}
    />
  );

  if (isLoading) {
    return <Spinner size="3x" />;
  } else if (course) {
    return (
      <div className="admin-course-view">
        {confirmDialog}
        <Breadcrumb className="width-75 bg-transparent">
          <BreadcrumbItem href={ADMIN_PANEL_URL}>Admin</BreadcrumbItem>
          <BreadcrumbItem href={ADMIN_COURSES_URL}>Courses</BreadcrumbItem>
          <BreadcrumbItem active>Course Details</BreadcrumbItem>
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

        <div className="action-btn-group">
          <button
            className="btn btn-danger action-btn"
            onClick={() => setShowConfirmModal(true)}
          >
            <FontAwesomeIcon icon="trash" className="pr-1" />
            DELETE
          </button>
          <Link to={BUILD_ADMIN_EDIT_COURSE_URL(course.id)}>
            <button className="btn btn-primary action-btn">
              <FontAwesomeIcon icon="edit" className="pr-1" />
              EDIT
            </button>
          </Link>
        </div>
      </div>
    );
  } else if (!found) {
    return <PageNotFound />;
  } else {
    return null;
  }
};
export default withRouter(AdminCourse);
