import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import TeacherRecruitBanner from "../../components/banner/TeacherRecruitBanner";
import { RoleType } from "../../settings/DataTypes";

interface IProps {}

const UserDashboard: React.FunctionComponent<IProps> = () => {
  const authContext = useContext(AuthContext);

  const teacherBanner = () => {
    if (authContext.currentUser) {
      if (authContext.hasRole(RoleType.TEACHER) || authContext.isAdmin()) {
        return null;
      } else {
        return <TeacherRecruitBanner />;
      }
    }
    return null;
  };

  let greeting;
  if (authContext.currentUser) {
    greeting = <h1>Welcome {authContext.currentUser.firstName}</h1>;
  }
  return (
    <React.Fragment>
      {teacherBanner()}
      <div className="dashboard width-75">
        {greeting}
        <p>User dashboard</p>
      </div>
    </React.Fragment>
  );
};
export default UserDashboard;
