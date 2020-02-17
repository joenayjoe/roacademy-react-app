import React, { useState } from "react";
import { ICourse, IChapter } from "../../settings/DataTypes";
import { Link } from "react-router-dom";
import {
  BUILD_ADMIN_USER_URL,
  BUILD_COURSE_WATCH_URL
} from "../../settings/Constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Collapse from "../../components/collapse/Collapse";

interface IProp {
  course: ICourse;
  chapters: IChapter[];
  className?: string;
}
const CourseDetail: React.FunctionComponent<IProp> = props => {
  const [collapsedChapter, setCollapsedChapter] = useState<IChapter | null>(
    null
  );

  const course = props.course;

  const handleChalpetClick = (ch: IChapter) => {
    collapsedChapter && collapsedChapter.id === ch.id
      ? setCollapsedChapter(null)
      : setCollapsedChapter(ch);
  };

  const courseObjectives = course.objectives.map(obj => {
    return (
      <li key={obj} className="course-objective-item">
        <FontAwesomeIcon icon="check" className="course-objective-icon" />
        <span className="course-objective-text">{obj}</span>
      </li>
    );
  });
  const courseRequirements = course.requirements.map(req => {
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

  const courseInfoList = (
    <ul className="course-info-list">
      <li className="course-info-item">
        <FontAwesomeIcon
          icon={["fab", "youtube"]}
          className="course-info-icon"
        />
        <span>20hrs of Videos</span>
      </li>
      <li className="course-info-item">
        <FontAwesomeIcon icon="file" className="course-info-icon" />
        <span>19 Articles</span>
      </li>
      <li className="course-info-item">
        <FontAwesomeIcon icon="tasks" className="course-info-icon" />
        <span>20 Exericices</span>
      </li>
      <li className="course-info-item">
        <FontAwesomeIcon icon="file-download" className="course-info-icon" />
        <span>20 Downloadable materials</span>
      </li>
    </ul>
  );

  const courseInfoMobile = (
    <div className="col-md-4 mt-2 mobile-course-info">
      <div className="course-enroll-btn mb-2">
        <button className="btn btn-outline-primary btn-block">
          <FontAwesomeIcon icon="calendar-check" />
          <strong className="pl-2"> Subscribe</strong>
        </button>
      </div>
      <div className="share-btn mb-2">
        <button className="btn btn-outline-primary btn-block">
          <FontAwesomeIcon icon="share" />
          <strong>
            <span className="pl-2">Share with friends</span>
          </strong>
        </button>
      </div>
      <h5>This course includes</h5>
      {courseInfoList}
    </div>
  );
  const courseInfoDesktop = (
    <div className="col-md-4 desktop-course-info">
      <div className="course-detail-info">
        <div className="course-detail-info-content shadow-sm">
          <h4>This course includes</h4>
          {courseInfoList}
          <div className="course-enroll-btn mb-2">
            <button className="btn btn-warning btn-block">
              <FontAwesomeIcon icon="calendar-check" />
              <span className="pl-2">Subscribe</span>
            </button>
          </div>
          <div className="share-btn mb-2">
            <button className="btn btn-info btn-block">
              <FontAwesomeIcon icon="share" />
              <span className="pl-2">Share with Friends</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const getLectureList = (ch: IChapter) => {
    return ch.lectures.map(lecture => {
      return (
        <Link key={`${lecture.id}_${lecture.name}`} to={"/"}>
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

  const chapterList = props.chapters.map(ch => {
    const icon =
      collapsedChapter && collapsedChapter.id === ch.id ? "minus" : "plus";
    return (
      <div key={`${ch.id}_${ch.name}`} className="chapter-list-item">
        <div
          className="chapter-list-header"
          onClick={() => handleChalpetClick(ch)}
        >
          <span className="mr-2">
            <FontAwesomeIcon icon={icon} size="sm" color="#003845" />
          </span>
          <span>{ch.name}</span>
        </div>
        <Collapse
          isOpen={
            collapsedChapter && collapsedChapter.id === ch.id ? true : false
          }
        >
          <div className="lecture-container">{getLectureList(ch)}</div>
        </Collapse>
      </div>
    );
  });

  const markupDescription = () => {
    return { __html: course.description };
  };

  const classNames = props.className ? props.className : "";
  return (
    <div className={`course-detail ${classNames}`}>
      <div className="course-detail-header">
        <div className="width-75">
          <div className="row">
            <div className="col-md-8">
              <h3 className="course-detail-title">{course.name}</h3>
              <div className="course-detail-headline">{course.headline}</div>
              <div className="course-detail-row">
                <div className="course-detail-item">Views {course.hits}</div>
              </div>
              <div className="course-detail-row">
                <div className="course-detail-item">
                  Created by{" "}
                  <Link
                    to={BUILD_ADMIN_USER_URL(course.createdBy.id)}
                    className="instructor-link"
                  >
                    {course.createdBy.firstName +
                      " " +
                      course.createdBy.lastName}
                  </Link>
                </div>
                <div className="course-detail-item">
                  Last Updated {course.updatedAt}
                </div>
              </div>
              <div className="course-detail-row">
                <div className="course-detail-item">Level {course.level}</div>
              </div>
            </div>
            {courseInfoDesktop}
          </div>
        </div>
      </div>
      <div className="course-detail-content width-75">
        <div className="row">
          {courseInfoMobile}
          <div className="col-md-8 pt-4">
            <div className="course-detail-objectives pt-2 shadow-sm">
              <h4>What you'll learn</h4>
              <ul className="course-objective-list">{courseObjectives}</ul>
            </div>
            <div className="course-detail-sections pt-4">
              <h4>Course content</h4>
              <div className="chapter-container">
                <div className="float-right pb-2">
                  <Link to={BUILD_COURSE_WATCH_URL(course.id)}>View All</Link>
                </div>
                <div style={{ clear: "right" }}>{chapterList}</div>
              </div>
            </div>
            <div className="course-detail-requirements pt-3">
              <h4>Requirements</h4>
              <ul className="course-requirement-list">{courseRequirements}</ul>
            </div>
            <div className="course-detail-description pt-3">
              <h4>Description</h4>
              <div dangerouslySetInnerHTML={markupDescription()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CourseDetail;
