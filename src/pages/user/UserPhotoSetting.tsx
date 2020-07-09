import React, {useContext, useState } from "react";
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
import { parseError } from "../../utils/errorParser";
import { AlertContext } from "../../contexts/AlertContext";
import { AlertVariant } from "../../settings/DataTypes";
import Spinner from "../../components/spinner/Spinner";

const UserPhotoSetting: React.FunctionComponent = () => {

  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);
  const userService = new UserService();
  const authService = new AuthService();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<any>(null);
  const [crop, setCrop] = useState<Crop>({unit: "%", x: 10, y: 10, width: 80, height: 80});
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isCropped, setIsCropped] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const setStateAfterPhotoChange = (file: File, imgSrc: any) => {
    setSelectedFile(file);
    setImgSrc(imgSrc);
    setCrop( {
      unit: "%",
      x: 10,
      y: 10,
      width: 80,
      height: 80
    });
    setImage(null);
    setIsCropped(false);
  };
  const handleProfilePhotoInputOnChange = (files: FileList | null) => {
    if (files) {
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => setStateAfterPhotoChange(files[0], reader.result),
        false
      );
      reader.readAsDataURL(files[0]);
    }
  };

  const handleCropOnChange = (crop: Crop) => {
    setCrop(crop);
  };

  const handleCropOnImageLoaded = (image: HTMLImageElement) => {
   setImage(image);
  };

  const handleCropBtnClick = () => {
    let imgSrc = cropAndConvertToBase64(crop, image);
    setImgSrc(imgSrc);
    setIsCropped(true);
  };

  const getImageUploadInput = () => {
    let imageInput;
    if (selectedFile == null || isCropped) {
      let fileLabel =
        selectedFile == null
          ? "Choose a photo"
          : selectedFile.name;
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
                handleProfilePhotoInputOnChange(e.target.files)
              }
            />
            <label className="custom-file-label">{fileLabel}</label>
          </div>
        </div>
      );
    } else {
      imageInput = (
        <button className="btn btn-danger" onClick={handleCropBtnClick}>
          Crop
        </button>
      );
    }
    return imageInput;
  };

  const uploadProfilePhoto = () => {
    if (selectedFile) {
      let fileName = selectedFile.name;
      let photoFile = base64StringtoFile(imgSrc, fileName);

      let formData = new FormData();
      formData.append("file", photoFile);
      let userId = authContext.currentUser && authContext.currentUser.id;
      if (userId !== null) {
        setIsUploading(true);
        userService.updateUserProfilePhoto(formData, userId).then(resp => {
          authService.setLoggedInUserCookie(resp.data);
          window.location.reload();
        }).catch(e => {
          setIsUploading(false);
          const errorMessages: string[] = parseError(e);
          alertContext.show("Following errors prevents image from uploading", AlertVariant.DANGER, errorMessages, false)
        });
      }
    }
  };

  let imagePreview = (
      <FontAwesomeIcon icon="user" size="9x" color="rgb(104, 111, 122)" />
    );

    if (selectedFile !== null && !isCropped) {
      imagePreview = (
        <ReactCrop
          src={imgSrc}
          crop={crop}
          onChange={handleCropOnChange}
          onImageLoaded={handleCropOnImageLoaded}
        />
      );
    } else if (isCropped) {
      let imageUrl = imgSrc;
      imagePreview = <img src={imageUrl} alt="Preview" />;
    } else if (
    authContext.currentUser &&
      authContext.currentUser.imageUrl
    ) {
      let imageUrl = authContext.currentUser.imageUrl;
      imagePreview = <img src={imageUrl} alt="Preview" />;
    }
    return (
      <UserSettingContainer>
        <div className="user-profile-form-wrapper">
          {isUploading && <Spinner size="3x" />}
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
                {getImageUploadInput()}
              </div>
            </div>
          </div>
          <div className="user-profile-footer">
            <button
              className="btn btn-primary mt-2"
              onClick={uploadProfilePhoto}
            >
              Save
            </button>
          </div>
        </div>
      </UserSettingContainer>
    );
}

export default UserPhotoSetting;
