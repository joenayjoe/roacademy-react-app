import React, { Component } from "react";

import "./Footer.css";

class Footer extends Component {
  render() {
    let year = new Date().getFullYear();
    return (
      <footer>
        <div className="footer-container">
          <div className="border-top"></div>

          <div className="footer-top width-75">
            <ul>
              <li>About Us</li>
              <li>Contact Us</li>
              <li>Our Team</li>
              <li>Support Us</li>
            </ul>
            <ul>
              <li>Categories</li>
              <li>Courses</li>
              <li>Advice us</li>
            </ul>
            <div>Change Language</div>
          </div>

          <div className="border-top"></div>

          <div className="footer-bottom width-75">
            <p>Copyright © {year} Rohingya Academy</p>
            <div className="d-flex">
              <p>Term of Use</p>
              <p>Privacy Policy</p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}
export default Footer;
