import React, { Component } from "react";
import { Link } from "react-router-dom";
import { DONATION_URL } from "../../settings/Constants";

class MobileFooter extends Component {
  render() {
    let year = new Date().getFullYear();
    return (
      <footer>
        <div className="footer-container">
          <div className="border-top"></div>

          <div className="footer-top">
            <div className="footer-content">
              <ul>
                <li>
                  <a href="/">Terms</a>
                </li>
                <li>
                  <a href="/">Privacy and Cookie Policy</a>
                </li>
                <li>
                  <a href="/">About Us</a>
                </li>
                <li>
                  <a href="/">Contact Us</a>
                </li>
                <li>
                  <Link to={DONATION_URL}>Support Us</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-top"></div>

          <div className="footer-bottom">
            <div className="footer-content">
              <p>
                <strong>Rohingya Academy</strong>
              </p>
              <p>© {year} </p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default MobileFooter;
