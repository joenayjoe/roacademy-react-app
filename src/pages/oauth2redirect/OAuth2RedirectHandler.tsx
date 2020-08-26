import React, { useContext } from "react";
import { withRouter, RouteComponentProps, Redirect } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import { ILoginResponse, AlertVariant } from "../../settings/DataTypes";
import { HOME_URL, USER_DASHBOARD_URL } from "../../settings/Constants";
import { AlertContext } from "../../contexts/AlertContext";

interface IProps extends RouteComponentProps {}
const OAuth2RedirectHandler: React.FunctionComponent<IProps> = (props) => {
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const getUrlParameter = (name: string) => {
    // eslint-disable-next-line
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    let regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    let result = regex.exec(props.location.search);
    return result === null
      ? ""
      : decodeURIComponent(result[1].replace(/\+/g, ""));
  };

  const token = getUrlParameter("token");
  const err = getUrlParameter("error");
  if (token) {
    const loginResp: ILoginResponse = { accessToken: token };
    authContext.login(loginResp);
    return <Redirect to={USER_DASHBOARD_URL} />;
  } else {
    alertContext.show(err, AlertVariant.DANGER);
    return <Redirect to={HOME_URL} />;
  }
};

export default withRouter(OAuth2RedirectHandler);
