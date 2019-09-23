import React, { Component, FormEvent, ChangeEvent, createRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Autocomplete.css";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ILinkItem } from "../../settings/DataTypes";

interface AutocompleteProps {
  suggestions: ILinkItem[];
  placeholder: string;
  icon?: IconProp;
  onChangeHandler(query: string): void;
  onSubmitHandler(query: string): void;
  onFocusHandler?(): void;
  onCloseHandler?(): void;
}

interface AutocompleteState {
  isFocus: boolean;
  query: string;
}

class Autocomplete extends Component<AutocompleteProps, AutocompleteState> {
  state: AutocompleteState = {
    isFocus: false,
    query: ""
  };

  autocompleInputRef:any = createRef();

  handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: e.currentTarget.value });
    this.props.onChangeHandler(e.currentTarget.value);
  };

  handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();
    this.autocompleInputRef.blur();
    this.props.onSubmitHandler(this.state.query);
  };

  handleOnSelect = (suggestion: ILinkItem) => {
    this.setState({query: suggestion.name})
    this.props.onSubmitHandler(suggestion.name);
  }

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
        onFocus={this.toogleOnFocus}
        onBlur={this.toogleOnFocus}
        ref={node => (this.autocompleInputRef = node)}
      />
    );
    if (this.props.icon != null) {
      searchIcon = (
        <div className={`input-group-append border-0 ${focusKlass}`}>
          <button
            id="button-addon"
            type="submit"
            className="btn btn-link text-danger"
          >
            <FontAwesomeIcon icon={this.props.icon} />
          </button>
        </div>
      );
    }

    let autoCompleteSuggestionList = this.props.suggestions.map(suggestion => {
      return (
        <li key={suggestion.id} className="drop-down-list-item">
          <div className="menu-link" onMouseDown={() =>this.handleOnSelect(suggestion)}>{suggestion.name}</div>
        </li>
      );
    });

    let openKlass =
      this.props.suggestions.length > 0 && this.state.isFocus ? "open" : "";

    let autoCompleteInput = (
      <div className="input-group">
        {searchInput} {searchIcon}
      </div>
    );
    return (
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
  }
}

export default Autocomplete;
