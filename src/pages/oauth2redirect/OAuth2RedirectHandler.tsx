import React, { Component, ContextType } from "react";
import { withRouter, RouteComponentProps, Redirect } from "react-router";
import { AuthContext } from "../../contexts/AuthContext";
import { ILoginResponse, AlertVariant } from "../../settings/DataTypes";

interface IProps extends RouteComponentProps {}
class OAuth2RedirectHandler extends Component<IProps> {
  static contextType = AuthContext;
  context!: ContextType<typeof AuthContext>;

  getUrlParameter = (name: string) => {
    // eslint-disable-next-line
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let result = regex.exec(this.props.location.search);
    return result === null
      ? ""
      : decodeURIComponent(result[1].replace(/\+/g, ""));
  };
  render() {
    const token = this.getUrlParameter("token");
    const err = this.getUrlParameter("error");
    if (token) {
      const loginResp: ILoginResponse = { accessToken: token };
      this.context && this.context.login(loginResp);
      return (
        <Redirect
          to={{
            pathname: "/dashboard"
          }}
        />
      );
    } else {
      return (
        <Redirect
          to={{
            pathname: "/",
            state: {
              from: this.props.location,
              variant: AlertVariant.DANGER,
              message: err
            }
          }}
        />
      );
    }
  }
}

export default withRouter(OAuth2RedirectHandler);
