import React, { Component } from "react";
import { Link } from "react-router-dom";

import "./PageNotFound.css";

class PageNotFound extends Component {
  render() {
    return (
      <div className="error-container">
        <h1 className="error-heading">OOPS!</h1>
        <div error-body>
          We cannot find the page you're looking for. Try searching our  <Link to="/">Courses</Link>
        </div>
      </div>
    );
  }
}
export default PageNotFound;
