import React, { Component } from "react";

import "./UserDashboard.css";
import { IUser } from "../../settings/DataTypes";
import AuthService from "../../services/AuthService";

interface IProps {}
interface IStates {
  currentUser: IUser | null;
}
class UserDashboard extends Component<IProps, IStates> {
  private authService: AuthService;

  constructor(props: IProps) {
    super(props);
    this.authService = new AuthService();

    this.state = {
      currentUser: null
    };
  }

  componentDidMount() {
    this.authService.getCurrentUser().then(response => {
      this.setState({ currentUser: response.data });
    });
  }

  render() {
    let greeting;
    if (this.state.currentUser !== null) {
      greeting = <h1>Welcome {this.state.currentUser.firstName}</h1>;
    }
    return (
      <div className="dashboard">
        {greeting}
        <p>User dashboard</p>
      </div>
    );
  }
}
export default UserDashboard;
