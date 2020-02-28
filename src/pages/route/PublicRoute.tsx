import React, { useContext } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { AlertVariant } from "../../settings/DataTypes";
import { AuthContext } from "../../contexts/AuthContext";
import { AlertContext } from "../../contexts/AlertContext";
import { HOME_URL } from "../../settings/Constants";

interface IProps extends RouteProps {
  component: any;
  restricted?: boolean;
}

const PublicRoute: React.FunctionComponent<IProps> = props => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const { component: Component, restricted, ...rest } = props;

  const isRestricted = authContext.isAuthenticated && restricted;
  if (isRestricted) {
    let msg = "Access denied";
    alertContext.show(msg, AlertVariant.DANGER);
  }

  return (
    <Route
      {...rest}
      render={props =>
        isRestricted ? (
          <Redirect
            to={{
              pathname: HOME_URL
            }}
          />
        ) : (
          <Component
            // key={`${props.location.pathname} ${props.location.search}`}
            {...props}
          />
        )
      }
    ></Route>
  );
};

export default PublicRoute;
