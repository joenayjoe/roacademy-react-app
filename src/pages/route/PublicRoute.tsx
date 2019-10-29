import React, { Component, ContextType } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { AlertVariant } from "../../settings/DataTypes";
import { AuthContext } from "../../contexts/AuthContext";

interface IProps extends RouteProps {
  component: any;
  restricted?: boolean;
}

class PublicRoute extends Component<IProps, {}> {
  static contextType = AuthContext;
  context!: ContextType<typeof AuthContext>;

  render() {
    const { component: Component, restricted, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={props =>
          this.context && this.context.isAuthenticated && restricted ? (
            <Redirect
              to={{
                pathname: "/",
                state: {
                  from: props.location,
                  variant: AlertVariant.DANGER,
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
