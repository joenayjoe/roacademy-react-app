import React, { createContext, useState } from "react";
import { IUser, ILoginResponse, RoleType } from "../settings/DataTypes";
import AuthService from "../services/AuthService";

interface IProps {}

export interface IAuthContext {
  isAuthenticated: boolean;
  currentUser: IUser | null;
  login: (loginData: ILoginResponse) => void;
  logout: () => void;
  isAdmin: () => boolean;
  hasRole: (role: RoleType) => boolean;
}

let contextDefaultValue: IAuthContext = {
  isAuthenticated: false,
  currentUser: null,
  login: () => {},
  logout: () => {},
  isAdmin: () => false,
  hasRole: () => false
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

  const isAdmin = (): boolean => {
    if (currentUser && currentUser.roles.some(r => r.name === RoleType.ADMIN)) {
      return true;
    }
    return false;
  };
  const hasRole = (role: RoleType) => {
    if (currentUser && currentUser.roles.some(r => r.name === role)) {
      return true;
    }
    return false;
  };
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
    logout: handleLogout,
    isAdmin: isAdmin,
    hasRole: hasRole
  };
  return <Provider value={initialState}>{props.children}</Provider>;
};
export default AuthContextProvider;
