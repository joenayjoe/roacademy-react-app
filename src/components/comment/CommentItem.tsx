import React, { useState, useContext } from "react";
import {
  IComment,
  CommentableType,
  ICommentRequest,
} from "../../settings/DataTypes";
import Avatar from "../avatar/Avatar";
import AuthService from "../../services/AuthService";
import { Link } from "react-router-dom";
import {
  BUILD_PUBLIC_USER_PROFILE_URL,
  PAGE_SIZE,
} from "../../settings/Constants";
import { timeAgo } from "../../utils/DateUtils";
import { CourseService } from "../../services/CourseService";
import NewComment from "./NewComment";
import CommentList from "./CommentList";
import LectureService from "../../services/LectureService";
import { axiosErrorParser } from "../../utils/errorParser";
import Spinner from "../spinner/Spinner";
import { AuthContext } from "../../contexts/AuthContext";
import ConfirmDialog from "../modal/ConfirmDialog";

interface IProp {
  comment: IComment;
  className?: string;
  commentableType: CommentableType;
  commentableId: number;
  deleteHandler: (comment: IComment) => void;
  errorHandler: (errors: string[]) => void;
}

const CommentItem: React.FunctionComponent<IProp> = (props) => {
  const authService = new AuthService();
  const authContext = useContext(AuthContext);
  const courseService = new CourseService();
  const lectureService = new LectureService();
  const avatarStyle = { width: "48px", height: "48px", cursor: "pointer" };

  const [comment, setComment] = useState<IComment>(props.comment);
  const [showReplyForm, setShowReplyForm] = useState<boolean>(false);
  const [replies, setReplies] = useState<IComment[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [hasMoreReplies, setHasMoreReplies] = useState<boolean>(false);
  const [newReplyBody, setNewReplyBody] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(
    false
  );
  const [newAddedReplies, setNewAddedReplies] = useState<IComment[]>([]);

  const loadCourseReplies = (page: number, size: number) => {
    setIsLoading(true);
    courseService
      .getReplies(props.commentableId, comment.id, page, size)
      .then((resp) => {
        setReplies([...replies, ...resp.data.content]);
        setCurrentPage(resp.data.number);
        setHasMoreReplies(!resp.data.last);
        setComment({ ...comment, numberOfReplies: resp.data.totalElements });
        setIsLoading(false);
      })
      .catch((err) => {
        props.errorHandler(axiosErrorParser(err));
      });
  };

  const loadLectureReplies = (page: number, size: number) => {
    setIsLoading(true);
    lectureService
      .getReplies(props.commentableId, comment.id, page, size)
      .then((resp) => {
        setReplies([...replies, ...resp.data.content]);
        setCurrentPage(resp.data.number);
        setHasMoreReplies(!resp.data.last);
        setComment({ ...comment, numberOfReplies: resp.data.totalElements });
        setIsLoading(false);
      })
      .catch((err) => {
        props.errorHandler(axiosErrorParser(err));
      });
  };

  const loadReplies = (page: number, size: number) => {
    setNewAddedReplies([]);

    if (props.commentableType === CommentableType.COURSE) {
      loadCourseReplies(page, size);
    } else {
      loadLectureReplies(page, size);
    }
  };

  const deleteReply = (reply: IComment) => {
    if (!authContext.isAuthenticated) {
      props.errorHandler([
        "You're not logged in. Please login to continue this action.",
      ]);
      return;
    }

    if (props.commentableType === CommentableType.COURSE) {
      courseService
        .deleteComment(props.commentableId, reply.id)
        .then((resp) => {
          let r = replies.filter((c) => c.id !== reply.id);
          let nr = newAddedReplies.filter((c) => c.id !== reply.id);
          setReplies(r);
          setNewAddedReplies(nr);
          setComment({
            ...comment,
            numberOfReplies: comment.numberOfReplies - 1,
          });
        })
        .catch((err) => {
          props.errorHandler(axiosErrorParser(err));
        });
    } else {
      lectureService
        .deleteComment(props.commentableId, reply.id)
        .then((resp) => {
          let r = replies.filter((c) => c.id !== reply.id);
          let nr = newAddedReplies.filter((c) => c.id !== reply.id);
          setReplies(r);
          setNewAddedReplies(nr);
          setComment({
            ...comment,
            numberOfReplies: comment.numberOfReplies - 1,
          });
        })
        .catch((err) => {
          props.errorHandler(axiosErrorParser(err));
        });
    }
  };

  const handleViewReplyClick = () => {
    loadReplies(currentPage, PAGE_SIZE);
  };

  const handleHideReplyClick = () => {
    setReplies([]);
    setNewAddedReplies([]);
    setCurrentPage(0);
    setHasMoreReplies(false);
  };

  const loadMoreReplies = () => {
    setNewAddedReplies([]);
    loadReplies(currentPage + 1, PAGE_SIZE);
  };

  const markupReply = (text: string) => {
    return { __html: text };
  };

  const handleNewReplySubmit = (text: string) => {
    if (!authContext.isAuthenticated) {
      props.errorHandler([
        "You're not logged in. Please login to continue this action.",
      ]);
      return;
    }
    setNewReplyBody(text);

    let mention = `<a href=${BUILD_PUBLIC_USER_PROFILE_URL(
      comment.commentedBy.id
    )}>@${authService.getUserFullName(comment.commentedBy)}</a>`;

    let reply: ICommentRequest = {
      commentBody: mention + " " + text,
    };

    if (props.commentableType === CommentableType.COURSE) {
      courseService
        .addCommentReply(props.commentableId, comment.id, reply)
        .then((resp) => {
          setNewAddedReplies([...newAddedReplies, resp.data]);
          setComment({
            ...comment,
            numberOfReplies: comment.numberOfReplies + 1,
          });
          setNewReplyBody("");
          setShowReplyForm(false);
        })
        .catch((err) => {
          props.errorHandler(axiosErrorParser(err));
        });
    } else {
      lectureService
        .addCommentReply(props.commentableId, comment.id, reply)
        .then((resp) => {
          setNewAddedReplies([...newAddedReplies, resp.data]);
          setComment({
            ...comment,
            numberOfReplies: comment.numberOfReplies + 1,
          });
          setNewReplyBody("");
          setShowReplyForm(false);
        })
        .catch((err) => {
          props.errorHandler(axiosErrorParser(err));
        });
    }
  };

  const getDisplayReplyLink = () => {
    if (replies.length) {
      return (
        <div className="text-primary link" onClick={handleHideReplyClick}>
          Hide Replies
        </div>
      );
    } else if (comment.numberOfReplies > 0) {
      return (
        <div className="text-primary link" onClick={handleViewReplyClick}>
          View {comment.numberOfReplies} Replies
        </div>
      );
    }
    return null;
  };

  const getReplies = () => {
    return (
      <React.Fragment>
        <CommentList
          comments={replies}
          commentableType={props.commentableType}
          commentableId={props.commentableId}
          hasMore={hasMoreReplies}
          loadMore={loadMoreReplies}
          deleteHandler={deleteReply}
          errorHandler={props.errorHandler}
        />

        {newAddedReplies.length > 0 ? (
          <CommentList
            className="new-added-comment"
            comments={newAddedReplies}
            commentableType={props.commentableType}
            commentableId={props.commentableId}
            hasMore={false}
            loadMore={loadMoreReplies}
            deleteHandler={deleteReply}
            errorHandler={props.errorHandler}
          />
        ) : null}
        {isLoading ? <Spinner size="3x" /> : null}
      </React.Fragment>
    );
  };

  const getNewReplyForm = () => {
    if (showReplyForm) {
      return (
        <NewComment
          className="mt-2"
          key={newReplyBody}
          commentBody={newReplyBody}
          onCancel={() => setShowReplyForm(false)}
          onSubmit={handleNewReplySubmit}
          autoFocus={true}
        />
      );
    }
    return null;
  };

  const getCommentDeleteComfimationDialog = () => {
    return (
      <ConfirmDialog
        isOpen={showConfirmationModal}
        onConfirmHandler={() => props.deleteHandler(comment)}
        onDismissHandler={() => setShowConfirmationModal(false)}
      />
    );
  };

  return (
    <React.Fragment>
      {getCommentDeleteComfimationDialog()}

      <div
        className={`comment-item d-flex flex-row mt-3 mb-3 ${
          props.className ? props.className : ""
        }`}
      >
        <div className="avatar mr-2">
          <Avatar styles={avatarStyle} user={comment.commentedBy} />
        </div>
        <div className="flex-fill">
          <div>
            <Link to={BUILD_PUBLIC_USER_PROFILE_URL(comment.commentedBy.id)}>
              {authService.getUserFullName(comment.commentedBy)}
            </Link>
            <span className="text-secondary ml-2">
              {timeAgo(comment.createdAt)}
            </span>
          </div>
          <div dangerouslySetInnerHTML={markupReply(comment.commentBody)} />
          <div className="comment-actions-wrapper d-flex">
            {authContext.currentUser &&
              authContext.currentUser.id === comment.commentedBy.id && (
                <div
                  className="link text-secondary mr-2"
                  onClick={() => setShowConfirmationModal(true)}
                >
                  Delete
                </div>
              )}
            <div
              className="link text-secondary"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              Reply
            </div>
          </div>
          {getNewReplyForm()}
          {getDisplayReplyLink()}
          {getReplies()}
        </div>
      </div>
    </React.Fragment>
  );
};
export default CommentItem;
