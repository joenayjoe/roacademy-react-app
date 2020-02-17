import React from "react";
import { ILecture } from "../../settings/DataTypes";

interface IProp {
    lecture: ILecture;
}
const LecturePlayer:React.FunctionComponent<IProp> = props => {
    return(<div className="lecture-player">
        This is lecture player view: {props.lecture.name}
    </div>)
}
export default LecturePlayer;