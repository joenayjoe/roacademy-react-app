import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Autocomplete.css";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

interface AutocompleteProps {
  placeholder:string;
  icon?: IconProp;
  onChangeHandler(): void;
}

interface AutocompleteState {
  isFocus: boolean,
  isIconHover: boolean
}

class Autocomplete extends Component<AutocompleteProps, AutocompleteState> {
  state: AutocompleteState = {
    isFocus: false,
    isIconHover: false
  };
  handleOnFocus = () => {
    this.setState(prevState => {
      return { isFocus: !prevState.isFocus };
    });
  };

  handleIconHover = () => {
    this.setState(prevState => {
      return { isIconHover: !prevState.isIconHover };
    });
  }

  render() {
    let focusKlass = "blur";
    let iconColor = "#EC5252"

    if(this.state.isIconHover) {
      iconColor = "#FFFFFF";
    }

    if (this.state.isFocus) {
      focusKlass = "focus";
    }

    let searchIcon: JSX.Element | null = null;
    let searchInput = (
      <input
        type="search"
        placeholder={this.props.placeholder}
        aria-describedby="button-addon"
        className={`form-control bg-none border-0 ${focusKlass}`}
        onChange={this.props.onChangeHandler}
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
            type="button"
            className="btn btn-link text-success"
          >
            <FontAwesomeIcon icon={this.props.icon} color={iconColor} />
          </button>
        </div>
      );
    }

    return (
      <div className="input-group border">
        {searchInput}
        {searchIcon}
      </div>
    );
  }
}

export default Autocomplete;
