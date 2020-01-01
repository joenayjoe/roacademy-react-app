import React from "react";
import { Link } from "react-router-dom";

interface IProp {
  active?: boolean;
  href?: string;
}

const BreadcrumbItem: React.FunctionComponent<IProp> = props => {
  return props.href ? (
    <li className="breadcrumb-item">
      <Link to={props.href}>{props.children}</Link>
    </li>
  ) : (
    <li className="breadcrumb-item active" aria-current="page">
      {props.children}
    </li>
  );
};
export default BreadcrumbItem;
