import React, { useContext } from "react";
import TeacherRecruitBanner from "../../components/banner/TeacherRecruitBanner";
import { AuthContext } from "../../contexts/AuthContext";
import { RoleType } from "../../settings/DataTypes";

const Home: React.FunctionComponent = () => {
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
      <div className="width-75">
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dicta
          voluptatum hic temporibus cupiditate quis quas non rerum distinctio
          similique, doloribus nihil a dolorem doloremque quisquam incidunt
          nulla illo asperiores quaerat?
        </p>
      </div>
    </React.Fragment>
  );
};
export default Home;
