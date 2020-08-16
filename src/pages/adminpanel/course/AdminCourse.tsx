import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps, withRouter, Link } from "react-router-dom";
import {
  ICourse,
  HTTPStatus,
  AlertVariant,
  IChapter
} from "../../../settings/DataTypes";
import { CourseService } from "../../../services/CourseService";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import BreadcrumbItem from "../../../components/breadcrumb/BreadcrumbItem";
import {
  ADMIN_PANEL_URL,
  ADMIN_COURSES_URL,
  BUILD_ADMIN_EDIT_COURSE_URL,
  ADMIN_COURSE_STATUS
} from "../../../settings/Constants";
import Spinner from "../../../components/spinner/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmDialog from "../../../components/modal/ConfirmDialog";
import { axiosErrorParser } from "../../../utils/errorParser";
import Alert from "../../../components/flash/Alert";
import CourseDetail from "../../course/CourseDetail";
import { AlertContext } from "../../../contexts/AlertContext";
import ChapterService from "../../../services/ChapterService";

interface MatchParams {
  course_id: string;
}

interface IProps extends RouteComponentProps<MatchParams> {}

const AdminCourse: React.FunctionComponent<IProps> = props => {
  const alertContext = useContext(AlertContext);
  const courseId: string = props.match.params.course_id;
  const [course, setCourse] = useState<ICourse | null>(null);
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [flashMessages, setFlashMessages] = useState<string[]>([]);

  const courseService = new CourseService();
  const chapterService = new ChapterService();
  useEffect(() => {
    courseService
      .getCourse(+courseId, ADMIN_COURSE_STATUS)
      .then(resp => {
        setCourse(resp.data);
        chapterService
          .getChaptersByCourseId(resp.data.id)
          .then(resp => {
            setChapters(resp.data);
            setIsLoaded(true);
          })
          .catch(err => {
            alertContext.show(axiosErrorParser(err).join(", "), AlertVariant.DANGER);
          });
      })
      .catch(err => {
        alertContext.show(axiosErrorParser(err).join(", "), AlertVariant.DANGER);
      });
    // eslint-disable-next-line
  }, []);

  const handleDeleteCourse = () => {
    setShowConfirmModal(false);
    courseService
      .deleteCourse(courseId)
      .then(resp => {
        if (resp.status === HTTPStatus.OK) {
          alertContext.show("Course successfully deleted.");
          props.history.push(ADMIN_COURSES_URL);
        }
      })
      .catch(err => {
        setFlashMessages(axiosErrorParser(err));
      });
  };

  let courseView = <Spinner size="3x" />;
  let confirmDialog;
  const flashErrors = flashMessages.length ? (
    <Alert
      errors={flashMessages}
      variant={AlertVariant.WARNING}
      closeHandler={() => setFlashMessages([])}
    />
  ) : null;
  if (course && isLoaded) {
    confirmDialog = (
      <ConfirmDialog
        isOpen={showConfirmModal}
        onConfirmHandler={handleDeleteCourse}
        onDismissHandler={() => setShowConfirmModal(false)}
      />
    );
    courseView = (
      <div className="admin-course-view">
        {flashErrors}
        {confirmDialog}
        <Breadcrumb className="width-75 bg-transparent">
          <BreadcrumbItem href={ADMIN_PANEL_URL}>Admin</BreadcrumbItem>
          <BreadcrumbItem href={ADMIN_COURSES_URL}>Courses</BreadcrumbItem>
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
          <Link to={BUILD_ADMIN_EDIT_COURSE_URL(course.id)}>
            <button className="btn btn-primary action-btn">
              <FontAwesomeIcon icon="edit" className="pr-1" />
              EDIT
            </button>
          </Link>
        </div>
      </div>
    );
  }
  return <React.Fragment>{courseView}</React.Fragment>;
};
export default withRouter(AdminCourse);
