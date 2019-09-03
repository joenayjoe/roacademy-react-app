import React, { Component } from "react";
import Navbar from "../navbar/Navbar";
import SideDrawer from "../sidedrawer/SideDrawer";
import Backdrop from "../backdrop/Backdrop";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import Donation from "../donation/Donation";
import Home from "../home/Home";

import "./App.css";

import Modal from "../modal/Modal";
import {modalDataType} from "../../settings/DataTypes"

interface AppState {
  isSideDrawerOpen: boolean;
  isBackDropOpen: boolean;
  isModalOpen: boolean;
  modalData: modalDataType | null;
  modalSize: string;
}

class App extends Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {
      isSideDrawerOpen: false,
      isBackDropOpen: false,
      isModalOpen: false,
      modalData: null,
      modalSize: "modal-md"
    };
  }

  handleDrawerToggle = () => {
    this.setState(prevState => {
      return {
        isSideDrawerOpen: !prevState.isSideDrawerOpen,
        isBackDropOpen: !prevState.isBackDropOpen
      };
    });
  };

  showModal = (modaData: modalDataType, modalSize="modal-md") => {
    this.setState({
      isBackDropOpen: true,
      isModalOpen: true,
      modalData: modaData,
      modalSize: modalSize
    });
  };
  closeModal = () => {
    this.setState({
      isBackDropOpen: false,
      isModalOpen: false,
      modalData: null
    });
  };

  backdropClickHandler = () => {
    this.setState({
      isBackDropOpen: false,
      isSideDrawerOpen: false,
      isModalOpen: false,
      modalData: null
    });
  };

  render() {
    let backdrop;
    if (this.state.isBackDropOpen) {
      backdrop = <Backdrop onClickHandler={this.backdropClickHandler} />;
    }

    let modal;
    if(this.state.isModalOpen) {
      modal = <Modal modalData={this.state.modalData} size={this.state.modalSize} closeHandler={this.closeModal}/>;
    }

    return (
      <BrowserRouter>
        {backdrop}
        {modal}

        <Navbar
          drawerToggleHandler={this.handleDrawerToggle}
          modalShowHandler={(modalData) => this.showModal(modalData)}
          modalCloseHandler={this.closeModal}
        />
        <SideDrawer isOpen={this.state.isSideDrawerOpen} />

        <div className="content-wrapper">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/donation" component={Donation} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
