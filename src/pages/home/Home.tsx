import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import FlashGenerator from "../../components/flash/FlashGenerator";

interface IProps extends RouteComponentProps {}

class Home extends Component<IProps> {
  render() {
    return (
      <div>
        <FlashGenerator
          state={this.props.location.state}
          closeHandler={() =>
            this.props.history.push(this.props.location.pathname)
          }
        />
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
