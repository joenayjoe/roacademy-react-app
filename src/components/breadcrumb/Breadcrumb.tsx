import React from "react";

interface IProp {
  className?: string;
}
const Breadcrumb: React.FunctionComponent<IProp> = props => {
  const classNames = props.className ? props.className : "";
  return (
    <nav aria-label="breadcrumb">
      <ol className={`breadcrumb mb-0 ${classNames}`}>{props.children}</ol>
    </nav>
  );
};
export default Breadcrumb;
