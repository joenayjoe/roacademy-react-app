import React, { useState, useRef, useContext, useEffect } from "react";
import {
  CommentableType,
  IComment,
  ICommentRequest,
  AlertVariant,
} from "../../settings/DataTypes";
import LectureService from "../../services/LectureService";
import { CourseService } from "../../services/CourseService";
import DropDown from "../dropdown/DropDown";
import { DEFAULT_SORTING, PAGE_SIZE } from "../../settings/Constants";
import NewComment from "./NewComment";
import CommentList from "./CommentList";
import { axiosErrorParser } from "../../utils/errorParser";
import Spinner from "../spinner/Spinner";

import styles from "./Comment.module.css";

import { AuthContext } from "../../contexts/AuthContext";
import Alert from "../flash/Alert";

interface IProp {
  commentableType: CommentableType;
  commentableId: number;
  className?: string;
}

const CommentModule: React.FunctionComponent<IProp> = (props) => {
  const courseService = new CourseService();
  const lectureService = new LectureService();
  const authContext = useContext(AuthContext);

  const [comments, setComments] = useState<IComment[]>([]);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [showSortDropdown, setShowSortDropdown] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<string>(DEFAULT_SORTING);
  const [newCommentBody, setNewCommentBody] = useState<string>("");
  const [newAddedComments, setNewAddedComments] = useState<IComment[]>([]);
  const [commentErrors, setCommentErrors] = useState<string[]>([]);

  let sortDrpDwnRef = useRef<HTMLButtonElement>(null);
  let sortListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (props.commentableType === CommentableType.COURSE) {
      loadCourseComments(0, PAGE_SIZE, sortOrder, comments);
    } else {
      loadLectureComments(0, PAGE_SIZE, sortOrder, comments);
    }
    // eslint-disable-next-line
  }, []);

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

  const loadCourseComments = (
    page: number,
    size: number,
    order: string,
    initialComments: IComment[]
  ) => {
    setIsloading(true);
    setNewAddedComments([]);
    courseService
      .getComments(props.commentableId, page, size, order)
      .then((resp) => {
        setComments([...initialComments, ...resp.data.content]);
        setCurrentPage(resp.data.number);
        setTotalComments(resp.data.totalElements);
        setHasMore(!resp.data.last);
        setIsloading(false);
      })
      .catch((err) => {
        setCommentErrors(axiosErrorParser(err));
      });
  };

  const loadLectureComments = (
    page: number,
    size: number,
    order: string,
    initialComments: IComment[]
  ) => {
    setNewAddedComments([]);
    setIsloading(true);
    lectureService
      .getComments(props.commentableId, page, size, order)
      .then((resp) => {
        setComments([...initialComments, ...resp.data.content]);
        setCurrentPage(resp.data.number);
        setTotalComments(resp.data.totalElements);
        setHasMore(!resp.data.last);
        setIsloading(false);
      })
      .catch((err) => {
        setCommentErrors(axiosErrorParser(err));
      });
  };

  const saveCourseComment = (text: string) => {
    setNewCommentBody(text);
    let comment: ICommentRequest = {
      commentBody: text,
    };
    courseService
      .addComment(props.commentableId, comment)
      .then((resp) => {
        setNewAddedComments([...newAddedComments, resp.data]);
        setTotalComments(totalComments + 1);
        setNewCommentBody("");
      })
      .catch((err) => {
        setCommentErrors(axiosErrorParser(err));
      });
  };

  const saveLectureComment = (text: string) => {
    setNewCommentBody(text);
    let comment: ICommentRequest = {
      commentBody: text,
    };
    lectureService
      .addComment(props.commentableId, comment)
      .then((resp) => {
        setNewAddedComments([...newAddedComments, resp.data]);
        setTotalComments(totalComments + 1);
        setNewCommentBody("");
      })
      .catch((err) => {
        setCommentErrors(axiosErrorParser(err));
      });
  };

  const deleteCourseComment = (comment: IComment) => {
    courseService
      .deleteComment(props.commentableId, comment.id)
      .then((resp) => {
        let c = comments.filter((c) => c.id !== comment.id);
        let nc = newAddedComments.filter((c) => c.id !== comment.id);
        setComments(c);
        setNewAddedComments(nc);
        setTotalComments(totalComments - 1);
      })
      .catch((err) => {
        setCommentErrors(axiosErrorParser(err));
      });
  };

  const deleteLectureComment = (comment: IComment) => {
    lectureService
      .deleteComment(props.commentableId, comment.id)
      .then((resp) => {
        let c = comments.filter((c) => c.id !== comment.id);
        let nc = newAddedComments.filter((c) => c.id !== comment.id);
        setComments(c);
        setNewAddedComments(nc);
        setTotalComments(totalComments - 1);
      })
      .catch((err) => {
        setCommentErrors(axiosErrorParser(err));
      });
  };

  const loadMore = () => {
    if (props.commentableType === CommentableType.COURSE) {
      loadCourseComments(currentPage + 1, PAGE_SIZE, sortOrder, comments);
    } else {
      loadLectureComments(currentPage + 1, PAGE_SIZE, sortOrder, comments);
    }
  };
  const saveComment = (comment: string) => {
    if (!authContext.isAuthenticated) {
      setCommentErrors([
        "You're not logged in. Please login to continue this action.",
      ]);
      return;
    }
    if (props.commentableType === CommentableType.COURSE) {
      saveCourseComment(comment);
    } else {
      saveLectureComment(comment);
    }
  };

  const sortComment = (order: string) => {
    setSortOrder(order);
    setShowSortDropdown(false);
    if (props.commentableType === CommentableType.COURSE) {
      loadCourseComments(0, PAGE_SIZE, order, []);
    } else {
      loadLectureComments(0, PAGE_SIZE, order, []);
    }
  };

  const deleteComment = (comment: IComment) => {
    if (!authContext.isAuthenticated) {
      setCommentErrors([
        "You're not logged in. Please login to continue this action.",
      ]);
      return;
    }

    if (props.commentableType === CommentableType.COURSE) {
      deleteCourseComment(comment);
    } else {
      deleteLectureComment(comment);
    }
  };

  return (
    <div
      className={`${styles.commentSection} ${
        props.className ? props.className : ""
      }`}
    >
      <div className={styles.commentTop}>
        <div className="mr-2">
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

      {commentErrors.length > 0 ? (
        <Alert
          errors={commentErrors}
          variant={AlertVariant.DANGER}
          closeHandler={() => setCommentErrors([])}
        />
      ) : null}

      <NewComment
        key={newCommentBody}
        onSubmit={(text) => saveComment(text)}
        commentBody={newCommentBody}
      />

      {newAddedComments.length > 0 ? (
        <CommentList
          className={styles.newAddedComment}
          comments={newAddedComments}
          commentableType={props.commentableType}
          commentableId={props.commentableId}
          hasMore={false}
          loadMore={loadMore}
          deleteHandler={deleteComment}
          errorHandler={(errors) => setCommentErrors(errors)}
        />
      ) : null}

      <CommentList
        comments={comments}
        commentableType={props.commentableType}
        commentableId={props.commentableId}
        hasMore={hasMore}
        loadMore={loadMore}
        deleteHandler={deleteComment}
        errorHandler={(errors) => setCommentErrors(errors)}
      />
      {isLoading && <Spinner size="3x" />}
    </div>
  );
};
export default CommentModule;
