import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { CourseService } from "../../services/CourseService";
import ChapterService from "../../services/ChapterService";
import {
  ICourse,
  IChapter,
  AlertVariant,
  ILecture,
  ILectureResource
} from "../../settings/DataTypes";
import {
  DEFAULT_COURSE_STATUS,
  BUILD_COURSE_WATCH_URL
} from "../../settings/Constants";
import { parseError } from "../../utils/errorParser";
import { parseQueryParams } from "../../utils/queryParser";
import Spinner from "../../components/spinner/Spinner";
import Alert from "../../components/flash/Alert";

import "./Player.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Avatar from "../../components/avatar/Avatar";
import { AuthContext } from "../../contexts/AuthContext";
import Collapse from "../../components/collapse/Collapse";

interface IProps extends RouteComponentProps {}

const CoursePlayer: React.FunctionComponent<IProps> = props => {
  const authContext = useContext(AuthContext);

  const query_params = parseQueryParams(props.location.search);
  const courseId = parseInt(query_params["course_id"]);
  const playingLecutureId = parseInt(query_params["lecture_id"]);
  const playingChapterId = parseInt(query_params["chapter_id"]);

  const courseService = new CourseService();
  const chapterService = new ChapterService();

  const [course, setCourse] = useState<ICourse | null>(null);
  const [chapters, setChapters] = useState<IChapter[]>([]);

  const [courseError, setCourseError] = useState<string[]>([]);
  const [chapterError, setChapterError] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [expandedChapterIds, setExpandedChapterIds] = useState<number[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [playingLecture, setPlayingLecture] = useState<ILecture | null>(null);

  // const [nextChapter, setNextChapter] = useState<IChapter | null>(null);
  // const [prevChapter, setPrevChapter] = useState<IChapter | null>(null);

  // const [nextLecture, setNextLecture] = useState<ILecture | null>(null);
  // const [prevLecture, setPrevLecture] = useState<ILecture | null>(null);

  const [showPlayerControls, setShowPlayerControls] = useState<boolean>(false);

  const avatarStyle = { width: "48px", height: "48px", cursor: "pointer" };

  useEffect(() => {
    if (courseId > 0) {
      courseService
        .getCourse(courseId, DEFAULT_COURSE_STATUS)
        .then(response => {
          setCourse(response.data);
          chapterService
            .getChaptersByCourseId(response.data.id)
            .then(resp => {
              setChapters(resp.data);
              if (playingLecutureId && playingChapterId) {
                setExpandedChapterIds([playingChapterId]);
                const ch = resp.data.find(ch => ch.id === playingChapterId);
                if (ch) {
                  const l = ch.lectures.find(l => l.id === playingLecutureId);
                  if (l) {
                    setPlayingLecture(l);
                  }
                }
              } else {
                if (resp.data.length) {
                  setExpandedChapterIds([resp.data[0].id]);
                  if (resp.data[0].lectures.length) {
                    setPlayingLecture(resp.data[0].lectures[0]);
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
              setIsLoaded(true);
            })
            .catch(err => {
              setChapterError(parseError(err));
              setIsLoaded(true);
            });
        })
        .catch(err => {
          setCourseError(parseError(err));
          setIsLoaded(true);
        });
    }
    // eslint-disable-next-line
  }, [courseId]);

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
      setExpandedChapterIds([nc.id]);
      props.history.push(BUILD_COURSE_WATCH_URL(courseId, nc.id, nl.id));
    }
  };

  const lectureList = (chapter: IChapter) => {
    return chapter.lectures.map(lecture => {
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
  const chapterList = chapters.map(ch => {
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

  const markupDescription = () => {
    if (playingLecture) {
      return { __html: playingLecture.description };
    } else {
      return undefined;
    }
  };

  const buildIframeSrc = (resource: ILectureResource) => {
    if (resource.contentType.startsWith("video")) {
      const params =
        "?controls=1&enablejsapi=1&modestbranding=1&showinfo=0&iv_load_policy=3&html5=1&fs=1&rel=0&hl=en&cc_lang_pref=en&cc_load_policy=1&start=0&autoplay=1";
      const url =
        "https://www.youtube-nocookie.com/embed/" + resource.fileUrl + params;
      return url;
    } else {
      const url =
        "https://docs.google.com/viewer?url=" +
        resource.fileUrl +
        "&embedded=true";
      return url;
    }
  };
  const getIframeForPlayingLecture = () => {
    if (playingLecture) {
      if (playingLecture.lectureResource) {
        return (
          <iframe
            style={{ width: "100%", height: "100%" }}
            src={buildIframeSrc(playingLecture.lectureResource)}
          ></iframe>
        );
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
    } else if (courseError.length) {
      return <Alert errors={courseError} variant={AlertVariant.DANGER} />;
    } else {
      const controlKlass = showPlayerControls ? "d-block" : "d-none";
      return (
        <React.Fragment>
          <div
            className="player-container"
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

          <div className="player-menu collapse-menu">{chapterList}</div>

          <div className="cp-bottom-container">
            <div className="description">
              <h4>{playingLecture && playingLecture.name}</h4>
              <div dangerouslySetInnerHTML={markupDescription()} />
            </div>
            <div className="comment-section">
              <div className="comment-top">
                <div className="comment-count mr-2">
                  <h5>29 Comments</h5>
                </div>
                <div className="comment-filter">Filter</div>
              </div>
              <div className="new-comment">
                <div className="avatar mr-2">
                  <Avatar user={authContext.currentUser} styles={avatarStyle} />
                </div>
                <form className="comment-form">
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      value={newComment}
                      placeholder="Add a public comment"
                      onChange={e => setNewComment(e.target.value)}
                    />
                  </div>
                  <div className="form-group float-right">
                    <button type="button" className="btn btn-danger mr-2">
                      CANCEL
                    </button>
                    <button type="submit" className="btn btn-primary">
                      COMMENT
                    </button>
                  </div>
                </form>
              </div>
              <div className="comment-list">
                <div className="comment">
                  <div className="avatar mr-2">
                    <Avatar
                      styles={avatarStyle}
                      user={authContext.currentUser}
                    />
                  </div>
                  <div>this is a comment</div>
                </div>
                <div className="comment">
                  <div className="avatar mr-2">
                    <Avatar
                      styles={avatarStyle}
                      user={authContext.currentUser}
                    />
                  </div>
                  <div>this is a comment</div>
                </div>
                <div className="comment">
                  <div className="avatar mr-2">
                    <Avatar
                      styles={avatarStyle}
                      user={authContext.currentUser}
                    />
                  </div>
                  <div>this is a comment</div>
                </div>
                <div className="comment">
                  <div className="avatar mr-2">
                    <Avatar
                      styles={avatarStyle}
                      user={authContext.currentUser}
                    />
                  </div>
                  <div>this is a comment</div>
                </div>
                <div className="comment">
                  <div className="avatar mr-2">
                    <Avatar
                      styles={avatarStyle}
                      user={authContext.currentUser}
                    />
                  </div>
                  <div>this is a comment</div>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      );
    }
  };
  return isLoaded ? (
    <div className="course-player">{getPlayerContent()}</div>
  ) : (
    <Spinner size="3x" />
  );
};
export default withRouter(CoursePlayer);
