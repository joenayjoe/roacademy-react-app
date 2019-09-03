import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/app/App';
import * as serviceWorker from './serviceWorker';

import 'bootstrap/dist/css/bootstrap.css'

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
    faCaretUp
} from "@fortawesome/free-solid-svg-icons";

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
    faCaretUp
);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
