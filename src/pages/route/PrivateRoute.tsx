import React, { Component, ContextType } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { AlertVariant } from "../../settings/DataTypes";
import { AuthContext } from "../../contexts/AuthContext";

interface IProps extends RouteProps {
  component: any;
}

class PrivateRoute extends Component<IProps, {}> {
  static contextType = AuthContext;
  context!: ContextType<typeof AuthContext>;

  render() {
    const { component: Component, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props =>
          this.context && this.context.isAuthenticated ? (
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
                  variant: AlertVariant.DANGER,
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
