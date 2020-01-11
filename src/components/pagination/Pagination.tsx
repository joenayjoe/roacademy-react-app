import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IProp {
  first: boolean;
  last: boolean;
  currentPage: number;
  totalPage: number;
  pageClickHandler: (page: number) => void;
}
const Pagination: React.FunctionComponent<IProp> = props => {
  const buildActiveItem = (page: number) => {
    return (
      <li className="page-item active" key={page}>
        <button className="page-link">
          {page + 1}
          <span className="sr-only">(current)</span>
        </button>
      </li>
    );
  };

  const buildNoneActiveItem = (page: number) => {
    return (
      <li
        className="page-item d-none d-sm-block"
        key={page}
        onClick={() => props.pageClickHandler(page)}
      >
        <button className="page-link">{page + 1}</button>
      </li>
    );
  };

  const pageItems: JSX.Element[] = [];
  for (let i = 0; i < props.totalPage; i++) {
    let li =
      props.currentPage === i ? buildActiveItem(i) : buildNoneActiveItem(i);
    pageItems.push(li);
  }

  const pagination = (
    <nav aria-label="Pagination">
      <ul className="pagination justify-content-center">
        <li
          className={`page-item ${props.first ? "disabled" : ""}`}
          onClick={() => props.pageClickHandler(props.currentPage - 1)}
        >
          <button className="page-link">
            <FontAwesomeIcon icon="angle-left" />
          </button>
        </li>
        {pageItems}
        <li className={`page-item ${props.last ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => props.pageClickHandler(props.currentPage + 1)}
          >
            <FontAwesomeIcon icon="angle-right" />
          </button>
        </li>
      </ul>
    </nav>
  );
  return props.totalPage > 1 ? pagination : null;
};
export default Pagination;
