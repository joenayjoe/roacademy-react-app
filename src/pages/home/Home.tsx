import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import ErrorFlash from "../../components/flash/ErrorFlash";

interface IProps extends RouteComponentProps {}

class Home extends Component<IProps> {
  handleFalshClose = () => {
    this.props.history.push("/");
  };

  render() {
    let flashMessage;
    if (this.props.location.state && this.props.location.state.message) {
      let error = this.props.location.state.message;
      flashMessage = (
        <ErrorFlash
          boldText="Important"
          title={error}
          dismissible
          closeHandler={this.handleFalshClose}
        />
      );
    }
    return (
      <div>
        {flashMessage}
        <h1>Home</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dicta
          voluptatum hic temporibus cupiditate quis quas non rerum distinctio
          similique, doloribus nihil a dolorem doloremque quisquam incidunt
          nulla illo asperiores quaerat?
        </p>
      </div>
    );
  }
}
export default withRouter(Home);
