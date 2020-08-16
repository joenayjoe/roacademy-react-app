import React, { useState, useEffect, useContext, useRef } from "react";
import { RouteComponentProps, withRouter, Link } from "react-router-dom";
import ChapterService from "../../services/ChapterService";
import {
  IChapter,
  AlertVariant,
  ILecture,
  ILectureResource,
  ICommentRequest,
  IComment,
  CommentableType,
} from "../../settings/DataTypes";
import {
  BUILD_COURSE_WATCH_URL,
  PAGE_SIZE,
  DEFAULT_SORTING,
} from "../../settings/Constants";
import { axiosErrorParser } from "../../utils/errorParser";
import { parseQueryParams } from "../../utils/queryParser";
import Spinner from "../../components/spinner/Spinner";
import Alert from "../../components/flash/Alert";

import "./Player.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Collapse from "../../components/collapse/Collapse";
import ShowMoreText from "../../components/showmoretext/ShowMoreText";
import { isMobile } from "react-device-detect";
import LectureService from "../../services/LectureService";
import CommentList from "../../components/comment/CommentList";
import NewComment from "../../components/comment/NewComment";
import { AlertContext } from "../../contexts/AlertContext";
import DropDown from "../../components/dropdown/DropDown";

interface IProps extends RouteComponentProps {}

