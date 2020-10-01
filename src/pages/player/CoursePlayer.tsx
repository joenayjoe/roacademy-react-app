import React, { useState, useEffect } from "react";
import { RouteComponentProps, withRouter, Link } from "react-router-dom";
import ChapterService from "../../services/ChapterService";
import {
  IChapter,
  AlertVariant,
  ILecture,
  ILectureResource,
  CommentableType,
} from "../../settings/DataTypes";
import { BUILD_COURSE_WATCH_URL } from "../../settings/Constants";
import { axiosErrorParser } from "../../utils/errorParser";
import { parseQueryParams } from "../../utils/queryParser";
import Spinner from "../../components/spinner/Spinner";
import Alert from "../../components/flash/Alert";

import "./Player.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Collapse from "../../components/collapse/Collapse";
import ShowMoreText from "../../components/showmoretext/ShowMoreText";
import { isMobile } from "react-device-detect";
import CommentModule from "../../components/comment/CommentModule";

interface IProps extends RouteComponentProps {}

const CoursePlayer: React.FunctionComponent<IProps> = (props) => {
  const query_params = parseQueryParams(props.location.search);
  const courseId = parseInt(query_params["course_id"]);
  const playingLecutureId = parseInt(query_params["lecture_id"]);
  const playingChapterId = parseInt(query_params["chapter_id"]);

  const chapterService = new ChapterService();

  const [chapters, setChapters] = useState<IChapter[]>([]);

  const [chapterError, setChapterError] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [expandedChapterIds, setExpandedChapterIds] = useState<number[]>([]);
  const [playingLecture, setPlayingLecture] = useState<ILecture | null>(null);

  const [showPlayerControls, setShowPlayerControls] = useState<boolean>(false);
  const [showDescription, setShowDescription] = useState<boolean>(true);

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
          setIsLoading(false);
        })
        .catch((err) => {
          setChapterError(axiosErrorParser(err));
          setIsLoading(false);
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
              <Link to={{ pathname: resource.fileName }} target="_blank">
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
      url = "https://www.youtube-nocookie.com/embed/" + vr.resourceId + params;
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

          {playingLecture && (
            <CommentModule
              key={playingLecture.id}
              commentableType={CommentableType.LECTURE}
              commentableId={playingLecture.id}
            />
          )}
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
