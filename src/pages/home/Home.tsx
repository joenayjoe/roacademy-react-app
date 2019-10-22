import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import Flash from "../../components/flash/Flash";
import { AlertVariant } from "../../settings/DataTypes";

interface IProps extends RouteComponentProps {}

class Home extends Component<IProps> {
  handleFalshClose = () => {
    this.props.history.push("/");
  };

  getFlashHeading = (variant: AlertVariant) => {
    switch (variant) {
      case AlertVariant.DANGER:
        return "IMPORTANT";
      case AlertVariant.SUCCESS:
        return "SUCCESS";
      case AlertVariant.WARNING:
        return "WARNING";
      case AlertVariant.INFO:
        return "INFO";
      default:
        return "NOTE";
    }
  };
  render() {
    let flashMessage;
    if (this.props.location.state && this.props.location.state.message) {
      let variant = this.props.location.state.variant || AlertVariant.DANGER;
      let error = this.props.location.state.message;
      flashMessage = (
        <Flash
          variant={variant}
          boldText={this.getFlashHeading(variant)}
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
