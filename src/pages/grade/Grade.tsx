import React, { Component } from "react";

import "./Grade.css";
import { RouteComponentProps } from "react-router";
import { IGrade } from "../../settings/DataTypes";
import ApiManager from "../../dataManagers/ApiManager";

interface matchedParams {
  category_id: string;
  grade_id: string;
}

interface IProps extends RouteComponentProps<matchedParams> {}

interface IStates {
  grade: IGrade | null;
}

class Grade extends Component<IProps, IStates> {
  private categoryId: string;
  private gradeId: string;
  private apiManager: ApiManager;

  constructor(props: IProps) {
    super(props);
    this.categoryId = this.props.match.params.category_id;
    this.gradeId = this.props.match.params.grade_id;
    this.apiManager = new ApiManager();
    this.state = { grade: null };
  }

  componentDidMount() {
    this.apiManager.getGrade(this.categoryId, this.gradeId).then(response => {
      this.setState({ grade: response.data });
    });
  }

  render() {
    let gradeContainerItems: JSX.Element = (
      <div className="spinner">Loading...</div>
    );
    if (this.state.grade) {
      gradeContainerItems = (
        <div className="course-list">
          <p>{this.state.grade.name}</p>
        </div>
      );
    }
    return <div className="grade-container">{gradeContainerItems}</div>;
  }
}
export default Grade;
