import React, { Component } from "react";

import "./Category.css";
import { RouteComponentProps, withRouter } from "react-router";
import { ICategory} from "../../settings/DataTypes";
import { CategoryService } from "../../services/CategoryService";

interface MatchParams {
  category_id: string;
}
interface IProps extends RouteComponentProps<MatchParams> {}

interface IStates {
  category: ICategory | null;
}

class Category extends Component<IProps, IStates> {
  private categoryId: string;
  private categoryService: CategoryService;

  constructor(props: IProps) {
    super(props);
    this.categoryId = this.props.match.params.category_id;
    this.categoryService = new CategoryService();
    this.state = {
      category: null
    };
  }
  componentDidMount() {
    this.categoryService
      .getCategoryWithGrade(this.categoryId)
      .then(response => {
        console.log(response.data);
        this.setState({ category: response.data });
      })
      .catch(error => {
          console.log("error =>",error.response.data)
      });
  }
  render() {
    let categoryContainer: JSX.Element = <div className="spinner">Loading ...</div>;
    if (this.state.category) {
      categoryContainer = (
        <React.Fragment>
          <div className="subject-list">
            <h5>{`Popular Topics in ${this.state.category.name}`}</h5>
            <p>List of Subject title goes here</p>
          </div>

          <div className="course-list">
            <h5>{`All ${this.state.category.name} Courses`}</h5>
            <p>List of courses go here</p>
          </div>
        </React.Fragment>
      );
    }

    return <div className="category-container">{categoryContainer}</div>;
  }
}

export default withRouter(Category);
