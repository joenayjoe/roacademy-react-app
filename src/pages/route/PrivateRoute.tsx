import React, { useContext } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { AlertVariant, RoleType } from "../../settings/DataTypes";
import { AuthContext } from "../../contexts/AuthContext";
import { AlertContext } from "../../contexts/AlertContext";
import { HOME_URL } from "../../settings/Constants";

interface IProps extends RouteProps {
  component: any;
  role?: RoleType;
}

const PrivateRoute: React.FunctionComponent<IProps> = props => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { component: Component, role, ...rest } = props;

  let hasAccess = authContext.isAuthenticated;

  if (role && hasAccess) {
    hasAccess = authContext.hasRole(role);
  }
  if (!hasAccess) {
    let msg = role
      ? "Access denied"
      : "You're not log in. Please login to continue.";
    alertContext.show(msg, AlertVariant.DANGER);
  }
  return (
    <Route
      {...rest}
      render={props =>
        hasAccess ? (
          <Component
            // key={`${props.location.pathname} ${props.location.search}`}
            {...props}
          />
        ) : (
          <Redirect
            to={{
              pathname: HOME_URL
            }}
          />
        )
      }
    ></Route>
  );
};

export default PrivateRoute;
