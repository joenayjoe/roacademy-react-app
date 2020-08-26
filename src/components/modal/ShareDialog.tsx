import React, { useState, useRef } from "react";
import Modal from "./Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IProp {
  isOpen: boolean;
  title: string;
  link: string;
  description: string;
  closeHandler: () => void;
}
const ShareDialog: React.FunctionComponent<IProp> = (props) => {
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const textRef = useRef<HTMLInputElement>(null);

  const handleFbClick = () => {
    window.open(
      "https://www.facebook.com/sharer/sharer.php?u=" +
        encodeURIComponent(props.link),
      "_blank"
    );
  };

  const handleTwitterClick = () => {
    const tweet = props.description + "  " + props.link;
    window.open("https://twitter.com/intent/tweet?text=" + tweet, "_blank");
  };

  const copySharedLinkToClipboard = () => {
    if (textRef.current) {
      textRef.current.select();
      document.execCommand("copy");
      setCopySuccess(true);
    }
  };

  const mb = (
    <div className="social-share">
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          defaultValue={props.link}
          readOnly={true}
          aria-label="Course Link"
          ref={textRef}
        />
        <div className="input-group-append">
          <button
            className="btn btn-primary"
            onClick={copySharedLinkToClipboard}
          >
            Copy
          </button>
        </div>
        {copySuccess && <span className="text-success ml-2">Copied!</span>}
      </div>
      <div className="d-flex justify-content-center">
        <button
          className="btn btn-primary rounded-circle"
          onClick={handleFbClick}
        >
          <FontAwesomeIcon icon={["fab", "facebook-f"]} />
        </button>

        <button
          className="btn btn-primary rounded-circle ml-2"
          onClick={handleTwitterClick}
        >
          <FontAwesomeIcon icon={["fab", "twitter"]} />
        </button>

        <a
          className="btn btn-primary rounded-circle ml-2"
          href={"mailto:?Subject=" + props.description + "&body=" + props.link}
        >
          <FontAwesomeIcon icon="envelope" />
        </a>
      </div>
    </div>
  );

  if (props.isOpen) {
    return (
      <Modal
        isOpen={props.isOpen}
        modalTitle={props.title}
        modalBody={mb}
        size={"modal-lg"}
        onCloseHandler={props.closeHandler}
      />
    );
  }
  return null;
};
export default ShareDialog;
