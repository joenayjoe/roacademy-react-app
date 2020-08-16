import React, { useState, useEffect, useContext, useRef } from "react";

import "./Course.css";
import { RouteComponentProps } from "react-router";
import {
  ICourse,
  IChapter,
  AlertVariant,
  IComment,
  ICommentRequest,
  CommentableType,
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
  PAGE_SIZE,
  DEFAULT_SORTING,
} from "../../settings/Constants";
import ChapterService from "../../services/ChapterService";
import { AlertContext } from "../../contexts/AlertContext";
import { axiosErrorParser } from "../../utils/errorParser";
import CommentList from "../../components/comment/CommentList";
import NewComment from "../../components/comment/NewComment";
import DropDown from "../../components/dropdown/DropDown";

interface matchedParams {
  course_id: string;
}
interface IProps extends RouteComponentProps<matchedParams> {}

const Course: React.FunctionComponent<IProps> = (props) => {
  const alertContext = useContext(AlertContext);
  const courseId: string = props.match.params.course_id;
  const courseService = new CourseService();
  const chapterService = new ChapterService();

  const [course, setCourse] = useState<ICourse | null>(null);
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [comments, setComments] = useState<IComment[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(false);
  const [newCommentBody, setNewCommentBody] = useState<string>("");
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
  const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false);
  const [commentSortOrder, setCommentSortOrder] = useState<string>(
    DEFAULT_SORTING
  );

  let sortDrpDwnRef = useRef<HTMLButtonElement>(null);
  let sortListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    loadCourse(+courseId);
    loadChapters(+courseId);
    loadComments(0, PAGE_SIZE);
    // eslint-disable-next-line
  }, [courseId]);

  useEffect(() => {
    document.addEventListener("mousedown", (e) => handleOnClick(e), false);

    return () => {
      document.removeEventListener("mousedown", (e) => handleOnClick(e), false);
    };
  }, []);

  const handleOnClick = (e: MouseEvent) => {
    if (
      sortDrpDwnRef &&
      sortDrpDwnRef.current &&
      sortDrpDwnRef.current.contains(e.target as HTMLElement)
    ) {
      setShowSortDropdown((showSortDropdown) => !showSortDropdown);
    } else if (
      !(
        sortListRef &&
        sortListRef.current &&
        sortListRef.current.contains(e.target as HTMLElement)
      )
    ) {
      setShowSortDropdown(false);
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

  const loadComments = (page: number, size: number) => {
    setIsLoadingComments(true);
    courseService
      .getComments(+courseId, page, size, commentSortOrder)
      .then((resp) => {
        setComments([...comments, ...resp.data.content]);
        setCurrentPage(resp.data.number);
        setTotalComments(resp.data.totalElements);
        setHasMoreComments(!resp.data.last);
        setIsLoadingComments(false);
      })
      .catch((err) => {
        alertContext.show(
          axiosErrorParser(err).join(", "),
          AlertVariant.DANGER
        );
      });
  };

  const sortComment = (order: string) => {
    setIsLoadingComments(true);
    setCommentSortOrder(order);
    setShowSortDropdown(false);
    courseService.getComments(course!.id, 0, PAGE_SIZE, order).then((resp) => {
      setComments(resp.data.content);
      setCurrentPage(resp.data.number);
      setTotalComments(resp.data.totalElements);
      setHasMoreComments(!resp.data.last);
      setIsLoadingComments(false);
    });
  };

  const deleteComment = (comment: IComment) => {
    if (course !== null) {
      courseService
        .deleteComment(course.id, comment.id)
        .then((resp) => {
          let c = comments.filter((c) => c.id !== comment.id);
          setComments(c);
        })
        .catch((err) => {
          alertContext.show(
            axiosErrorParser(err).join(", "),
            AlertVariant.DANGER
          );
        });
    }
  };
  const loadMoreComments = () => {
    loadComments(currentPage + 1, PAGE_SIZE);
  };

  const handleNewCommentOnSubmit = (text: string) => {
    setNewCommentBody(text);
    let comment: ICommentRequest = {
      commentBody: text,
    };
    courseService
      .addComment(+courseId, comment)
      .then((resp) => {
        let c: IComment[] = [...comments];
        if (comments.length >= PAGE_SIZE) {
          c.splice(-1, 1);
        }
        let cmnts: IComment[] = [resp.data, ...c];
        setComments(cmnts);
        setNewCommentBody("");
      })
      .catch((err) => {
        alertContext.show(axiosErrorParser(err).join(" "), AlertVariant.DANGER);
      });
  };

  const getCommentView = (course: ICourse) => {
    if (isLoadingComments) {
      return <Spinner size="3x" />;
    }

    return (
      <React.Fragment>
        <NewComment
          key={newCommentBody}
          onSubmit={(text) => handleNewCommentOnSubmit(text)}
          commentBody={newCommentBody}
        />
        <CommentList
          comments={comments}
          commentableType={CommentableType.COURSE}
          commentableId={course.id}
          hasMore={hasMoreComments}
          loadMore={loadMoreComments}
          deleteHandler={deleteComment}
        />
      </React.Fragment>
    );
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
        <CourseDetail course={course} chapters={chapters} />

        <div className="comment-section width-75">
          <div className="comment-top">
            <div className="comment-count mr-2">
              <h5>{totalComments} Comments</h5>
            </div>
            <div className="comment-filter">
              <DropDown
                name="Sort By"
                icon="sort"
                showDropDown={showSortDropdown}
                dropDownBtnRef={sortDrpDwnRef}
              >
                <ul
                  className="drop-down-list drop-down-list-arrow-left"
                  ref={sortListRef}
                >
                  <li
                    className="drop-down-list-item"
                    onClick={() => sortComment("id_desc")}
                  >
                    <span className="menu-link">Newest First</span>
                  </li>
                  <li
                    className="drop-down-list-item"
                    onClick={() => sortComment("id_asc")}
                  >
                    <span className="menu-link">Oldest First</span>
                  </li>
                </ul>
              </DropDown>
            </div>
          </div>

          {getCommentView(course)}
        </div>
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
