import React from "react";

interface IProp {
  isOpen: boolean;
}
const Collapse: React.FunctionComponent<IProp> = props => {
  const klass = props.isOpen ? "collapse show" : "collapse";
  return <div className={klass}>{props.children}</div>;
};
export default Collapse;
