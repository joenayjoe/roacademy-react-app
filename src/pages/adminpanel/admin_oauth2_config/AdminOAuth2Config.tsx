import React from "react";
import AdminControl from "../AdminControl";
import {
  BOX_AUTH_URL,
  IMGUR_AUTH_URL,
  YOUTUBE_AUTH_URL,
} from "../../../settings/Constants";

const AdminOAuth2Config: React.FunctionComponent = () => {
  return (
    <AdminControl>
      <div className="oaut2-provider-container mt-3 d-grid">
        <div className="box-config mb-2">
          <a href={BOX_AUTH_URL} className="btn btn-primary">
            BOX CONFIGURATION
          </a>
        </div>
        <div className="imgur-config mb-2">
          <a href={IMGUR_AUTH_URL} className="btn btn-primary">
            IMGUR CONFIGURATION
          </a>
        </div>
        <div className="youtube-config">
          <a href={YOUTUBE_AUTH_URL} className="btn btn-primary">
            YOUTUBE CONFIGURATION
          </a>
        </div>
      </div>
    </AdminControl>
  );
};
export default AdminOAuth2Config;
