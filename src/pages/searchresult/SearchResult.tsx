import React from "react";
import { RouteComponentProps } from "react-router";
import { parseQueryParams } from "../../utils/queryParser";

interface IProps extends RouteComponentProps {}

const SearchResult: React.FunctionComponent<IProps> = props => {
  const queryParams = props.location.search;

  let params = parseQueryParams(queryParams);
  return (
    <div className="search-container width-75">
      <h2>Search Result</h2>
      <p>Your search term: {params.query}</p>
    </div>
  );
};

export default SearchResult;
