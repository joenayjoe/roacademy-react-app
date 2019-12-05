import React, { useContext } from "react";
import { Route, Redirect, RouteProps } from "react-router-dom";
import { AlertVariant } from "../../settings/DataTypes";
import { AuthContext } from "../../contexts/AuthContext";

interface IProps extends RouteProps {
  component: any;
  restricted?: boolean;
}

const PublicRoute: React.FunctionComponent<IProps> = props => {
  const authContext = useContext(AuthContext);
  const { component: Component, restricted, ...rest } = props;
  return (
    <Route
      {...rest}
      render={props =>
        authContext.isAuthenticated && restricted ? (
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
};

export default PublicRoute;
