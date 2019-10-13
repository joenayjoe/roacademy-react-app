import React, { Component } from "react";

import "./UserDashboard.css";
import { CookiesService } from "../../services/CookiesService";
import { IUser } from "../../settings/DataTypes";
import { UserService } from "../../services/UserService";

interface IProps {}
interface IStates {
  currentUser: IUser | null;
}
class UserDashboard extends Component<IProps, IStates> {

  private cookiesService: CookiesService;
  private userService: UserService;

  constructor(props: IProps) {
    super(props);
    this.cookiesService = new CookiesService();
    this.userService = new UserService();

    this.state = {
      currentUser: null
    }
  }

  componentDidMount() {
    this.userService.getCurrentUser().then(response => {
      this.setState({currentUser: response.data});
    })
  }

  render() {
    let greeting;
    if(this.state.currentUser !== null) {
      greeting = <h1>Welcome {this.state.currentUser.firstName}</h1>;
    }
    return <div className="dashboard">
        {greeting}
        <p>User dashboard</p>
    </div>;
  }
}
export default UserDashboard;
