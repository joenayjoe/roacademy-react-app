import React, { Component } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import AuthService from "../../services/AuthService";

interface IProps extends RouteProps {
  component: any;
}

class PrivateRoute extends Component<IProps, {}> {
  private authService: AuthService;
  constructor(props: IProps) {
    super(props);
    this.authService = new AuthService();
  }
  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props =>
          this.authService.isLoggedIn() ? (
            <Component
              key={`${props.location.pathname} ${props.location.search}`}
              {...props}
            />
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location,
                  message: "You're not log in. Please login to continue."
                }
              }}
            />
          )
        }
      ></Route>
    );
  }
}

export default PrivateRoute;
