import React, { useState, ChangeEvent } from "react";

import "./TagInput.css";
import { ITag } from "../../settings/DataTypes";

interface IProp {
  tags: ITag[];
  suggestions: ITag[];
  placeholder?: string;
  onAddHandler: (tag: ITag) => void;
  onDeleteHandler: (idx: number) => void;
  onChangeHandler?: (text: string) => void;
  delimeters?: number[];
}
const TagInput: React.FunctionComponent<IProp> = props => {
  const [newTag, setNewTag] = useState<ITag | null>(null);
  const [selectedAutoSuggest, setSelectedAutoSuggest] = useState<number>(-1);
  const [typedTag, setTypedTag] = useState<ITag | null>(null);

  const addTag = (idx: number) => {
    const t = props.suggestions[idx];
    props.onAddHandler(t);
    setNewTag(null);
  };

  const TagAutoSuggestions = props.suggestions.map((sug, idx) => {
    const klass =
      selectedAutoSuggest === idx
        ? "drop-down-list-item drop-down-list-item-hover"
        : "drop-down-list-item";
    return (
      <li
        key={idx}
        className={klass}
        onMouseEnter={() => setSelectedAutoSuggest(idx)}
      >
        <div onClick={() => addTag(idx)}>{sug.name}</div>
      </li>
    );
  });

  const SelectedTags = props.tags.map((tag, idx) => {
    return (
      <li key={tag.name} className="tag-item">
        <span className="tag-text">{tag.name}</span>
        <span
          className="tag-close close"
          onClick={() => props.onDeleteHandler(idx)}
        >
          &times;
        </span>
      </li>
    );
  });

  const handleValueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const t: ITag = { id: null, name: e.target.value };
    setNewTag(t);
    setTypedTag(t);
    props.onChangeHandler && props.onChangeHandler(e.target.value);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let delimiters: number[] = props.delimeters ? props.delimeters : [13];
    if (delimiters.includes(e.keyCode) && newTag) {
      e.preventDefault();
      props.onAddHandler(newTag);
      setNewTag(null);
    } else {
      const s = selectedAutoSuggest;

      if (e.keyCode === 38) {
        if (s === -1) {
          setSelectedAutoSuggest(props.suggestions.length - 1);
          setNewTag(props.suggestions[props.suggestions.length - 1]);
        } else if (s === 0) {
          setSelectedAutoSuggest(-1);
          setNewTag(typedTag);
        } else {
          setSelectedAutoSuggest(s - 1);
          setNewTag(props.suggestions[s - 1]);
        }
      } else if (e.keyCode === 40) {
        if (s === props.suggestions.length - 1) {
          setSelectedAutoSuggest(-1);
          setNewTag(typedTag);
        } else {
          setSelectedAutoSuggest(s + 1);
          setNewTag(props.suggestions[s + 1]);
        }
      }
    }
  };

  const autoSuggestionContainer = props.suggestions.length ? (
    <div className="tag-autosuggestions">
      <ul>{TagAutoSuggestions}</ul>
    </div>
  ) : null;

  const selectedTagContainer = props.tags.length ? (
    <div className="selected-tags">
      <ul className="selected-tag-list">{SelectedTags}</ul>
    </div>
  ) : null;

  const tagInput = (
    <input
      type="text"
      className="tag-input"
      placeholder={props.placeholder ? props.placeholder : "Enter tag"}
      value={newTag ? newTag.name : ""}
      onChange={e => handleValueChange(e)}
      onKeyDown={e => handleKeyDown(e)}
    />
  );
  return (
    <div className="autocomplete-tag">
      <div className="tag-container">
        {selectedTagContainer}
        {tagInput}
      </div>
      {autoSuggestionContainer}
    </div>
  );
};
export default TagInput;
