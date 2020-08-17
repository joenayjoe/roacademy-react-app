import React, { useEffect, useState, useContext } from "react";
import { RouteComponentProps } from "react-router-dom";
import UserService from "../../services/UserService";
import { IUser, AlertVariant } from "../../settings/DataTypes";
import { AlertContext } from "../../contexts/AlertContext";
import { axiosErrorParser } from "../../utils/errorParser";
import Spinner from "../../components/spinner/Spinner";

interface matchedParams {
  user_id: string;
}
interface IProp extends RouteComponentProps<matchedParams> {}

const PublicProfile: React.FunctionComponent<IProp> = (props) => {
  const userId: string = props.match.params.user_id;

  const alertContext = useContext(AlertContext);

  const userService = new UserService();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    setIsLoading(true);
    userService
      .getUser(+userId)
      .then((resp) => {
        setUser(resp.data);
        setIsLoading(false);
      })
      .catch((err) => {
        alertContext.show(
          axiosErrorParser(err).join(", "),
          AlertVariant.DANGER
        );
        setIsLoading(false);
      });
    // eslint-disable-next-line
  }, [userId]);

  if (isLoading) {
    return <Spinner size="3x" />;
  }

  return (
    <div className="user-public-profile-wrapper">
      First Name: {user!.firstName}
      Last Name : {user!.lastName}
    </div>
  );
};

export default PublicProfile;
