import React, { FormEvent, useState } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { HOME_URL } from "../../settings/Constants";

interface IProps extends RouteComponentProps {}
const TeacherRequest: React.FunctionComponent<IProps> = props => {
  // states
  const [qualification, setQualification] = useState<string>("");
  const [hasPrevExpr, setHasPrevExpr] = useState<boolean>(false);
  const [interestCourse, setInterestCourse] = useState<string>("");
  const [langPref, setLangPref] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [about, setAbout] = useState<string>("");

  const submitForm = (e: FormEvent) => {
    e.preventDefault();

    const formData = {
      qualification,
      hasPrevExpr,
      interestCourse,
      langPref,
      name,
      email,
      mobile,
      about
    };
    console.log("Form data = ", formData);
  };

  return (
    <div className="width-75">
      <div className="teacher-request-form">
        <div className="mt-2 mb-2">
          <h3>Teacher Request Form</h3>
        </div>
        <form onSubmit={submitForm}>
          <div className="form-group">
            <label>Please tell us your education qualification</label>
            <input
              type="text"
              className="form-control"
              value={qualification}
              onChange={e => setQualification(e.target.value)}
              placeholder="BSc in Physics"
              required
            ></input>
          </div>

          <div className="form-group">
            <label>Do you have any previous teaching experience</label>
            <br />
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="yesno"
                value="yes"
                id="yes"
                checked={hasPrevExpr ? true : false}
                onChange={() => setHasPrevExpr(true)}
              />
              <label className="form-check-label" htmlFor="yes">
                <strong>YES</strong>
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="yesno"
                value="no"
                id="no"
                checked={hasPrevExpr ? false : true}
                onChange={() => setHasPrevExpr(false)}
              />
              <label className="form-check-label" htmlFor="no">
                <strong>NO</strong>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>What courses would you prefer to teach</label>
            <input
              type="text"
              className="form-control"
              value={interestCourse}
              onChange={e => setInterestCourse(e.target.value)}
              placeholder="Physics"
              required
            ></input>
          </div>

          <div className="form-group">
            <label>In which languge woud you like to teach</label>
            <input
              type="text"
              className="form-control"
              value={langPref}
              onChange={e => setLangPref(e.target.value)}
              placeholder="Rohingya"
              required
            ></input>
          </div>

          <div className="form-group">
            <label>Tell us something about yourself</label>
            <textarea
              className="form-control"
              value={about}
              onChange={e => setAbout(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label>
              Give us your contact details so that we can contact you
            </label>
            <br />
            <label>Full name:</label>
            <input
              type="text"
              className="form-control mb-2"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
            />

            <label>Email:</label>
            <input
              type="text"
              className="form-control mb-2"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="teacher@example.com"
            />

            <label>Mobile:</label>
            <input
              type="text"
              className="form-control mt-2"
              value={mobile}
              onChange={e => setMobile(e.target.value)}
              placeholder="+95 xxx xxx xxxx"
            />
          </div>

          <div className="form-group action-btn-group">
            <button
              type="button"
              className="btn btn-danger action-btn"
              onClick={() => props.history.push(HOME_URL)}
            >
              CANCEL
            </button>
            <button type="submit" className="btn btn-primary action-btn">
              SEND
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default withRouter(TeacherRequest);
