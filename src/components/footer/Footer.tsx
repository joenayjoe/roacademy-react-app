import React, { Component } from "react";

import "./Footer.css";
import { isMobileOnly } from "react-device-detect";
import MobileFooter from "./MobileFooter";
import DesktopFooter from "./DesktopFooter";

class Footer extends Component {
  render() {
    return isMobileOnly ? <MobileFooter /> : <DesktopFooter />;
  }
}
export default Footer;
