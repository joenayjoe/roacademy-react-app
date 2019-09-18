import React, { Component, FormEvent, ChangeEvent } from "react";
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
}

interface AutocompleteState {
  isFocus: boolean;
  isIconHover: boolean;
  query: string;
}

class Autocomplete extends Component<AutocompleteProps, AutocompleteState> {
  state: AutocompleteState = {
    isFocus: false,
    isIconHover: false,
    query: ""
  };

  handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: e.currentTarget.value });
    this.props.onChangeHandler(e.currentTarget.value);
    console.log(e.currentTarget.value);
  };

  handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();
    this.props.onSubmitHandler(this.state.query);
  };
  handleOnFocus = () => {
    this.setState(prevState => {
      return { isFocus: !prevState.isFocus };
    });
    if(typeof this.props.onFocusHandler === "function") {
      this.props.onFocusHandler();
    }
  };

  handleIconHover = () => {
    this.setState(prevState => {
      return { isIconHover: !prevState.isIconHover };
    });
  };

  render() {
    let focusKlass = "blur";
    let iconColor = "#EC5252";

    if (this.state.isIconHover) {
      iconColor = "#FFFFFF";
    }

    if (this.state.isFocus) {
      focusKlass = "focus";
    }

    let searchIcon: JSX.Element | null = null;
    let searchInput = (
      <input
        type="search"
        name="query"
        value={this.state.query}
        placeholder={this.props.placeholder}
        aria-describedby="button-addon"
        className={`form-control bg-none border-0 ${focusKlass}`}
        onChange={e => this.handleOnChange(e)}
        onFocus={this.handleOnFocus}
        onBlur={this.handleOnFocus}
      />
    );
    if (this.props.icon != null) {
      searchIcon = (
        <div
          className={`input-group-append border-0 ${focusKlass}`}
          onMouseEnter={this.handleIconHover}
          onMouseLeave={this.handleIconHover}
        >
          <button
            id="button-addon"
            type="submit"
            className="btn btn-link text-success"
          >
            <FontAwesomeIcon icon={this.props.icon} color={iconColor} />
          </button>
        </div>
      );
    }

    let autoCompleteSuggestionList = this.props.suggestions.map(suggestion => {
      return (
        <li key={suggestion.id} className="drop-down-menu-item">
          <div className="menu-link">{suggestion.name}</div>
        </li>
      );
    });

    let openKlass = this.state.isFocus ? "open" : "";
    return (
      <div className={`autocomplete border drop-down ${openKlass}`}>
        <form className="form-inline" onSubmit={e => this.handleOnSubmit(e)}>
          <div className="input-group">
            {searchInput}
            {searchIcon}
          </div>
        </form>
        <ul className="autocomplete-suggestions drop-down-menu">
          {autoCompleteSuggestionList}
        </ul>
      </div>
    );
  }
}

export default Autocomplete;
