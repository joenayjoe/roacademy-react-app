import React, { useState, useEffect, FormEvent } from "react";
import { ICourse, IChapter } from "../../settings/DataTypes";
import { Link } from "react-router-dom";
import {
  BUILD_COURSE_WATCH_URL,
  BUILD_PUBLIC_USER_PROFILE_URL,
  BUILD_COURSE_URL,
  FRONT_END_DOMAIN,
} from "../../settings/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Collapse from "../../components/collapse/Collapse";
import ShowMoreText from "../../components/showmoretext/ShowMoreText";
import ShareDialog from "../../components/modal/ShareDialog";

import styles from "./Course.module.css";

interface IProp {
  course: ICourse;
  chapters: IChapter[];
  isSubscribed: boolean;
  subscribeHandler: () => void;
  className?: string;
}

const CourseDetail: React.FunctionComponent<IProp> = (props) => {
  const [expandedChapterIds, setExpandedChapterIds] = useState<number[]>([]);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    if (props.chapters.length) {
      setExpandedChapterIds([props.chapters[0].id]);
    }
    // eslint-disable-next-line
  }, []);

  const handleChapterClick = (ch: IChapter) => {
    let eids = [...expandedChapterIds];
    if (eids.includes(ch.id)) {
      eids.splice(eids.indexOf(ch.id), 1);
    } else {
      eids.push(ch.id);
    }
    console.log("ids = ", eids);
    setExpandedChapterIds(eids);
  };

  const expandAll = (e: FormEvent) => {
    e.preventDefault();
    if (expandedChapterIds.length === props.chapters.length) {
      setExpandedChapterIds([]);
    } else {
      let ids = props.chapters.map((c) => c.id);
      setExpandedChapterIds(ids);
    }
  };

  const courseObjectives = props.course.objectives.map((obj) => {
    return (
      <li key={obj} className={styles.course_objective_item}>
        <FontAwesomeIcon icon="check" className="course-objective-icon" />
        <span className="course-objective-text">{obj}</span>
      </li>
    );
  });
  const courseRequirements = props.course.requirements.map((req) => {
    return (
      <li key={req} className="course-requirement-item">
        <FontAwesomeIcon
          icon="dot-circle"
          className="course-requirement-icon"
        />
        <span className="course-requirement-text">{req}</span>
      </li>
    );
  });

  const getLectureList = (ch: IChapter) => {
    return ch.lectures.map((lecture) => {
      return (
        <Link
          key={`${lecture.id}_${lecture.name}`}
          to={BUILD_COURSE_WATCH_URL(props.course.id, ch.id, lecture.id)}
        >
          <div className="lecture-list-item">
            <span className="mr-3">
              <FontAwesomeIcon icon={["fab", "youtube"]}></FontAwesomeIcon>
            </span>
            <span>{lecture.name}</span>
          </div>
        </Link>
      );
    });
  };

  const chapterList = props.chapters.map((ch) => {
    const icon = expandedChapterIds.includes(ch.id) ? "minus" : "plus";
    return (
      <div
        key={`${ch.id}_${ch.name}`}
        className="chapter-list-item collapse-menu-item"
      >
        <div
          className="chapter-list-header collapse-item-header"
          onClick={() => handleChapterClick(ch)}
        >
          <span>{ch.name}</span>
          <span>
            <FontAwesomeIcon icon={icon} size="sm" color="#003845" />
          </span>
        </div>
        <Collapse isOpen={expandedChapterIds.includes(ch.id)}>
          <div className="lecture-container">{getLectureList(ch)}</div>
        </Collapse>
      </div>
    );
  });

  const markupDescription = () => {
    return { __html: props.course.description };
  };

  const classNames = props.className ? props.className : "";
  return (
    <div className={`course-detail ${classNames}`}>
      {isShareDialogOpen && (
        <ShareDialog
          isOpen={isShareDialogOpen}
          title="Share this course"
          description={
            "You might like this course on @RoAcademy: " + props.course.name
          }
          link={FRONT_END_DOMAIN + BUILD_COURSE_URL(props.course.id)}
          closeHandler={() => setIsShareDialogOpen(false)}
        />
      )}
      <div className={styles.courseDetailHeader}>
        <div className="width-75">
          <div className="row">
            <div className="col-md-8">
              <h3 className={styles.courseDetailTitle}>{props.course.name}</h3>
              <div className={styles.courseDetailHeadline}>
                {props.course.headline}
              </div>
              <div className={styles.courseDetailRow}>
                <div className={styles.courseDetailItem}>
                  Views {props.course.hits}
                </div>
              </div>
              <div className={styles.courseDetailRow}>
                <div className={styles.courseDetailItem}>
                  Created by{" "}
                  <Link
                    to={BUILD_PUBLIC_USER_PROFILE_URL(
                      props.course.createdBy.id
                    )}
                    className={styles.instructorLink}
                  >
                    {props.course.createdBy.firstName +
                      " " +
                      props.course.createdBy.lastName}
                  </Link>
                </div>
              </div>
              <div className={styles.courseDetailRow}>
                <div className={styles.courseDetailItem}>
                  Level {props.course.level}
                </div>
              </div>
              <div className={styles.courseDetailRow}>
                <div className={styles.courseDetailItem}>
                  <button
                    className={`btn ${
                      props.isSubscribed
                        ? "btn-outline-warning"
                        : "btn-outline-info"
                    }`}
                    onClick={props.subscribeHandler}
                  >
                    <FontAwesomeIcon icon="calendar-check" />
                    <span className="pl-2">
                      {props.isSubscribed ? "Unsubscribe" : "Subscribe"}
                    </span>
                  </button>
                </div>
                <div className={styles.courseDetailItem}>
                  <button
                    className=" btn btn-outline-info"
                    type="button"
                    onClick={() => setIsShareDialogOpen(true)}
                  >
                    <FontAwesomeIcon icon="share" />
                    <span className="pl-2">Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="width-75">
        <div className="row">
          <div className="col-md-8 pt-4">
            <div className={styles.courseDetailObjectives + " pt-2 shadow-sm"}>
              <h4>What you'll learn</h4>
              <ul className={styles.courseObjectiveList}>{courseObjectives}</ul>
            </div>
            <div className="pt-4">
              <h4>Course content</h4>
              <div className="chapter-container">
                <div className="float-right pb-2">
                  <button className="btn btn-link mr-2" onClick={expandAll}>
                    {expandedChapterIds.length === props.chapters.length
                      ? "Collapse All"
                      : "Expand All"}
                  </button>

                  <Link to={BUILD_COURSE_WATCH_URL(props.course.id)}>
                    View All
                  </Link>
                </div>
                <div style={{ clear: "right" }} className="collapse-menu">
                  {chapterList}
                </div>
              </div>
            </div>
            <div className="pt-3">
              <h4>Requirements</h4>
              <ul className={styles.courseRequirementList}>
                {courseRequirements}
              </ul>
            </div>
            <div className="pt-3">
              <h4>Description</h4>
              <ShowMoreText height={200}>
                <div dangerouslySetInnerHTML={markupDescription()} />
              </ShowMoreText>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CourseDetail;