const CoursePlayer: React.FunctionComponent<IProps> = (props) => {
  const alertContext = useContext(AlertContext);

  const query_params = parseQueryParams(props.location.search);
  const courseId = parseInt(query_params["course_id"]);
  const playingLecutureId = parseInt(query_params["lecture_id"]);
  const playingChapterId = parseInt(query_params["chapter_id"]);

  const chapterService = new ChapterService();
  const lectureService = new LectureService();

  const [chapters, setChapters] = useState<IChapter[]>([]);

  const [chapterError, setChapterError] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [expandedChapterIds, setExpandedChapterIds] = useState<number[]>([]);
  const [playingLecture, setPlayingLecture] = useState<ILecture | null>(null);

  const [showPlayerControls, setShowPlayerControls] = useState<boolean>(false);
  const [showDescription, setShowDescription] = useState<boolean>(true);

  const [comments, setComments] = useState<IComment[]>([]);
  const [currentCommentPage, setCurrentCommentPage] = useState<number>(0);
  const [hasMoreComments, setHasMoreComments] = useState<boolean>(false);
  const [totlaComments, setTotalComments] = useState<number>(0);
  const [isCommentLoading, setIsCommentLoading] = useState<boolean>(true);
  const [newCommentBody, setNewCommentBody] = useState<string>("");
  const [commentSortOrder, setCommentSortOrder] = useState<string>(
    DEFAULT_SORTING
  );

  let sortDrpDwnRef = useRef<HTMLButtonElement>(null);
  let sortListRef = useRef<HTMLUListElement>(null);

  const [showSortDropdown, setShowSortDropdowm] = useState<boolean>(false);

  useEffect(() => {
    if (isMobile) {
      setShowDescription(false);
    }
    if (courseId > 0) {
      setIsLoading(true);
      chapterService
        .getChaptersByCourseId(courseId)
        .then((resp) => {
          setChapters(resp.data);
          if (playingLecutureId && playingChapterId) {
            setExpandedChapterIds([playingChapterId]);
            const ch = resp.data.find((ch) => ch.id === playingChapterId);
            if (ch) {
              const l = ch.lectures.find((l) => l.id === playingLecutureId);
              if (l) {
                setPlayingLecture(l);
                loadComments(l.id, 0, PAGE_SIZE);
              }
            }
          } else {
            if (resp.data.length) {
              setExpandedChapterIds([resp.data[0].id]);
              if (resp.data[0].lectures.length) {
                setPlayingLecture(resp.data[0].lectures[0]);
                loadComments(resp.data[0].lectures[0].id, 0, PAGE_SIZE);
                props.history.replace(
                  BUILD_COURSE_WATCH_URL(
                    courseId,
                    resp.data[0].id,
                    resp.data[0].lectures[0].id
                  )
                );
              }
            }
          }
          setIsLoading(false);
        })
        .catch((err) => {
          setChapterError(axiosErrorParser(err));
          setIsLoading(false);
        });
    }
    // eslint-disable-next-line
  }, [courseId]);

  useEffect(() => {
    document.addEventListener("mousedown", (e) => handleOnClick(e), false);

    return () => {
      document.removeEventListener("mousedown", (e) => handleOnClick(e), false);
    };
    // eslint-disable-next-line
  }, []);

  const handleOnClick = (e: MouseEvent) => {
    if (
      sortDrpDwnRef &&
      sortDrpDwnRef.current &&
      sortDrpDwnRef.current.contains(e.target as HTMLElement)
    ) {
      setShowSortDropdowm((showSortDropdown) => !showSortDropdown);
    } else if (
      !(
        sortListRef &&
        sortListRef.current &&
        sortListRef.current.contains(e.target as HTMLElement)
      )
    ) {
      setShowSortDropdowm(false);
    }
  };
  const loadComments = (lectureId: number, page: number, size: number) => {
    setIsCommentLoading(true);
    lectureService
      .getComments(lectureId, page, size, commentSortOrder)
      .then((resp) => {
        setComments([...comments, ...resp.data.content]);
        setCurrentCommentPage(resp.data.number);
        setTotalComments(resp.data.totalElements);
        setHasMoreComments(!resp.data.last);
        setIsCommentLoading(false);
      });
  };

  const saveComment = (text: string) => {
    setNewCommentBody(text);
    let comment: ICommentRequest = {
      commentBody: text,
    };
    lectureService
      .addComment(+courseId, comment)
      .then((resp) => {
        let c: IComment[] = [...comments];
        if (c.length >= PAGE_SIZE) {
          c.splice(-1, 1);
        }
        let cmnts: IComment[] = [resp.data, ...c];
        setComments(cmnts);
        setTotalComments(totlaComments + 1);
        setNewCommentBody("");
      })
      .catch((err) => {
        alertContext.show(axiosErrorParser(err).join(" "), AlertVariant.DANGER);
      });
  };

  const sortComment = (order: string) => {
    setIsCommentLoading(true);
    setCommentSortOrder(order);
    setShowSortDropdowm(false);
    lectureService
      .getComments(playingLecture!.id, 0, PAGE_SIZE, order)
      .then((resp) => {
        setComments(resp.data.content);
        setCurrentCommentPage(resp.data.number);
        setTotalComments(resp.data.totalElements);
        setHasMoreComments(!resp.data.last);
        setIsCommentLoading(false);
      });
  };

  const loadNextCommentPage = () => {
    loadComments(playingLecture!.id, currentCommentPage + 1, 10);
  };

  const deleteComment = (comment: IComment) => {
    lectureService
      .deleteComment(playingLecture!.id, comment.id)
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
  };

  const handleChapterViewClick = (chapter: IChapter) => {
    let ids = [...expandedChapterIds];
    if (ids.includes(chapter.id)) {
      ids.splice(ids.indexOf(chapter.id), 1);
    } else {
      ids.push(chapter.id);
    }
    setExpandedChapterIds(ids);
  };

  const handleLectureViewClick = (ch: IChapter, lecture: ILecture) => {
    setPlayingLecture(lecture);
    loadComments(lecture.id, 0, PAGE_SIZE);
    props.history.push(BUILD_COURSE_WATCH_URL(courseId, ch.id, lecture.id));
  };

  const handlePrevClick = () => {
    let found = false;
    let pc = null;
    let pl = null;
    for (let ch of chapters) {
      for (let l of ch.lectures) {
        if (l.id === playingLecutureId) {
          found = true;
          break;
        } else {
          pc = ch;
          pl = l;
        }
      }
      if (found) {
        break;
      }
    }
    if (pc && pl) {
      setPlayingLecture(pl);
      loadComments(pl.id, 0, PAGE_SIZE);
      setExpandedChapterIds([pc.id]);
      props.history.push(BUILD_COURSE_WATCH_URL(courseId, pc.id, pl.id));
    }
  };
  const handleNextClick = () => {
    let found = false;
    let terminate = false;
    let nc = null;
    let nl = null;
    for (let ch of chapters) {
      for (let l of ch.lectures) {
        if (l.id === playingLecutureId) {
          found = true;
          continue;
        }
        if (found) {
          terminate = true;
          nc = ch;
          nl = l;
          break;
        }
      }
      if (terminate) {
        break;
      }
    }
    if (nc && nl) {
      setPlayingLecture(nl);
      loadComments(nl.id, 0, PAGE_SIZE);
      setExpandedChapterIds([nc.id]);
      props.history.push(BUILD_COURSE_WATCH_URL(courseId, nc.id, nl.id));
    }
  };

  const handleTitleClick = () => {
    if (isMobile) {
      setShowDescription(!showDescription);
    }
  };

  const lectureList = (chapter: IChapter) => {
    return chapter.lectures.map((lecture) => {
      const klass =
        playingLecture && playingLecture.id === lecture.id ? "playing" : "";
      return (
        <div
          key={`${lecture.id}_${lecture.name}`}
          className={`lecture-view-item ${klass}`}
          onClick={() => handleLectureViewClick(chapter, lecture)}
        >
          <span>{lecture.name}</span>
        </div>
      );
    });
  };

  const getExapndIcon = (ch: IChapter) => {
    return expandedChapterIds.includes(ch.id) ? "angle-up" : "angle-down";
  };
  const chapterList = chapters.map((ch) => {
    return (
      <div key={`${ch.id}_${ch.name}`} className="collapse-menu-item">
        <div
          className="collapse-item-header chapter-view-item"
          onClick={() => handleChapterViewClick(ch)}
        >
          <span>{ch.name}</span>
          <span>
            <FontAwesomeIcon icon={getExapndIcon(ch)} />
          </span>
        </div>
        <Collapse isOpen={expandedChapterIds.includes(ch.id)}>
          {lectureList(ch)}
        </Collapse>
      </div>
    );
  });

  const getLectureDescription = () => {
    return showDescription ? (
      <div className="lecture-description">
        <ShowMoreText
          key={playingLecture ? playingLecture.id : undefined}
          expanded={false}
        >
          <div
            className="description"
            dangerouslySetInnerHTML={markupDescription()}
          />
        </ShowMoreText>
      </div>
    ) : null;
  };
  const getFileResourcesForPlayingLecture = () => {
    let resources =
      playingLecture &&
      playingLecture.lectureResources.map((resource) => {
        if (!resource.contentType.startsWith("video/")) {
          return (
            <div className="lecture-file-resource" key={resource.id}>
              <FontAwesomeIcon icon="file-pdf" className="mr-2" />
              <Link to={{ pathname: resource.fileUrl }} target="_blank">
                {resource.fileName}
              </Link>
            </div>
          );
        }
        return null;
      });

    return resources && resources.length ? (
      <div className="lecture-resources">
        <h4>Resources</h4>
        {resources}
      </div>
    ) : null;
  };

  const markupDescription = () => {
    if (playingLecture) {
      return { __html: playingLecture.description };
    } else {
      return undefined;
    }
  };

  const buildIframeSrc = (resources: ILectureResource[]) => {
    let vr: ILectureResource | undefined;
    let url: string | undefined;
    for (let resource of resources) {
      if (resource.contentType.startsWith("video/")) {
        vr = resource;
        break;
      }
    }
    if (vr) {
      const params =
        "?controls=1&enablejsapi=1&modestbranding=1&showinfo=0&iv_load_policy=3&html5=1&fs=1&rel=0&hl=en&cc_lang_pref=en&cc_load_policy=1&start=0&autoplay=1";
      url = "https://www.youtube-nocookie.com/embed/" + vr.fileUrl + params;
    }
    return url;
  };
  const getIframeForPlayingLecture = () => {
    if (playingLecture) {
      if (playingLecture.lectureResources.length > 0) {
        let contentSrc = buildIframeSrc(playingLecture.lectureResources);
        if (contentSrc == null) {
          return (
            <div className="empty-resource">
              <h1>No Video Found</h1>
              <p>See the resources below</p>
            </div>
          );
        } else {
          return (
            <iframe
              title="Lecture View Frame"
              style={{ width: "100%", height: "100%" }}
              src={contentSrc}
            ></iframe>
          );
        }
      } else {
        return (
          <div className="empty-resource">
            <h1>Content Not Found</h1>
          </div>
        );
      }
    }
    return null;
  };

  const getPlayerContent = () => {
    if (chapterError.length) {
      return <Alert errors={chapterError} variant={AlertVariant.DANGER} />;
    } else {
      const controlKlass = showPlayerControls ? "d-block" : "d-none";
      return (
        <React.Fragment>
          <div
            className="player-section"
            onMouseEnter={() => setShowPlayerControls(true)}
            onMouseLeave={() => setShowPlayerControls(false)}
          >
            <div
              className={`player-control player-prev-btn ${controlKlass}`}
              onClick={handlePrevClick}
            >
              <FontAwesomeIcon icon="angle-left" size="2x" />
            </div>
            <div className="player">{getIframeForPlayingLecture()}</div>
            <div
              className={`player-control player-next-btn ${controlKlass}`}
              onClick={handleNextClick}
            >
              <FontAwesomeIcon icon="angle-right" size="2x" />
            </div>
          </div>

          <div className="player-info-section">
            <div className="player-title" onClick={handleTitleClick}>
              <h4 className="mr-2">{playingLecture && playingLecture.name}</h4>
              {isMobile && (
                <FontAwesomeIcon
                  icon={showDescription ? "angle-up" : "angle-down"}
                />
              )}
            </div>
            {getLectureDescription()}
            {getFileResourcesForPlayingLecture()}
          </div>

          <div className="player-menu-section collapse-menu">{chapterList}</div>

          <div className="comment-section">
            <div className="comment-top">
              <div className="comment-count mr-2">
                <h5>{totlaComments} Comments</h5>
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
            <NewComment
              key={newCommentBody}
              commentBody={newCommentBody}
              onSubmit={saveComment}
            />
            {isCommentLoading ? (
              <Spinner size="3x" />
            ) : (
              <CommentList
                comments={comments}
                commentableType={CommentableType.LECTURE}
                commentableId={playingLecture!.id}
                deleteHandler={deleteComment}
                loadMore={loadNextCommentPage}
                hasMore={hasMoreComments}
              />
            )}
          </div>
        </React.Fragment>
      );
    }
  };

  if (isLoading) {
    return <Spinner size="3x" />;
  }
  return <div className="course-player-wrapper">{getPlayerContent()}</div>;
};
export default withRouter(CoursePlayer);
