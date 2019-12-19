import React from "react";
import "./AdminPanel.css";
import { withRouter, RouteComponentProps } from "react-router";
import AdminControl from "./AdminControl";

interface IProps extends RouteComponentProps {}

const AdminDashboard: React.FunctionComponent<IProps> = props => {
  return (
    <AdminControl>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Labore, qui
        eius! Ipsum aliquam dolor ducimus consequatur tempore doloribus dicta
        voluptatibus ipsa. Doloremque quaerat dignissimos rerum atque ratione
        voluptas eius dolores?
      </p>
    </AdminControl>
  );
};
export default withRouter(AdminDashboard);
