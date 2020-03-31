import React, { Component, FormEvent, ChangeEvent, createRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Autocomplete.css";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ISearchResponse } from "../../settings/DataTypes";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { BUILD_COURSE_URL } from "../../settings/Constants";

interface AutocompleteProps extends RouteComponentProps {
  query: string;
  suggestions: ISearchResponse[];
  placeholder: string;
  icon?: IconProp;
  autoFoucs?: boolean;
  backdrop?: boolean;
  onChangeHandler(query: string): void;
  onSubmitHandler(query: string): void;
  onFocusHandler?(): void;
  onCloseHandler?(): void;
}

interface AutocompleteState {
  isFocus: boolean;
  query: string;
  typedQuery: string;
  selectedQueryIndex: number;
  selectedSuggestion: ISearchResponse | null;
}

class Autocomplete extends Component<AutocompleteProps, AutocompleteState> {
  state: AutocompleteState = {
    isFocus: false,
    query: this.props.query,
    typedQuery: this.props.query,
    selectedQueryIndex: -1,
    selectedSuggestion: null
  };

  autocompleInputRef: any = createRef();

  handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      query: e.currentTarget.value,
      typedQuery: e.currentTarget.value
    });
    this.props.onChangeHandler(e.currentTarget.value);
  };

  handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let { selectedQueryIndex, typedQuery } = this.state;
    if (e.keyCode === 38) {
      if (selectedQueryIndex === -1) {
        this.setState({
          query: this.props.suggestions[this.props.suggestions.length - 1].name,
          selectedQueryIndex: this.props.suggestions.length - 1,
          selectedSuggestion: this.props.suggestions[
            this.props.suggestions.length - 1
          ]
        });
      } else if (selectedQueryIndex === 0) {
        this.setState({
          query: typedQuery,
          selectedQueryIndex: -1,
          selectedSuggestion: null
        });
      } else {
        this.setState({
          query: this.props.suggestions[selectedQueryIndex - 1].name,
          selectedQueryIndex: selectedQueryIndex - 1,
          selectedSuggestion: this.props.suggestions[selectedQueryIndex - 1]
        });
      }
    } else if (e.keyCode === 40) {
      if (selectedQueryIndex === this.props.suggestions.length - 1) {
        this.setState({
          query: typedQuery,
          selectedQueryIndex: -1,
          selectedSuggestion: null
        });
      } else {
        this.setState({
          query: this.props.suggestions[selectedQueryIndex + 1].name,
          selectedQueryIndex: selectedQueryIndex + 1,
          selectedSuggestion: this.props.suggestions[selectedQueryIndex + 1]
        });
      }
    }
  };

  handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();
    this.autocompleInputRef.blur();
    if (this.props.onCloseHandler) {
      this.props.onCloseHandler();
    }
    if (this.state.selectedSuggestion) {
      this.props.history.push(
        BUILD_COURSE_URL(this.state.selectedSuggestion.id)
      );
      this.setState({ selectedSuggestion: null });
    } else {
      this.props.onSubmitHandler(this.state.query);
    }
  };

  handleOnSelect = (suggestion: ISearchResponse) => {
    this.setState({ query: suggestion.name });

    if (suggestion.type === "Course") {
      this.props.history.push(BUILD_COURSE_URL(suggestion.id));
    } else {
      this.props.onSubmitHandler(suggestion.name);
    }
  };

  toogleOnFocus = () => {
    this.setState(prevState => {
      return { isFocus: !prevState.isFocus };
    });
    if (typeof this.props.onFocusHandler === "function") {
      this.props.onFocusHandler();
    }
  };

  handleOnClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && this.props.onCloseHandler) {
      this.setState({ query: "" });
      this.props.onCloseHandler();
    }
  };

  render() {
    let focusKlass = "blur";
    if (this.state.isFocus) {
      focusKlass = "focus";
    }

    let searchIcon: JSX.Element | null = null;
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
        onKeyDown={e => this.handleKeyDown(e)}
        onFocus={this.toogleOnFocus}
        onBlur={this.toogleOnFocus}
        autoFocus={this.props.autoFoucs && this.props.query.length === 0}
        ref={node => (this.autocompleInputRef = node)}
      />
    );
    if (this.props.icon != null) {
      searchIcon = (
        <div className={`input-group-append border-0 ${focusKlass}`}>
          <button id="button-addon" type="submit" className="btn btn-link">
            <FontAwesomeIcon icon={this.props.icon} />
          </button>
        </div>
      );
    }

    let closeIcon;
    if (this.props.onCloseHandler) {
      closeIcon = (
        <div
          className={`input-group-append border-0 ${focusKlass}`}
          onClick={this.props.onCloseHandler}
        >
          <button id="button-addon2" type="reset" className="btn btn-link">
            <FontAwesomeIcon icon="times" />
          </button>
        </div>
      );
    }

    let autoCompleteSuggestionList = this.props.suggestions.map(
      (suggestion, idx) => {
        const klass =
          this.state.selectedQueryIndex === idx
            ? "drop-down-list-item drop-down-list-item-hover"
            : "drop-down-list-item";
        return (
          <li key={suggestion.id} className={klass}>
            <div
              className="menu-link"
              onMouseDown={() => this.handleOnSelect(suggestion)}
            >
              {suggestion.name}
            </div>
          </li>
        );
      }
    );

    let openKlass =
      this.props.suggestions.length > 0 && this.state.isFocus ? "open" : "";

    let autoCompleteInput;

    if (this.props.onCloseHandler) {
      autoCompleteInput = (
        <div className="input-group">
          {searchIcon} {searchInput} {closeIcon}
        </div>
      );
    } else {
      autoCompleteInput = (
        <div className="input-group">
          {searchInput} {searchIcon}
        </div>
      );
    }

    let autocomplete = (
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
    );
    if (this.props.backdrop) {
      autocomplete = (
        <div className="backdrop" onClick={this.handleOnClose}>
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
        </div>
      );
    }

    return <React.Fragment>{autocomplete}</React.Fragment>;
  }
}

export default withRouter(Autocomplete);
