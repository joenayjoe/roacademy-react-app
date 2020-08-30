import React, { Component } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES_URL, DONATION_URL } from "../../settings/Constants";

class DesktopFooter extends Component {
  render() {
    let year = new Date().getFullYear();
    return (
      <footer>
        <div className="footer-container">
          <div className="border-top"></div>

          <div className="footer-top">
            <div className="footer-content width-75">
              <ul>
                <li>
                  <a href="/">About Us</a>
                </li>
                <li>
                  <a href="/">Our Team</a>
                </li>
                <li>
                  <a href="/">Contact Us</a>
                </li>
              </ul>
              <ul>
                <li>
                  <Link to={CATEGORIES_URL}>Categories</Link>
                </li>
                <li>
                  <a href="/">Advice Us</a>
                </li>
                <li>
                  <Link to={DONATION_URL}>Support Us</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-top"></div>

          <div className="footer-bottom">
            <div className="footer-content width-75">
              <p>
                Copyright © {year} <strong>Rohingya Academy</strong>
              </p>
              <div className="d-flex">
                <div className="mr-2">
                  <a href="/">Term of Use</a>
                </div>
                <div>
                  <a href="/">Privacy and Cookie Policy</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}
export default DesktopFooter;
