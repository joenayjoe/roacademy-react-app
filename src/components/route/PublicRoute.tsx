import React, { Component } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { isLoggedIn } from "../../utils/Helper";

interface IProps extends RouteProps {
  component: any;
  restricted?: boolean;
}

class PublicRoute extends Component<IProps, {}> {
  render() {
    const { component: Component, restricted, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props =>
          isLoggedIn && restricted ? (
            <Redirect to="/home" />
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