import React, { createContext, Component } from "react";
import { IUser } from "../settings/DataTypes";
import { isLoggedIn } from "../utils/authHelper";
import { UserService } from "../services/UserService";

interface IStates {
  isAuthenticated: boolean;
  currentUser: IUser | null;
}

interface IProps {}

export interface IAuthContext extends IStates {
  updateAuthContext: () => void;
}
export const AuthContext = createContext<IAuthContext | null>(null);

export const Provider = AuthContext.Provider;
export const AuthContextConsumer = AuthContext.Consumer;

export class AuthContextProvider extends Component<IProps, IStates> {
  private userService: UserService;
  constructor(props: IProps) {
    super(props);
    this.userService = new UserService();

    this.state = {
      isAuthenticated: false,
      currentUser: null
    };
  }

  componentDidMount() {
      this.updateContext();
  }

  updateAuthContext = (): void => {
      this.updateContext();
  };

  updateContext = () => {
    if (isLoggedIn()) {
      this.userService.getCurrentUser().then(resp => {
        this.setState({ isAuthenticated: true, currentUser: resp.data });
      });
    } else {
        this.setState({isAuthenticated: false, currentUser: null})
    }
  };

  render() {
    let initialState: IAuthContext = {
      isAuthenticated: this.state.isAuthenticated,
      currentUser: this.state.currentUser,
      updateAuthContext: this.updateAuthContext
    };
    return <Provider value={initialState}>{this.props.children}</Provider>;
  }
}
