import React, { useState, FormEvent, useContext, useEffect } from "react";
import AdminControl from "../AdminControl";
import {
  IYoutubeCredentialUpdateRequest,
  IYoutubeCredentials,
  AlertVariant
} from "../../../settings/DataTypes";
import YoutubeService from "../../../services/YoutubeService";
import { AlertContext } from "../../../contexts/AlertContext";
import { parseError } from "../../../utils/errorParser";
import Alert from "../../../components/flash/Alert";

const Youtube: React.FunctionComponent = () => {
  // context
  const alertContext = useContext(AlertContext);
  // states
  const [credential, setCredential] = useState<IYoutubeCredentials | null>(
    null
  );
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [refreshToken, setRefrestToken] = useState<string>("");
  const [accessToken, setAccessToken] = useState<string>("");
  const [expiresInSeconds, setExpiresInSeconds] = useState<number>(0);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  // api service
  const youtubeService = new YoutubeService();

  useEffect(() => {
    youtubeService
      .getCredentials()
      .then(resp => {
        setCredential(resp.data);
      })
      .catch(err => {
        alertContext.show(parseError(err).join(", "), AlertVariant.DANGER);
      });
    // eslint-disable-next-line
  }, []);
  // methods
  const resetForm = () => {
    setShowUpdateForm(false);
    setAccessToken("");
    setRefrestToken("");
    setExpiresInSeconds(0);
    setFormErrors([]);
  };
  const handleFromSubmit = (e: FormEvent) => {
    e.preventDefault();
    const formData: IYoutubeCredentialUpdateRequest = {
      refreshToken: refreshToken,
      accessToken: accessToken,
      expiresInSeconds: expiresInSeconds
    };
    youtubeService
      .updateCredentials(formData)
      .then(resp => {
        setCredential(resp.data);
        resetForm();
      })
      .catch(err => {
        setFormErrors(parseError(err));
      });
  };

  const flashErrors = formErrors.length ? (
    <Alert variant={AlertVariant.DANGER} errors={formErrors} />
  ) : null;
  const getUpdateForm = () => {
    if (showUpdateForm) {
      return (
        <div className="border mt-3 p-3">
          <h4> Update Youtube Credentials</h4>
          <form onSubmit={handleFromSubmit}>
            {flashErrors}
            <div className="form-group">
              <label>Access Token</label>
              <input
                className="form-control"
                type="text"
                value={accessToken}
                onChange={e => setAccessToken(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Refresh Token</label>
              <input
                className="form-control"
                type="text"
                value={refreshToken}
                onChange={e => setRefrestToken(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Expires In</label>
              <input
                className="form-control"
                type="number"
                value={expiresInSeconds}
                onChange={e => setExpiresInSeconds(parseInt(e.target.value))}
              />
            </div>
            <div className="action-btn-group form-group">
              <button
                type="button"
                className="btn btn-danger action-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary action-btn">
                Save
              </button>
            </div>
          </form>
        </div>
      );
    }
    return null;
  };

  const updateButton = showUpdateForm ? null : (
    <div className="action-btn-group mt-2">
      <button
        className="btn btn-primary action-btn"
        onClick={() => setShowUpdateForm(true)}
      >
        Update
      </button>
    </div>
  );
  return (
    <AdminControl>
      <div>
        <h5>Youtube Credentials</h5>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Refresh Token</th>
                <th>Access Token</th>
                <th>Expires In</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{credential && credential.refreshToken}</td>
                <td>{credential && credential.accessToken}</td>
                <td>{credential && credential.expiresInSeconds}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {updateButton}
        {getUpdateForm()}
      </div>
    </AdminControl>
  );
};
export default Youtube;
