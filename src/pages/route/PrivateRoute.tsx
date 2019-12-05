import React, { useContext } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { AlertVariant, RoleType } from "../../settings/DataTypes";
import { AuthContext } from "../../contexts/AuthContext";

interface IProps extends RouteProps {
  component: any;
  role?: RoleType;
}

const PrivateRoute: React.FunctionComponent<IProps> = props => {
  const authContext = useContext(AuthContext);
  const { component: Component, role, ...rest } = props;
  return (
    <Route
      {...rest}
      render={props =>
        authContext.isAuthenticated && authContext.hasRole(role) ? (
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
                message: role ? "Access denied!" : "You're not log in. Please login to continue."
              }
            }}
          />
        )
      }
    ></Route>
  );
};

export default PrivateRoute;
