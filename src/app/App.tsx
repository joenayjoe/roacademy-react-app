import React, { Component } from "react";
import Navbar from "../pages/navbar/Navbar";

import { BrowserRouter, Route, Switch } from "react-router-dom";
import Donation from "../pages/donation/Donation";
import Home from "../pages/home/Home";

import "./App.css";

import Modal from "../components/modal/Modal";
import { ModalDataType, ModalSize, ModalType } from "../settings/DataTypes";
import SideDrawerNew from "../pages/sidedrawer/SideDrawerNew";

interface AppState {
  isSideDrawerOpen: boolean;
  isModalOpen: boolean;
  modalData: ModalDataType;
  modalSize: ModalSize;
  modalType: ModalType;
}

class App extends Component<{}, AppState> {
  state: AppState = {
    isSideDrawerOpen: false,
    isModalOpen: false,
    modalData: {
      heading: "Heading",
      modalBody: "modal body"
    },
    modalSize: "modal-md",
    modalType: "regular"
  };

  handleDrawerToggle = () => {
    this.setState(prevState => {
      return {
        isSideDrawerOpen: !prevState.isSideDrawerOpen
      };
    });
  };

  showModal = (
    modaData: ModalDataType,
    modalSize: ModalSize = "modal-md",
    modalType: ModalType = "regular"
  ) => {
    this.setState({
      isModalOpen: true,
      modalData: modaData,
      modalSize: modalSize,
      modalType: modalType
    });
  };
  closeModal = () => {
    this.setState({
      isModalOpen: false
    });
  };

  backdropClickHandler = () => {
    this.setState({
      isSideDrawerOpen: false
    });
  };

  render() {
    let modal;
    if (this.state.isModalOpen) {
      modal = (
        <Modal
          modalData={this.state.modalData}
          size={this.state.modalSize}
          modalType={this.state.modalType}
          closeHandler={this.closeModal}
        />
      );
    }

    return (
      <BrowserRouter>
        {modal}

        <Navbar
          drawerToggleHandler={this.handleDrawerToggle}
          modalShowHandler={(
            modalData: ModalDataType,
            modalSize?: ModalSize,
            modalType?: ModalType
          ) => this.showModal(modalData, modalSize, modalType)}
          modalCloseHandler={this.closeModal}
        />

        <SideDrawerNew
          isOpen={this.state.isSideDrawerOpen}
          modalShowHandler={(
            modalData: ModalDataType,
            modalSize?: ModalSize,
            modalType?: ModalType
          ) => this.showModal(modalData, modalSize, modalType)}
          modalCloseHandler={this.closeModal}
          backdropClickHandler={this.backdropClickHandler}
        />

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
