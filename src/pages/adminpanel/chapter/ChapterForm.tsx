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
  INewLecture,
  ILecture,
  IEditLecture,
  IChapterPositinUpdateRequest,
  ILecturePositionUpdateRequest
} from "../../../settings/DataTypes";
import { RouteComponentProps, withRouter, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { parseError } from "../../../utils/errorParser";
import Alert from "../../../components/flash/Alert";
import RichTextEditor, { EditorValue } from "react-rte";
import { RTE_TOOLBAR_CONFIG } from "../../../settings/rte_config";
import TagInput from "../../../components/taginput/TagInput";
import TagService from "../../../services/TagService";
import LectureService from "../../../services/LectureService";
import {
  DragDropContext,
  DropResult,
  Droppable,
  Draggable
} from "react-beautiful-dnd";

interface IProp extends RouteComponentProps {
  course: ICourse;
}
const ChapterForm: React.FunctionComponent<IProp> = props => {
  const alertContext = useContext(AlertContext);
  const chapterService = new ChapterService();
  const lectureService = new LectureService();
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
  const [newLectureTags, setNewLectureTags] = useState<string[]>([]);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
  const [newLectureErrors, setNewLectureErrors] = useState<string[]>([]);
  const [
    chapterForNewLecture,
    setChapterForNewLecture
  ] = useState<IChapter | null>(null);

  const [addingContentTo, setAddingContentTo] = useState<ILecture | null>(null);
  const [
    addingContentType,
    setAddingContntType
  ] = useState<LecuteContentType | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [expandedLecture, setExpandedLecture] = useState<ILecture | null>(null);

  // editing lecture state

  const [editingLecture, setEditingLecture] = useState<ILecture | null>(null);
  const [editingLectureDesctiption, setEditingLectureDescription] = useState<
    EditorValue
  >(RichTextEditor.createEmptyValue());
  const [editingLectureErrors, setEditingLectureErrors] = useState<string[]>(
    []
  );
  const [
    editingLectureChapter,
    setEditingLectureChapter
  ] = useState<IChapter | null>(null);

  // constants and enums and type

  enum DROPABLE_TYPE {
    CHAPTER = "chapter",
    LECTURE = "lecture"
  }
  enum LecuteContentType {
    VIDEO = "video",
    PDF = "pdf"
  }

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
      courseId: props.course.id,
      position: chapters.length
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

  const handleAddLectureClick = (chapter: IChapter) => {
    resetNewLecture();
    setChapterForNewLecture(chapter);
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

  const handleLectureEditClick = (chapterId: number, lectureId: number) => {
    resetLectureContent();
    chapters.forEach(ch => {
      if (ch.id === chapterId) {
        const lctrs = [...ch.lectures];
        lctrs.forEach((l, i) => {
          if (l.id === lectureId) {
            setEditingLecture(l);
            setEditingLectureChapter(ch);
            setEditingLectureDescription(
              RichTextEditor.createValueFromString(l.description, "html")
            );
          }
        });
      }
    });
  };

  const handleLectureDeleteClick = (chapterId: number, lectureId: number) => {
    lectureService
      .deleteLecture(props.course.id, chapterId, lectureId)
      .then(resp => {
        const chptrs = [...chapters];
        chptrs.forEach((ch, chIdx) => {
          if (ch.id === chapterId) {
            ch.lectures.forEach((l, lIndx) => {
              if (l.id === lectureId) {
                ch.lectures.splice(lIndx, 1);
              }
            });
          }
        });
        setChapters(chptrs);
        alertContext.show("Lecture succesfully deleted");
      })
      .catch(err => {
        alertContext.show(parseError(err).join(", "), AlertVariant.DANGER);
      });
  };

  const addTag = (text: string, isNewLecture: boolean = true) => {
    const trim_t = text.trim();
    if (isNewLecture) {
      const tags = [...newLectureTags];
      const found = tags.some(x => x === trim_t);
      if (!found && trim_t.length > 0) {
        tags.push(trim_t);
        setNewLectureTags(tags);
      }
    } else if (editingLecture) {
      const tags = [...editingLecture.tags];
      const found = tags.some(x => x === trim_t);
      if (!found && trim_t.length > 0) {
        tags.push(trim_t);
        editingLecture.tags = tags;
        setEditingLecture(editingLecture);
      }
    } else {
      alertContext.show("Invalid lecture", AlertVariant.WARNING);
    }
    setTagSuggestions([]);
  };

  const removeTag = (idx: number, isNewLecture: boolean = true) => {
    if (isNewLecture) {
      const tags = [...newLectureTags];
      tags.splice(idx, 1);
      setNewLectureTags(tags);
    } else if (editingLecture) {
      const el = { ...editingLecture };
      const tags = [...el.tags];
      tags.splice(idx, 1);
      el.tags = tags;
      setEditingLecture(el);
    } else {
      alertContext.show("Invalid lecture", AlertVariant.WARNING);
    }
  };

  const handleTagChange = (val: string) => {
    if (val.trim().length > 1) {
      tagService
        .search(val)
        .then(resp => {
          setTagSuggestions(resp.data.map(t => t.name));
        })
        .catch(err => {
          setTagSuggestions([]);
        });
    } else {
      setTagSuggestions([]);
    }
  };

  const handleNewLectureFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (chapterForNewLecture) {
      const lecutreData: INewLecture = {
        name: newLectureName,
        description: newLectureDescription.toString("html"),
        tags: newLectureTags,
        chapterId: chapterForNewLecture.id,
        position: chapterForNewLecture.lectures.length
      };
      lectureService
        .createLecture(props.course.id, chapterForNewLecture.id, lecutreData)
        .then(resp => {
          const chptrs = [...chapters];
          for (let ch of chptrs) {
            if (ch.id === chapterForNewLecture.id) {
              ch.lectures.push(resp.data);
              break;
            }
          }
          setChapters(chptrs);
          resetNewLecture();
          alertContext.show("Lecture added successfully");
        })
        .catch(err => {
          setNewLectureErrors(parseError(err));
        });
    }
  };

  const handleEditLectureFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (editingLecture && editingLectureChapter) {
      const formData: IEditLecture = {
        id: editingLecture.id,
        name: editingLecture.name,
        description: editingLectureDesctiption.toString("html"),
        tags: editingLecture.tags,
        chapterId: editingLectureChapter.id
      };
      lectureService
        .updateLecture(
          props.course.id,
          editingLectureChapter.id,
          editingLecture.id,
          formData
        )
        .then(resp => {
          const chptrs = [...chapters];
          let updated = false;
          for (let i = 0; i < chptrs.length; i++) {
            if (chptrs[i].id === editingLectureChapter.id) {
              const lectures = chptrs[i].lectures;
              for (let j = 0; j < lectures.length; j++) {
                if (lectures[j].id === editingLecture.id) {
                  lectures[j] = resp.data;
                  chptrs[i].lectures = lectures;
                  setChapters(chptrs);
                  resetEditLecture();
                  updated = true;
                  break;
                }
              }
            }
            if (updated) {
              break;
            }
          }
        })
        .catch(err => {
          setEditingLectureErrors(parseError(err));
        });
    }
  };
  const handleEditLectureCancelClick = () => {
    resetEditLecture();
  };
  const resetEditLecture = () => {
    setEditingLecture(null);
    setEditingLectureChapter(null);
    setEditingLectureErrors([]);
  };

  const reorder = (
    list: IChapter[] | ILecture[],
    startIndex: number,
    endIndex: number
  ) => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    if (result.type === DROPABLE_TYPE.CHAPTER) {
      const chptrs = reorder(chapters, sourceIndex, destIndex);

      const positionsToUpdate: IChapterPositinUpdateRequest[] = [];
      chptrs.forEach((ch, idx) => {
        const p: IChapterPositinUpdateRequest = {
          chapterId: ch.id,
          position: idx
        };
        positionsToUpdate.push(p);
      });
      chapterService
        .updatePositions(props.course.id, positionsToUpdate)
        .then(resp => {
          if (resp.status === HTTPStatus.OK) {
            setChapters(chptrs as IChapter[]);
          }
        });
    } else if (result.type === DROPABLE_TYPE.LECTURE) {
      let initVal: any = {};
      const chLecMap = chapters.reduce((acc, ch) => {
        acc[ch.id] = ch.lectures;
        return acc;
      }, initVal);

      const sourceParentId = parseInt(result.source.droppableId.split("_")[0]);
      const destParentId = parseInt(
        result.destination.droppableId.split("_")[0]
      );

      const sourceLectures = chLecMap[sourceParentId];
      const destLectures = chLecMap[destParentId];

      let newChapters = [...chapters];

      if (sourceParentId === destParentId) {
        const reorderedLectures = reorder(
          sourceLectures,
          sourceIndex,
          destIndex
        );
        let lecturePositions: ILecturePositionUpdateRequest[] = [];
        newChapters = newChapters.map(ch => {
          if (ch.id === sourceParentId) {
            const lectures: ILecture[] = reorderedLectures as ILecture[];
            ch.lectures = lectures;
            lectures.forEach((l: ILecture, i: number) => {
              lecturePositions.push({
                chapterId: ch.id,
                lectureId: l.id,
                position: i
              });
            });
          }
          return ch;
        });
        lectureService
          .updateLecturePositions(lecturePositions)
          .then(resp => {
            if (resp.status === HTTPStatus.OK) {
              setChapters(newChapters);
            }
          })
          .catch(err => {
            alertContext.show("Something went wrong.", AlertVariant.DANGER);
          });
      } else {
        let newSourceLectures = [...sourceLectures];
        const [draggedLecture] = newSourceLectures.splice(sourceIndex, 1);
        let newDestLectures = [...destLectures];
        newDestLectures.splice(destIndex, 0, draggedLecture);

        let lecturePositions: ILecturePositionUpdateRequest[] = [];

        newChapters = newChapters.map(ch => {
          if (ch.id === sourceParentId) {
            ch.lectures = newSourceLectures;
            newSourceLectures.forEach((l: ILecture, i: number) => {
              lecturePositions.push({
                chapterId: ch.id,
                lectureId: l.id,
                position: i
              });
            });
          } else if (ch.id === destParentId) {
            ch.lectures = newDestLectures;
            newDestLectures.forEach((l: ILecture, i: number) => {
              lecturePositions.push({
                chapterId: ch.id,
                lectureId: l.id,
                position: i
              });
            });
          }
          return ch;
        });

        lectureService
          .updateLecturePositions(lecturePositions)
          .then(resp => {
            if (resp.status === HTTPStatus.OK) {
              setChapters(newChapters);
            }
          })
          .catch(err => {
            alertContext.show("Something went wrong.", AlertVariant.DANGER);
          });
      }
    }
  };

  const handleLectureFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const resetLectureContent = () => {
    setAddingContntType(null);
    setSelectedFile(null);
    setAddingContentTo(null);
    setExpandedLecture(null);
  };

  const handleAddContentClick = (lecture: ILecture) => {
    if (addingContentTo && addingContentTo.id === lecture.id) {
      resetLectureContent();
    } else {
      resetLectureContent();
      setAddingContentTo(lecture);
    }
  };

  const handleLectureContentFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (selectedFile && addingContentTo) {
      const formData = new FormData();
      formData.append("file", selectedFile, selectedFile.name);
      lectureService
        .uploadLectureContent(addingContentTo.id, formData)
        .then(resp => {
          const chptrs = [...chapters];
          let found = false;
          for (let ch of chptrs) {
            const lctrs = [...ch.lectures];
            for (let l of lctrs) {
              if (l.id === addingContentTo.id) {
                l.lectureResource = resp.data;
                found = true;
                break;
              }
            }
            if (found) {
              ch.lectures = lctrs;
              break;
            }
          }
          setChapters(chptrs);
          resetLectureContent();
        })
        .catch(err => {
          alertContext.show(parseError(err).join(", "), AlertVariant.DANGER);
        });
    }
  };

  const handleLectureExpandClick = (lecture: ILecture) => {
    resetLectureContent();

    expandedLecture && expandedLecture.id === lecture.id
      ? setExpandedLecture(null)
      : setExpandedLecture(lecture);
  };

  const editChapterErrorFlash = editChapterErrors.length ? (
    <Alert errors={editChapterErrors} variant={AlertVariant.DANGER} />
  ) : null;

  const newChapterErrorFlash = newChapterErrors.length ? (
    <Alert errors={newChapterErrors} variant={AlertVariant.DANGER} />
  ) : null;

  const newLectureErrorFlash = newLectureErrors.length ? (
    <Alert errors={newLectureErrors} variant={AlertVariant.DANGER} />
  ) : null;

  const editLectureErrorFlash = editingLectureErrors.length ? (
    <Alert errors={editingLectureErrors} variant={AlertVariant.DANGER} />
  ) : null;

  const getLectureDetailView = (lecture: ILecture) => {
    if (
      expandedLecture &&
      expandedLecture.id === lecture.id &&
      lecture.lectureResource
    ) {
      return (
        <div className="expanded-lecture">
          <FontAwesomeIcon icon="file-pdf" size="2x" className="mr-3" />
          <Link to="/" className="mr-3">
            {lecture.lectureResource.fileName}
          </Link>
          <button
            className="btn icon-hoverable"
            onClick={() => handleAddContentClick(lecture)}
          >
            <FontAwesomeIcon icon="edit" className="mr-2" />
            <span>Edit Content</span>
          </button>
        </div>
      );
    }

    return null;
  };
  const getNewLectureForm = (chapterId: number) => {
    if (chapterForNewLecture && chapterForNewLecture.id === chapterId) {
      return (
        <div className="new-lecture">
          <form onSubmit={e => handleNewLectureFormSubmit(e)}>
            {newLectureErrorFlash}
            <div className="form-group">
              <label>Lecture name</label>
              <input
                className="form-control"
                type="text"
                value={newLectureName}
                placeholder="Lecture name"
                onChange={e => setNewLectureName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Lecture description</label>
              <RichTextEditor
                className="rich-text-editor"
                toolbarConfig={RTE_TOOLBAR_CONFIG}
                value={newLectureDescription}
                onChange={val => setNewLectureDescription(val)}
                placeholder="Enter a lecture description"
              />
            </div>
            <div className="form-group">
              <label>Lecture tags [comma separated value]</label>
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

  const getEditingLectureForm = (chapterId: number, lectureId: number) => {
    if (
      editingLectureChapter &&
      editingLectureChapter.id === chapterId &&
      editingLecture &&
      editingLecture.id === lectureId
    ) {
      return (
        <div className="edit-lecture">
          <form onSubmit={e => handleEditLectureFormSubmit(e)}>
            {editLectureErrorFlash}
            <div className="form-group">
              <label>Lecture name</label>
              <input
                className="form-control"
                type="text"
                value={editingLecture.name}
                onChange={e =>
                  setEditingLecture({ ...editingLecture, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Lecture description</label>
              <RichTextEditor
                className="rich-text-editor"
                toolbarConfig={RTE_TOOLBAR_CONFIG}
                value={editingLectureDesctiption}
                onChange={val => setEditingLectureDescription(val)}
                placeholder="Enter a lecture description"
              />
            </div>
            <div className="form-group">
              <label>Lecture tags [comma separated value]</label>
              <TagInput
                tags={editingLecture.tags}
                suggestions={tagSuggestions}
                delimeters={[13, 188]}
                onAddHandler={val => addTag(val, false)}
                onDeleteHandler={idx => removeTag(idx, false)}
                onChangeHandler={val => handleTagChange(val)}
              />
            </div>
            <div className="form-group action-btn-group">
              <div className="action-btn">
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={handleEditLectureCancelClick}
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

  const getContentForm = (lecture: ILecture) => {
    if(addingContentType == null) {
      return null;
    }

    let acceptType = ".mov,.mpeg4,.mp4, .avi, .wmv, .mpegps, .flv, 3gpp, .webm";
    let choose = "Choose a video";
    if (addingContentType === LecuteContentType.PDF) {
      acceptType = ".pdf";
      choose = "Choose a PDF file";
    }

    const fileName = selectedFile ? selectedFile.name : choose;
    return (
      <div className="lecture-file">
        <form onSubmit={e => handleLectureContentFormSubmit(e)}>
          <div className="input-group mb-2">
            <div className="custom-file">
              <input
                type="file"
                title={fileName}
                className="custom-file-input"
                accept={acceptType}
                multiple={false}
                onChange={e => handleLectureFileSelect(e)}
              />
              <label className="custom-file-label">{fileName}</label>
            </div>
          </div>
          <div className="action-btn-group">
            <button
              type="button"
              className="btn btn-danger action-btn"
              onClick={resetLectureContent}
            >
              <FontAwesomeIcon icon="times" className="mr-2" />
              Cancel
            </button>
            <button type="submit" className="btn btn-primary action-btn">
              <FontAwesomeIcon icon="save" className="mr-2" />
              Save
            </button>
          </div>
        </form>
      </div>
    );
  };

  const getContentTypeSelector = (lecture: ILecture) => {
    return addingContentTo && addingContentTo.id === lecture.id ? (
      <div className="lecture-content-container">
        <p>Select file type for the content</p>
        <div className="lecture-content-selector">
          <div
            className={`lecture-type ${
              addingContentType === LecuteContentType.VIDEO ? "active" : ""
            }`}
            onClick={() => setAddingContntType(LecuteContentType.VIDEO)}
          >
            <FontAwesomeIcon icon="file-video" size="2x" className="mb-2" />
            <span>Video</span>
          </div>
          <div
            className={`lecture-type ${
              addingContentType === LecuteContentType.PDF ? "active" : ""
            }`}
            onClick={() => setAddingContntType(LecuteContentType.PDF)}
          >
            <FontAwesomeIcon icon="file-pdf" size="2x" className="mb-2" />
            <span>PDF</span>
          </div>
        </div>
        {getContentForm(lecture)}
      </div>
    ) : null;
  };

  const getLectureActionButtons = (chapter: IChapter, lecture: ILecture) => {
    return (
      <div>
        <button
          className="btn mr-2 icon-hoverable"
          onClick={() => handleLectureEditClick(chapter.id, lecture.id)}
        >
          <FontAwesomeIcon icon="edit" color="#686f7a" />
        </button>
        <button
          className="btn icon-hoverable"
          onClick={() => handleLectureDeleteClick(chapter.id, lecture.id)}
        >
          <FontAwesomeIcon icon="trash" color="#686f7a" />
        </button>
      </div>
    );
  };

  const getAddContentButton = (lecture: ILecture) => {
    if (!lecture.lectureResource) {
      return (
        <button
          type="button"
          className="btn btn-outline-info"
          onClick={() => handleAddContentClick(lecture)}
        >
          <FontAwesomeIcon
            icon={
              addingContentTo && addingContentTo.id === lecture.id
                ? "minus"
                : "plus"
            }
            className="mr-2"
          />
          <span>Content</span>
        </button>
      );
    }
    return null;
  };

  const getExpandButton = (lecture: ILecture) => {
    return (
      <button
        className="btn lecture-expand-btn ml-3"
        onClick={() => handleLectureExpandClick(lecture)}
      >
        <FontAwesomeIcon
          icon={
            expandedLecture && expandedLecture.id === lecture.id
              ? "angle-up"
              : "angle-down"
          }
        />
      </button>
    );
  };
  const displayLectures = (chapter: IChapter) => {
    if (chapter.lectures) {
      return chapter.lectures.map((lecture, idx) => {
        const klass =
          editingLecture && editingLecture.id === lecture.id ? "d-none" : "";
        return (
          <div key={lecture.name}>
            <Draggable
              key={`${lecture.id}_${lecture.name}`}
              draggableId={`${lecture.id}_${lecture.name}`}
              index={idx}
            >
              {(provided3, snapshot) => (
                <div
                  ref={provided3.innerRef}
                  {...provided3.dragHandleProps}
                  {...provided3.draggableProps}
                >
                  <div className={`lecture-item ${klass}`}>
                    <span className="mr-3">{lecture.name}</span>
                    {getLectureActionButtons(chapter, lecture)}
                    <div className="flex-fill"></div>

                    {getAddContentButton(lecture)}
                    {getExpandButton(lecture)}
                  </div>
                  {provided3.placeholder}
                </div>
              )}
            </Draggable>
            {getLectureDetailView(lecture)}
            {getContentTypeSelector(lecture)}
            {getEditingLectureForm(chapter.id, lecture.id)}
          </div>
        );
      });
    }
    return null;
  };

  let getEditChapterForm = (chapterId: number) => {
    if (currentEditChapter && currentEditChapter.id === chapterId) {
      return (
        <div className="edit-chapter">
          <form onSubmit={e => submitChapterEdit(e)}>
            {editChapterErrorFlash}
            <div className="form-group">
              <label>Chapter name</label>
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

  const newChapterForm = showNewChapter ? (
    <div className="new-chapter">
      <div className="chapter-content">
        <form onSubmit={submitNewChapter}>
          {newChapterErrorFlash}
          <div className="form-group">
            <label>Chapter name</label>
            <input
              className="form-control"
              type="text"
              value={newChapterName}
              placeholder="Enter a chapter name"
              onChange={e => setNewChapterName(e.target.value)}
            />
          </div>
          <div className="action-btn-group form-group">
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

  const displayChapters = chapters.map((chapter, idx) => {
    const chapterViewClassNames =
      currentEditChapter && currentEditChapter.id === chapter.id
        ? "d-none"
        : "";
    return (
      <Draggable
        key={`${chapter.id}_${chapter.name}`}
        draggableId={`${chapter.id}_${chapter.name}`}
        index={idx}
      >
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.draggableProps}>
            <div className="chapter-item">
              <div className="chapter-content">
                <div
                  className={`chapter-view ${chapterViewClassNames}`}
                  {...provided.dragHandleProps}
                >
                  <span className="mr-3">{chapter.name}</span>
                  <div>
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
                </div>
                {getEditChapterForm(chapter.id)}
                <Droppable
                  droppableId={`${chapter.id}_${chapter.name}`}
                  type={DROPABLE_TYPE.LECTURE}
                >
                  {(provided2, snapshot2) => (
                    <div
                      ref={provided2.innerRef}
                      {...provided2.droppableProps}
                      className={
                        snapshot2.isDraggingOver ? "is-dragging-over" : ""
                      }
                    >
                      <div className="lecture-list">
                        {displayLectures(chapter)}
                      </div>
                      {provided2.placeholder}
                    </div>
                  )}
                </Droppable>

                {getNewLectureForm(chapter.id)}
                <button
                  className="btn btn-outline-dark"
                  onClick={() => handleAddLectureClick(chapter)}
                >
                  <FontAwesomeIcon icon="plus-circle" className="mr-2" />
                  Add Lecture
                </button>
              </div>
            </div>
            {provided.placeholder}
          </div>
        )}
      </Draggable>
    );
  });

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="dropable" type={DROPABLE_TYPE.CHAPTER}>
        {(provided, snapshop) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={snapshop.isDraggingOver ? "is-dragging-over" : ""}
          >
            <div className="chapter-list">{displayChapters}</div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      {newChapterForm}
      <button
        className="btn btn-outline-dark"
        onClick={() => setShowNewChapter(true)}
      >
        <FontAwesomeIcon icon="plus-circle" className="mr-2" />
        Add Chapter
      </button>
    </DragDropContext>
  );
};
export default withRouter(ChapterForm);
