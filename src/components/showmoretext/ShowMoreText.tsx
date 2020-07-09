import React, { useState, useRef, useEffect } from "react";

export type Unit = "px" | "%";
interface IProp {
  height?: number;
  unit?: Unit;
  more?: string;
  less?: string;
  expanded?: boolean;
}
const ShowMoreText: React.FunctionComponent<IProp> = (props) => {
  const height = props.height ? props.height : 100;
  const unit = props.unit ? props.unit : "px";

  const [isExpanded, setIsExpanded] = useState<boolean>(
    props.expanded ? props.expanded : false
  );
  const [clientHeight, setClientHeight] = useState<number>(0);
  const [style, setStyle] = useState<Object>({});

  let nodeRef = useRef<HTMLDivElement>(null);

  const moreText = props.more ? props.more : "SHOW MORE";
  const lessText = props.less ? props.less : "SHOW LESS";

  useEffect(() => {
    if (nodeRef.current) {
      let nh = nodeRef.current.clientHeight;
      let s = {
        height: height <= nh ? height + unit : nh + unit,
        overflow: "hidden",
      };
      setStyle(s);
      setClientHeight(nh);
    }
  }, [height, unit]);

  const handleOnClick = () => {
    if (isExpanded) {
      let s = {
        height: height <= clientHeight ? height + unit : clientHeight + unit,
        overflow: "hidden",
      };
      setIsExpanded(false);
      setStyle(s);
    } else {
      let s = {
        height: "inherit",
        overflow: "visible",
      };
      setIsExpanded(true);
      setStyle(s);
    }
  };

  const showMoreButton = () => {
    if (clientHeight > height) {
      return (
        <button
          className="btn btn-sm btn-outline-primary mt-2"
          onClick={() => handleOnClick()}
        >
          {isExpanded ? lessText : moreText}
        </button>
      );
    }
    return null;
  };

  return (
    <React.Fragment>
      <div ref={nodeRef} style={style}>
        {props.children}
      </div>
      {showMoreButton()}
    </React.Fragment>
  );
};
export default ShowMoreText;
