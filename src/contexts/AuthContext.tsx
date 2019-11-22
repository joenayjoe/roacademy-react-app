import React, { createContext, useState } from "react";
import { IUser, ILoginResponse } from "../settings/DataTypes";
import AuthService from "../services/AuthService";

interface IProps {}

export interface IAuthContext {
  isAuthenticated: boolean;
  currentUser: IUser | null;
  login: (loginData: ILoginResponse) => void;
  logout: () => void;
}

let contextDefaultValue: IAuthContext = {
  isAuthenticated: false,
  currentUser: null,
  login: () => {},
  logout: () => {}
};
export const AuthContext = createContext<IAuthContext>(contextDefaultValue);

export const Provider = AuthContext.Provider;
export const AuthContextConsumer = AuthContext.Consumer;

const AuthContextProvider: React.FunctionComponent<IProps> = props => {
  const authService = new AuthService();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    authService.isLoggedIn()
  );
  const [currentUser, setCurrentUser] = useState<IUser | null>(
    authService.getLastAuthUserFromCookies()
  );

  const handleLogin = (loginData: ILoginResponse) => {
    authService.setAccessTokenCookie(loginData.accessToken);
    setIsAuthenticated(true);
    authService.getCurrentUser().then(resp => {
      authService.setLoggedInUserCookie(resp.data);
      setCurrentUser(resp.data);
    });
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  let initialState: IAuthContext = {
    isAuthenticated: isAuthenticated,
    currentUser: currentUser,
    login: handleLogin,
    logout: handleLogout
  };
  return <Provider value={initialState}>{props.children}</Provider>;
};
export default AuthContextProvider;