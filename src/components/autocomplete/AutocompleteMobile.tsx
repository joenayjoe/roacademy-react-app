import React, { Component, FormEvent, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Autocomplete.css";
import { ILinkItem } from "../../settings/DataTypes";
import Backdrop from "../backdrop/Backdrop";

interface IProps {
  suggestions: ILinkItem[];
  placeholder: string;
  onChangeHandler(query: string): void;
  onSubmitHandler(query: string): void;
  onFocusHandler?(): void;
  onCloseHandler?(): void;
}

interface IStates {
  isFocus: boolean;
  query: string;
}

class AutocompleteMobile extends Component<IProps, IStates> {
  state: IStates = {
    isFocus: false,
    query: ""
  };

  handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: e.currentTarget.value });
    this.props.onChangeHandler(e.currentTarget.value);
  };

  handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (this.props.onCloseHandler) {
      this.props.onCloseHandler();
    }
    this.props.onSubmitHandler(this.state.query);
  };

  handleOnSelect = (suggestion: ILinkItem) => {
    this.setState({ query: suggestion.name });
    this.props.onSubmitHandler(suggestion.name);
  };

  toogleOnFocus = () => {
    this.setState(prevState => {
      return { isFocus: !prevState.isFocus };
    });
    if (typeof this.props.onFocusHandler === "function") {
      this.props.onFocusHandler();
    }
  };

  handleOnClose = () => {
    if (this.props.onCloseHandler) {
      this.props.onCloseHandler();
    }
  };
  render() {
    let focusKlass = "blur";

    if (this.state.isFocus) {
      focusKlass = "focus";
    }

    let searchInput = (
      <input
        type="search"
        name="q"
        value={this.state.query}
        placeholder={this.props.placeholder}
        aria-describedby="button-addon"
        className={`form-control bg-none border-0 ${focusKlass}`}
        autoComplete="off"
        onChange={e => this.handleOnChange(e)}
        onFocus={this.toogleOnFocus}
        onBlur={this.toogleOnFocus}
        autoFocus={true}
      />
    );

    let searchIcon = (
      <div className={`input-group-append border-0 ${focusKlass}`}>
        <button id="button-addon" type="submit" className="btn btn-link">
          <FontAwesomeIcon icon="search" />
        </button>
      </div>
    );

    let closeIcon = (
      <div
        className={`input-group-append border-0 ${focusKlass}`}
        onClick={this.props.onCloseHandler}
      >
        <button id="button-addon2" type="reset" className="btn btn-link">
          <FontAwesomeIcon icon="times" />
        </button>
      </div>
    );

    let autoCompleteSuggestionList = this.props.suggestions.map(suggestion => {
      return (
        <li key={suggestion.id} className="drop-down-list-item">
          <div
            className="menu-link"
            onMouseDown={() => this.handleOnSelect(suggestion)}
          >
            {suggestion.name}
          </div>
        </li>
      );
    });

    let openKlass =
      this.props.suggestions.length > 0 && this.state.isFocus ? "open" : "";

    let autoCompleteInput = (
      <div className="input-group">
        {searchIcon} {searchInput} {closeIcon}
      </div>
    );
    return (
      <Backdrop closeHandler={this.handleOnClose}>
        <div className={`autocomplete border drop-down ${openKlass}`}>
          <form
            action="/courses/search"
            className="form-inline"
            onSubmit={e => this.handleOnSubmit(e)}
          >
            {autoCompleteInput}
          </form>
          <ul className="autocomplete-suggestions drop-down-list">
            {autoCompleteSuggestionList}
          </ul>
        </div>
      </Backdrop>
    );
  }
}

export default AutocompleteMobile;
