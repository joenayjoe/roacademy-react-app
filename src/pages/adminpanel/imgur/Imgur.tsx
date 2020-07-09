import React from "react";
import AdminControl from "../AdminControl";
import { IMGUR_AUTH_URL } from "../../../settings/Constants";

const Imgur: React.FunctionComponent = () => {
  return (
    <AdminControl>
      <div className="box-login">
        <a href={IMGUR_AUTH_URL} className="btn btn-primary"> Autorize with Imgur</a>
      </div>
    </AdminControl>
  );
};

export default Imgur;
