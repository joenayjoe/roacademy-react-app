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
  faPlus
} from "@fortawesome/free-solid-svg-icons";

import {
  faFacebookF,
  faFacebook,
  faGoogle
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
  faCaretUp,
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
  faPlus
);

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
