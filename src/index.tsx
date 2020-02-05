import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app/App";
import * as serviceWorker from "./serviceWorker";

import "bootstrap/dist/css/bootstrap.css";
import "./assets/styles/ra-common.css";
import "./assets/styles/ra-drop-down.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSignInAlt,
  faSignOutAlt,
  faSearch,
  faThList,
  faDonate,
  faBars,
  faAngleRight,
  faAngleDown,
  faAngleLeft,
  faAngleUp,
  faCaretUp,
  faEnvelope,
  faLock,
  faUser,
  faTimes,
  faTimesCircle,
  faCircleNotch,
  faEdit,
  faTrash,
  faSave,
  faPlus,
  faArrowUp,
  faArrowDown,
  faCheck,
  faDotCircle,
  faShare,
  faCalendarCheck,
  faFile,
  faFileDownload,
  faTasks,
  faPlusCircle,
  faExclamationCircle,
  faInfoCircle,
  faFlag,
  faCheckCircle,
  faMinus,
  faFilePdf,
  faFileVideo,
  faKeyboard
} from "@fortawesome/free-solid-svg-icons";

import {
  faFacebookF,
  faFacebook,
  faGoogle,
  faYoutube
} from "@fortawesome/free-brands-svg-icons";
library.add(
  faSignInAlt,
  faSignOutAlt,
  faSearch,
  faThList,
  faDonate,
  faBars,
  faAngleRight,
  faAngleLeft,
  faAngleDown,
  faAngleUp,
  faCaretUp,
  faArrowUp,
  faArrowDown,
  faFacebookF,
  faFacebook,
  faGoogle,
  faEnvelope,
  faLock,
  faUser,
  faTimes,
  faTimesCircle,
  faCircleNotch,
  faEdit,
  faTrash,
  faSave,
  faPlus,
  faMinus,
  faCheck,
  faDotCircle,
  faShare,
  faCalendarCheck,
  faYoutube,
  faFile,
  faFileDownload,
  faFilePdf,
  faFileVideo,
  faTasks,
  faPlusCircle,
  faExclamationCircle,
  faInfoCircle,
  faCheckCircle,
  faFlag,
  faKeyboard
);

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
