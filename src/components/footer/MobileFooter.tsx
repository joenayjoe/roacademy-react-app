import React, { Component } from "react";

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
                  <a href="/">Courses</a>
                </li>
                <li>
                  <a href="/">Support Us</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-top"></div>

          <div className="footer-bottom">
            <div className="footer-content">
              <p><strong>Rohingya Academy</strong></p>
              <p>© {year} </p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default MobileFooter;
