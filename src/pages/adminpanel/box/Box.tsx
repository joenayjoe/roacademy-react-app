import React from "react";
import AdminControl from "../AdminControl";
import { BOX_AUTH_URL } from "../../../settings/Constants";

const Box: React.FunctionComponent = () => {
  return (
    <AdminControl>
      <div className="box-login">
        <a href={BOX_AUTH_URL} className="btn btn-primary"> Autorize with Box</a>
      </div>
    </AdminControl>
  );
};

export default Box;
