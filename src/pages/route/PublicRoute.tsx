import React, { Component } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import AuthService from "../../services/AuthService";

interface IProps extends RouteProps {
  component: any;
  restricted?: boolean;
}

class PublicRoute extends Component<IProps, {}> {
  private authService: AuthService;
  constructor(props: IProps) {
    super(props);
    this.authService = new AuthService();
  }
  render() {
    const { component: Component, restricted, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props =>
          this.authService.isLoggedIn() && restricted ? (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location,
                  message: "Access denied"
                }
              }}
            />
          ) : (
            <Component
              key={`${props.location.pathname} ${props.location.search}`}
              {...props}
            />
          )
        }
      ></Route>
    );
  }
}

export default PublicRoute;
