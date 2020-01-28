import React, { useState, useContext, FormEvent, useEffect } from "react";
import ChapterService from "../../../services/ChapterService";
import { AlertContext } from "../../../contexts/AlertContext";
import {
  IChapter,
  ICourse,
  INewChapter,
  IEditChapter,
  HTTPStatus,
  AlertVariant,
  ITag
} from "../../../settings/DataTypes";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { parseError } from "../../../utils/errorParser";
import Alert from "../../../components/flash/Alert";
import RichTextEditor, { EditorValue } from "react-rte";
import { RTE_TOOLBAR_CONFIG } from "../../../settings/rte_config";
import TagInput from "../../../components/taginput/TagInput";
import TagService from "../../../services/TagService";

interface IProp extends RouteComponentProps {
  course: ICourse;
}
const ChapterForm: React.FunctionComponent<IProp> = props => {
  const alertContext = useContext(AlertContext);
  const chapterService = new ChapterService();
  const tagService = new TagService();

  const [chapters, setChapters] = useState<IChapter[]>([]);

  // editing chapter state
  const [currentEditChapter, setCurrentEditChapter] = useState<IChapter | null>(
    null
  );
  const [editChapterIndex, setEditChapterIndex] = useState<number | null>(null);
  const [editChapterErrors, setEditChapterErrors] = useState<string[]>([]);

  // new chapter state
  const [newChapterName, setNewChapterName] = useState<string>("");
  const [showNewChapter, setShowNewChapter] = useState<boolean>(false);
  const [newChapterErrors, setNewChapterErrors] = useState<string[]>([]);

  // new lecture state
  const [newLectureName, setNewLectureName] = useState<string>("");
  const [newLectureDescription, setNewLectureDescription] = useState<
    EditorValue
  >(RichTextEditor.createEmptyValue());
  const [newLectureTags, setNewLectureTags] = useState<ITag[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<ITag[]>([]);
  const [newLectureErrors, setNewLectureErrors] = useState<string[]>([]);
  const [chapterForNewLecture, setChapterForNewLecture] = useState<
    number | null
  >(null);

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
        resetNewChapter();
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
          resetEditChapter();
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
    resetEditChapter();
  };

  const resetNewChapter = () => {
    setShowNewChapter(false);
    setNewChapterName("");
    setNewChapterErrors([]);
  };

  const resetEditChapter = () => {
    setEditChapterIndex(null);
    setCurrentEditChapter(null);
    setEditChapterErrors([]);
  };

  const handleNewChapterCancelClick = () => {
    resetNewChapter();
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

  const handleAddLectureClick = (chapterId: number) => {
    setChapterForNewLecture(chapterId);
    setNewChapterErrors([]);
  };

  const handleNewLectureCancelClick = () => {
    resetNewLecture();
  };

  const resetNewLecture = () => {
    setChapterForNewLecture(null);
    setNewLectureName("");
    setNewLectureDescription(RichTextEditor.createEmptyValue());
    setNewLectureTags([]);
    setNewLectureErrors([]);
  };

  const handleLectureEditClick = (idx: number) => {};

  const handleLectureDeleteClick = (
    chapterId: number,
    lectureId: number,
    idx: number
  ) => {};

  const addTag = (nt: ITag) => {
    const trim_t = { ...nt, name: nt.name.trim() };
    const tags = [...newLectureTags];
    const found = tags.some(x => x.name === trim_t.name);
    if (!found && trim_t.name.length > 0) {
      tags.push(trim_t);
      setNewLectureTags(tags);
    }
    setTagSuggestions([]);
  };

  const removeTag = (idx: number) => {
    const t = [...newLectureTags];
    t.splice(idx, 1);
    setNewLectureTags(t);
  };

  const handleTagChange = (val: string) => {
    if (val.trim().length > 1) {
      tagService
        .search(val)
        .then(resp => {
          setTagSuggestions(resp.data);
        })
        .catch(err => {
          setTagSuggestions([]);
        });
    } else {
      setTagSuggestions([]);
    }
  };

  const handleNewLectureFormSubmit = () => {};

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

  const displayLectures = (chapter: IChapter) => {
    if (chapter.lectures) {
      return chapter.lectures.map((lecture, idx) => {
        return (
          <div className="lecture-item" key={idx}>
            <div className={`lecture-view`}>
              <span className="mr-3">{lecture.name}</span>
              <button
                className="btn mr-2 icon-hoverable"
                onClick={() => handleLectureEditClick(idx)}
              >
                <FontAwesomeIcon icon="edit" color="#686f7a" />
              </button>
              <button
                className="btn icon-hoverable"
                onClick={() =>
                  handleLectureDeleteClick(
                    lecture.primaryChapter.id,
                    lecture.id,
                    idx
                  )
                }
              >
                <FontAwesomeIcon icon="trash" color="#686f7a" />
              </button>
            </div>
          </div>
        );
      });
    }
    return null;
  };

  const getNewLectureForm = (chapterId: number) => {
    if (chapterForNewLecture && chapterForNewLecture === chapterId) {
      return (
        <div className="new-lecture lecture-item">
          <form onSubmit={handleNewLectureFormSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                className="form-control"
                type="text"
                value={newLectureName}
                placeholder="Lecture name"
                onChange={e => setNewLectureName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <RichTextEditor
                className="rich-text-editor"
                toolbarConfig={RTE_TOOLBAR_CONFIG}
                value={newLectureDescription}
                onChange={val => setNewLectureDescription(val)}
                placeholder="Enter a lecture description"
              />
            </div>
            <div className="form-group">
              <label>Write comma separated tags for the lecture</label>
              <TagInput
                tags={newLectureTags}
                suggestions={tagSuggestions}
                delimeters={[13, 188]}
                onAddHandler={val => addTag(val)}
                onDeleteHandler={idx => removeTag(idx)}
                onChangeHandler={val => handleTagChange(val)}
              />
            </div>
            <div className="form-group action-btn-group">
              <div className="action-btn">
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={handleNewLectureCancelClick}
                >
                  <FontAwesomeIcon icon="times" className="mr-2" />
                  Cancel
                </button>
              </div>
              <div className="action-btn">
                <button className="btn btn-primary" type="submit">
                  <FontAwesomeIcon icon="save" className="mr-2" />
                  Save
                </button>
              </div>
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
            <div className="lecture-list">
              {displayLectures(chapter)}
              {getNewLectureForm(chapter.id)}
              <button
                className="btn btn-outline-dark"
                onClick={() => handleAddLectureClick(chapter.id)}
              >
                <FontAwesomeIcon icon="plus-circle" className="mr-2" />
                Add Lecture
              </button>
            </div>
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
