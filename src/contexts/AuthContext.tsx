import React, { createContext, Component } from "react";
import { IUser, ILoginResponse } from "../settings/DataTypes";
import AuthService from "../services/AuthService";

interface IStates {
  isAuthenticated: boolean;
  currentUser: IUser | null;
}

interface IProps {}

export interface IAuthContext extends IStates {
  login: (loginData: ILoginResponse) => void;
  logout: () => void;
}
export const AuthContext = createContext<IAuthContext | null>(null);

export const Provider = AuthContext.Provider;
export const AuthContextConsumer = AuthContext.Consumer;

export class AuthContextProvider extends Component<IProps, IStates> {
  private authService: AuthService;
  constructor(props: IProps) {
    super(props);
    this.authService = new AuthService();

    this.state = {
      isAuthenticated: this.authService.isLoggedIn(),
      currentUser: this.authService.getLastAuthUserFromCookies()
    };
  }

  handleLogin = (loginData: ILoginResponse) => {
    this.authService.setAuthCookies(loginData.accessToken, loginData.tokenType);
    this.setState({ isAuthenticated: true });
    this.authService.getCurrentUser().then(resp => {
      this.authService.setAuthUserCookies(resp.data);
      this.setState({ currentUser: resp.data });
    });
  };

  handleLogout = () => {
    this.authService.logout();
    this.setState({ isAuthenticated: false, currentUser: null });
  };

  render() {
    let initialState: IAuthContext = {
      isAuthenticated: this.state.isAuthenticated,
      currentUser: this.state.currentUser,
      login: this.handleLogin,
      logout: this.handleLogout
    };
    return <Provider value={initialState}>{this.props.children}</Provider>;
  }
}
