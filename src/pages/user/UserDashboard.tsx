import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import TeacherRecruitBanner from "../../components/banner/TeacherRecruitBanner";
import { RoleType } from "../../settings/DataTypes";
import UserCourses from "./UserCourses";

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

  return (
    <React.Fragment>
      {teacherBanner()}
      <div className="dashboard">
        {authContext.currentUser && <UserCourses />}
      </div>
    </React.Fragment>
  );
};
export default UserDashboard;
