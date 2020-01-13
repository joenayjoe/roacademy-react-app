import React, { useState, useEffect } from "react";
import { RouteComponentProps, withRouter, Link } from "react-router-dom";
import { ICourse, HTTPStatus, AlertVariant } from "../../../settings/DataTypes";
import { CourseService } from "../../../services/CourseService";
import Breadcrumb from "../../../components/breadcrumb/Breadcrumb";
import BreadcrumbItem from "../../../components/breadcrumb/BreadcrumbItem";
import {
  ADMIN_PANEL_URL,
  ADMIN_COURSES_URL,
  BUILD_ADMIN_EDIT_COURSE_URL
} from "../../../settings/Constants";
import Spinner from "../../../components/spinner/Spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmDialog from "../../../components/modal/ConfirmDialog";
import { parseError } from "../../../utils/errorParser";
import Flash from "../../../components/flash/Flash";
import CourseDetail from "../../course/CourseDetail";

interface MatchParams {
  course_id: string;
}

interface IProps extends RouteComponentProps<MatchParams> {}

const AdminCourse: React.FunctionComponent<IProps> = props => {
  const courseId: string = props.match.params.course_id;
  const [course, setCourse] = useState<ICourse | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [flashMessages, setFlashMessages] = useState<string[]>([]);

  const courseService = new CourseService();
  useEffect(() => {
    courseService.getCourse(courseId).then(resp => {
      setCourse(resp.data);
      setIsLoaded(true);
    });
    // eslint-disable-next-line
  }, []);

  const handleDeleteCourse = () => {
    setShowConfirmModal(false);
    courseService
      .deleteCourse(courseId)
      .then(resp => {
        if (resp.status === HTTPStatus.OK) {
          props.history.push(ADMIN_COURSES_URL, {
            from: props.location,
            variant: AlertVariant.SUCCESS,
            message: "Course successfully deleted."
          });
        }
      })
      .catch(err => {
        setFlashMessages(parseError(err));
      });
  };

  let courseView = <Spinner size="3x" />;
  let confirmDialog;
  const flashErrors = flashMessages.length ? (
    <Flash
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
      <div className="admin-course-view full-width">
        {flashErrors}
        {confirmDialog}
        <Breadcrumb className="width-75 bg-transparent">
          <BreadcrumbItem href={ADMIN_PANEL_URL}>Admin</BreadcrumbItem>
          <BreadcrumbItem href={ADMIN_COURSES_URL}>Courses</BreadcrumbItem>
          <BreadcrumbItem active>Course Details</BreadcrumbItem>
        </Breadcrumb>
        <CourseDetail course={course} />

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
