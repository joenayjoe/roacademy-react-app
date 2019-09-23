import React, { Component } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { isLoggedIn } from "../../utils/Helper";

interface IProps extends RouteProps {
  component: any;
}

class PrivateRoute extends Component<IProps, {}> {
  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props =>
          isLoggedIn ? (
            <Component
              key={`${props.location.pathname} ${props.location.search}`}
              {...props}
            />
          ) : (
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          )
        }
      ></Route>
    );
  }
}

export default PrivateRoute;
