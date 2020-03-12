import React, { Component, ContextType } from "react";
import UserSettingContainer from "./UserSettingContainer";
import AuthService from "../../services/AuthService";
import { AuthContext } from "../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactCrop, { Crop } from "react-image-crop";

import "react-image-crop/dist/ReactCrop.css";
import {
  cropAndConvertToBase64,
  base64StringtoFile
} from "../../utils/imageUtil";
import UserService from "../../services/UserService";

interface IStates {
  selectedFile: File | null;
  imgSrc: any;
  crop: Crop;
  image: HTMLImageElement | null;
  isCropped: boolean;
}
class UserPhotoSetting extends Component<null, IStates> {
  private authService: AuthService;
  private userService: UserService;
  static contextType = AuthContext;
  context!: ContextType<typeof AuthContext>;

  constructor(props: any) {
    super(props);
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  state: IStates = {
    selectedFile: null,
    imgSrc: null,
    crop: {
      unit: "%",
      x: 10,
      y: 10,
      width: 80,
      height: 80
    },
    image: null,
    isCropped: false
  };

  setStateAfterPhotoChange = (file: File, imgSrc: any) => {
    this.setState({
      selectedFile: file,
      imgSrc: imgSrc,
      crop: {
        unit: "%",
        x: 10,
        y: 10,
        width: 80,
        height: 80
      },
      image: null,
      isCropped: false
    });
  };
  handleProfilePhotoInputOnChange = (files: FileList | null) => {
    if (files) {
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => this.setStateAfterPhotoChange(files[0], reader.result),
        false
      );
      reader.readAsDataURL(files[0]);
    }
  };

  handleCropOnChange = (crop: Crop) => {
    this.setState({ crop: crop });
  };

  handleCropOnImageLoaded = (image: HTMLImageElement) => {
    this.setState({ image: image });
  };

  handleCropBtnClick = () => {
    let imgSrc = cropAndConvertToBase64(this.state.crop, this.state.image);
    this.setState({ imgSrc: imgSrc, isCropped: true });
  };

  getImageUploadInput = () => {
    let imageInput;
    if (this.state.selectedFile == null || this.state.isCropped) {
      let fileLabel =
        this.state.selectedFile == null
          ? "Choose a photo"
          : this.state.selectedFile.name;
      imageInput = (
        <div className="input-group mb-3">
          <div className="custom-file">
            <input
              type="file"
              title={fileLabel}
              className="custom-file-input"
              id="profile-photo-upload-input"
              accept=".jpeg,.jpg,.png, .gif"
              multiple={false}
              onChange={e =>
                this.handleProfilePhotoInputOnChange(e.target.files)
              }
            />
            <label className="custom-file-label">{fileLabel}</label>
          </div>
        </div>
      );
    } else {
      imageInput = (
        <button className="btn btn-danger" onClick={this.handleCropBtnClick}>
          Crop
        </button>
      );
    }
    return imageInput;
  };

  uploadProfilePhoto = () => {
    let { selectedFile, imgSrc } = this.state;
    if (selectedFile) {
      let fileName = selectedFile.name;
      let photoFile = base64StringtoFile(imgSrc, fileName);

      let formData = new FormData();
      formData.append("file", photoFile);
      let userId =
        this.context && this.context.currentUser && this.context.currentUser.id;
      if (userId !== null) {
        this.userService.updateUserProfilePhoto(formData, userId).then(resp => {
          this.authService.setLoggedInUserCookie(resp.data);
          window.location.reload();
        });
      }
    }
  };

  render() {
    let imagePreview = (
      <FontAwesomeIcon icon="user" size="9x" color="rgb(104, 111, 122)" />
    );

    if (this.state.selectedFile !== null && !this.state.isCropped) {
      imagePreview = (
        <ReactCrop
          src={this.state.imgSrc}
          crop={this.state.crop}
          onChange={this.handleCropOnChange}
          onImageLoaded={this.handleCropOnImageLoaded}
        />
      );
    } else if (this.state.isCropped) {
      let imageUrl = this.state.imgSrc;
      imagePreview = <img src={imageUrl} alt="Preview" />;
    } else if (
      this.context &&
      this.context.currentUser &&
      this.context.currentUser.imageUrl
    ) {
      let imageUrl = this.context.currentUser.imageUrl;
      imagePreview = <img src={imageUrl} alt="Preview" />;
    }
    return (
      <UserSettingContainer>
        <div className="user-profile-form-wrapper">
          <div className="user-profile-header">
            <h3>Photo</h3>
            <p className="text-secondary">Add a nice profile photo</p>
          </div>
          <div className="user-profile-edit-form">
            <div className="photo-preview-container">
              <h5>Image Preview</h5>
              <div className="photo-preview">{imagePreview}</div>
              <div className="photo-upload-btn">
                <h6>Add / Change Image</h6>
                {this.getImageUploadInput()}
              </div>
            </div>
          </div>
          <div className="user-profile-footer">
            <button
              className="btn btn-primary mt-2"
              onClick={this.uploadProfilePhoto}
            >
              Save
            </button>
          </div>
        </div>
      </UserSettingContainer>
    );
  }
}

export default UserPhotoSetting;
