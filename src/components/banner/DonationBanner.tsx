import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import "./Banner.css";
import { DONATION_URL } from "../../settings/Constants";

interface IProps extends RouteComponentProps {}
const DonationBanner: React.FunctionComponent<IProps> = props => {
  return (
    <div className="banner donation-banner">
      <h1 className="banner-header d-none d-md-block">
        Support Roacademy
      </h1>
      <hr className="my-4 d-none d-md-block" />
      <p className="banner-text">
        <strong>Roacademy</strong> will always be free for life time. To
        keep the content updated and available for all, we need your support.
      </p>

      <button
        className="btn btn-info btn-lg"
        onClick={() => props.history.push(DONATION_URL)}
      >
        DONATE US
      </button>
    </div>
  );
};
export default withRouter(DonationBanner);
