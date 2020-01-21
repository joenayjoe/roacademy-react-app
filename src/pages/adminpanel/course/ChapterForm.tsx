import React, { useState, useContext, FormEvent, useEffect } from "react";
import ChapterService from "../../../services/ChapterService";
import { AlertContext } from "../../../contexts/AlertContext";
import {
  IChapter,
  ICourse,
  INewChapter,
  IEditChapter,
  HTTPStatus,
  AlertVariant
} from "../../../settings/DataTypes";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { parseError } from "../../../utils/errorParser";
import Alert from "../../../components/flash/Alert";

interface IProp extends RouteComponentProps {
  course: ICourse;
}
const ChapterForm: React.FunctionComponent<IProp> = props => {
  const alertContext = useContext(AlertContext);
  const chapterService = new ChapterService();

  const [chapters, setChapters] = useState<IChapter[]>([]);

  const [currentEditChapter, setCurrentEditChapter] = useState<IChapter | null>(
    null
  );
  const [editChapterIndex, setEditChapterIndex] = useState<number | null>(null);
  const [editChapterErrors, setEditChapterErrors] = useState<string[]>([]);

  const [newChapterName, setNewChapterName] = useState<string>("");
  const [showNewChapter, setShowNewChapter] = useState<boolean>(false);
  const [newChapterErrors, setNewChapterErrors] = useState<string[]>([]);

  useEffect(() => {
    chapterService.getChaptersByCourseId(props.course.id).then(resp => {
      setChapters(resp.data);
    });
    // eslint-disable-next-line
  }, []);

  const submitNewChapter = (e: FormEvent) => {
    e.preventDefault();
    const newChapter: INewChapter = {
      name: newChapterName,
      courseId: props.course.id
    };

    chapterService
      .createChapter(props.course.id, newChapter)
      .then(resp => {
        const chptrs = [...chapters];
        chptrs.push(resp.data);
        setChapters(chptrs);
        setShowNewChapter(false);
        setNewChapterErrors([]);
      })
      .catch(err => {
        setNewChapterErrors(parseError(err));
      });
  };

  const submitChapterEdit = (e: FormEvent) => {
    e.preventDefault();
    if (currentEditChapter && editChapterIndex !== null) {
      const edit_ch: IEditChapter = {
        id: currentEditChapter.id,
        name: currentEditChapter.name,
        courseId: currentEditChapter.primaryCourse.id
      };
      chapterService
        .updateChapter(props.course.id, edit_ch.courseId, edit_ch)
        .then(resp => {
          const chptrs = [...chapters];
          chptrs[editChapterIndex] = resp.data;
          setChapters(chptrs);

          setCurrentEditChapter(null);
          setEditChapterIndex(null);
          setEditChapterErrors([]);
        })
        .catch(err => {
          setEditChapterErrors(parseError(err));
        });
    } else {
      alertContext.show(
        "Something went wrong. Try again later",
        AlertVariant.DANGER
      );
    }
  };

  const handleChapterEditClick = (idx: number) => {
    const chptrs = [...chapters];
    const edit_ch = chptrs[idx];
    setEditChapterIndex(idx);
    setCurrentEditChapter(edit_ch);
  };

  const handleChapterEditCancelClick = () => {
    setEditChapterIndex(null);
    setCurrentEditChapter(null);
    setEditChapterErrors([]);
  };

  const handleNewChapterCancelClick = () => {
    setShowNewChapter(false);
    setNewChapterName("");
    setNewChapterErrors([]);
  };
  const handleChapterDeleteClick = (
    courseId: number,
    chapterId: number,
    index: number
  ) => {
    chapterService.deleteChapter(courseId, chapterId).then(resp => {
      if (resp.status === HTTPStatus.OK) {
        const chptrs = [...chapters];
        chptrs.splice(index, 1);
        setChapters(chptrs);
        alertContext.show("Chapter deleted successfully");
      }
    });
  };

  const handleChapterNameChange = (val: string) => {
    if (currentEditChapter) {
      const edit_ch = { ...currentEditChapter };
      edit_ch.name = val;
      setCurrentEditChapter(edit_ch);
    }
  };

  let editChapterErrorFlash = editChapterErrors.length ? (
    <Alert errors={editChapterErrors} variant={AlertVariant.DANGER} />
  ) : null;

  let newChapterErrorFlash = newChapterErrors.length ? (
    <Alert errors={newChapterErrors} variant={AlertVariant.DANGER} />
  ) : null;

  let getEditChapterForm = (chapterId: number) => {
    if (currentEditChapter && currentEditChapter.id === chapterId) {
      return (
        <div className={`chapter-edit`}>
          <form onSubmit={e => submitChapterEdit(e)}>
            {editChapterErrorFlash}
            <div className="form-group">
              <input
                className="form-control"
                type="text"
                value={currentEditChapter.name}
                placeholder="Enter a section name"
                onChange={e => handleChapterNameChange(e.target.value)}
              />
            </div>
            <div className="action-btn-group">
              <button
                className="btn btn-danger action-btn"
                type="button"
                onClick={handleChapterEditCancelClick}
              >
                Cancel
              </button>
              <button className="btn btn-primary action-btn" type="submit">
                Save
              </button>
            </div>
          </form>
        </div>
      );
    }
    return null;
  };
  let displayChapters;
  if (chapters.length) {
    displayChapters = chapters.map((chapter, idx) => {
      const chapterViewClassNames =
        currentEditChapter && currentEditChapter.id === chapter.id
          ? "d-none"
          : "";
      return (
        <div key={chapter.id} className="chapter-item">
          <div className="chapter-content">
            <div className={`chapter-view ${chapterViewClassNames}`}>
              <span className="mr-3">{chapter.name}</span>
              <button
                className="btn mr-2 icon-hoverable"
                onClick={() => handleChapterEditClick(idx)}
              >
                <FontAwesomeIcon icon="edit" color="#686f7a" />
              </button>
              <button
                className="btn icon-hoverable"
                onClick={() =>
                  handleChapterDeleteClick(
                    chapter.primaryCourse.id,
                    chapter.id,
                    idx
                  )
                }
              >
                <FontAwesomeIcon icon="trash" color="#686f7a" />
              </button>
            </div>
            {getEditChapterForm(chapter.id)}
          </div>
        </div>
      );
    });
  }

  const newChapterContainer = showNewChapter ? (
    <div className="new-chapter chapter-item">
      <h5 className="pl-2">New Section</h5>
      <div className="chapter-content">
        <form onSubmit={submitNewChapter}>
          {newChapterErrorFlash}
          <div className="form-group">
            <input
              className="form-control"
              type="text"
              value={newChapterName}
              placeholder="Enter a section name"
              onChange={e => setNewChapterName(e.target.value)}
            />
          </div>
          <div className="action-btn-group">
            <button
              className="btn btn-danger action-btn"
              type="button"
              onClick={handleNewChapterCancelClick}
            >
              Cancel
            </button>
            <button className="btn btn-primary action-btn" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;

  return (
    <div className="chapter-list">
      {displayChapters}
      {newChapterContainer}
      <button
        className="btn btn-outline-dark"
        onClick={() => setShowNewChapter(true)}
      >
        <FontAwesomeIcon icon="plus-circle" className="mr-2" />
        Add Chapter
      </button>
    </div>
  );
};
export default withRouter(ChapterForm);
