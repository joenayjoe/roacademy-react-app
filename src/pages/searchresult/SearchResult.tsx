import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { ICourse } from "../../datatypes/types";
import { parseQueryParams } from "../../utils/queryParamParser";


interface IProps extends RouteComponentProps{}

interface IStates {
  courses: ICourse[];
}

class SearchResult extends Component<IProps, IStates> {
  private query: string;
  constructor(props: IProps) {
    super(props);
    this.query = this.props.location.search;
  }
  render() {
      let params = parseQueryParams(this.query);
    return (
      <div className="search-container">
        <h2>Search Result</h2>
        <p>Your search term: {params.query}</p>
      </div>
    );
  }
}

export default SearchResult;
