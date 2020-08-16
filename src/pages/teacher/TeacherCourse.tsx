import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { AlertContext } from "../../contexts/AlertContext";
import {
  AlertVariant,
  ICourse,
  IChapter,
  HTTPStatus,
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

  const [course, setCourse] = useState<ICourse | null>(null);
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [flashErrors, setFlashErrors] = useState<string[]>([]);

  useEffect(() => {
    if (authContext.currentUser) {
      setIsLoading(true);
      courseService
        .getCourse(+courseId, ADMIN_COURSE_STATUS)
        .then((resp) => {
          setCourse(resp.data);
          chapterService
            .getChaptersByCourseId(resp.data.id)
            .then((resp) => {
              setChapters(resp.data);
              setIsLoading(false);
            })
            .catch((err) => {
              alertContext.show(
                axiosErrorParser(err).join(", "),
                AlertVariant.DANGER
              );
            });
        })
        .catch((err) => {
          alertContext.show(axiosErrorParser(err).join(", "), AlertVariant.DANGER);
        });
    } else {
      alertContext.show("Access denied", AlertVariant.DANGER);
      props.history.push(HOME_URL);
    }
    // eslint-disable-next-line
  }, []);

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

  const getCourseView = () => {
    if (authContext.currentUser && course) {
      return (
        <div className="teacher-course-view">
          {isLoading && <Spinner size="3x" />}
          {getFlashErrors()}
          {getConfirmDialog()}
          <Breadcrumb className="width-75 bg-transparent">
            <BreadcrumbItem href={TEACHER_DASHBOARD_URL}>
              Teacher Dashboard
            </BreadcrumbItem>
            <BreadcrumbItem active>Course Details</BreadcrumbItem>
          </Breadcrumb>
          <CourseDetail course={course} chapters={chapters} />

          <div className="action-btn-group">
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
        </div>
      );
    }
    return null;
  };

  return <div className="teacher-course-wrapper">{getCourseView()}</div>;
};
export default TeacherCourse;
