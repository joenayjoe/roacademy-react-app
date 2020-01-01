import React from "react";

interface IProp {}
const Breadcrumb: React.FunctionComponent<IProp> = props => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">{props.children}</ol>
    </nav>
  );
};
export default Breadcrumb;
