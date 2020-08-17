import React from "react";
import CommentItem from "./CommentItem";
import { IComment, CommentableType } from "../../settings/DataTypes";

interface IProp {
  comments: IComment[];
  commentableType: CommentableType;
  commentableId: number;
  hasMore: boolean;
  loadMore: () => void;
  className?: string;
  deleteHandler: (comment: IComment) => void;
  errorHandler: (errors: string[]) => void;
}
const CommentList: React.FunctionComponent<IProp> = (props) => {
  const getCommentItems = () => {
    return props.comments.map((c) => {
      return (
        <CommentItem
          key={c.id}
          comment={c}
          commentableType={props.commentableType}
          commentableId={props.commentableId}
          deleteHandler={props.deleteHandler}
          errorHandler={props.errorHandler}
        />
      );
    });
  };

  const getLoadMoreLink = () => {
    if (props.hasMore) {
      return (
        <div
          className="btn btn-primary btn-sm"
          onClick={() => props.loadMore()}
        >
          Load More
        </div>
      );
    }
    return null;
  };
  return (
    <div className={`comment-list ${props.className ? props.className : ""}`}>
      {getCommentItems()}
      {getLoadMoreLink()}
    </div>
  );
};
export default CommentList;
