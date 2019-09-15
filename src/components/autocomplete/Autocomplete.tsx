import React, { Component, FormEvent, ChangeEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Autocomplete.css";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface AutocompleteProps {
  suggestions: string[];
  placeholder: string;
  icon?: IconProp;
  onChangeHandler(query:string): void;
  onSubmitHandler(query:string):void;
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
    this.setState({query: e.currentTarget.value})
    this.props.onChangeHandler(e.currentTarget.value);
  }

  handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();
    this.props.onSubmitHandler(this.state.query);
  }
  handleOnFocus = () => {
    this.setState(prevState => {
      return { isFocus: !prevState.isFocus };
    });
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
        value = {this.state.query}
        placeholder={this.props.placeholder}
        aria-describedby="button-addon"
        className={`form-control bg-none border-0 ${focusKlass}`}
        onChange={(e) => this.handleOnChange(e)}
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

    return (
      <div className="autocomplete border">
        <form className="form-inline" onSubmit={(e) =>this.handleOnSubmit(e)}>
          <div className="input-group">
            {searchInput}
            {searchIcon}
          </div>
        </form>
      </div>
    );
  }
}

export default Autocomplete;
