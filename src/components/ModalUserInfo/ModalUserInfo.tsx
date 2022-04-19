import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Modal from "../Modal";
import Label from "./Label";
import getUser from "../../utils/getUser";
import {
  ContextCurrentUser,
  ContextDispatchMain,
  ContextM2ms,
  ContextUsers,
} from "../contexts";
import { ACTION_MAIN } from "../reducer";
import { emptyFn } from "../../componentsBase/utils/common";
import Btn from "../../componentsBase/Btn";
import S3Upload from "../Uploads/utils/S3Upload";
import endpoints from "../../api/endpoints";
import { signUrl } from "../../api/fetchesApi";
import LinearProgress from "@material-ui/core/LinearProgress";
import Fade from "@material-ui/core/Fade";
import Preview from "../../componentsBase/Preview/Preview";
import { PreviewType } from "../../componentsBase/Preview";
import Tooltip from "../../componentsBase/Tooltip";
import { fetchCookieJwtWithRefreshToken } from "../../api/fetchCookieJwt";
import { Service } from "../../interfaces";

const useStyles = makeStyles({
  content: {
    display: "flex",
    "flex-direction": "row",
  },
  contentColumn: {
    display: "flex",
    "flex-direction": "column",
    "align-items": "center",
  },
  flex1: {
    flex: 1,
  },
  avatar: {
    width: 120,
    height: 120,
    margin: "10px 5px",
  },
  buttonWidth: {
    width: 140,
    margin: "5px 0",
  },
});

interface IModalUser {
  open: boolean;
}

const ModalUserInfo = ({ open }: IModalUser) => {
  const classes = useStyles({});

  const S3UploadRef = React.useRef(null);
  const userProfile = React.useContext(ContextCurrentUser);
  const dispatchMain = React.useContext(ContextDispatchMain);
  const users = React.useContext(ContextUsers);
  const m2ms = React.useContext(ContextM2ms);

  const userId = userProfile.id;
  const email = userProfile.email;
  const { picture, firstName, lastName, roles } = getUser(userId, {
    users,
    m2ms,
  });

  const [file, setFile] = React.useState(null as File);
  const [progress, setProgress] = React.useState(0);
  const [removePhoto, setRemovePhoto] = React.useState(false);
  const [picturePreview, setPicturePreview] = React.useState(picture);
  const [errorOnPreview, setErrorOnPreview] = React.useState(false);

  const uploadInProgress = progress !== 0 && progress !== 100;

  const onClose = React.useCallback(() => {
    if (progress === 0 || progress === 100) {
      dispatchMain({ type: ACTION_MAIN.INFO_USER });
    }
  }, [dispatchMain, progress]);
  const onFinishS3Put = React.useCallback(async ({ fileId }) => {
    await fetchCookieJwtWithRefreshToken({
      url: endpoints.profilePictureConfirm.url(fileId),
      method: endpoints.profilePictureConfirm.method,
    });

    await fetchCookieJwtWithRefreshToken({
      url: endpoints.putUserProfile.url(),
      method: endpoints.putUserProfile.method,
      jsonBody: {
        picture: endpoints.getRendition.url(fileId, Service.SEECOMMERCE, "s"),
      },
    });

    setFile(null);
  }, []);
  const getSignedUrl = React.useCallback(
    async (item, callback) => {
      if (file) {
        const { name, type } = file;
        const { url, method } = endpoints.profilePictureUpload;
        const res = await signUrl({
          url: url(),
          method,
          name,
          type,
        });
        callback(res);
      }
    },
    [file]
  );
  const onProgress = React.useCallback((a) => {
    setProgress(a);
  }, []);
  const onReplacePhoto = React.useCallback((event) => {
    setFile(event.target.files[0]);
  }, []);
  const onRemovePhoto = React.useCallback(() => {
    setRemovePhoto(true);
  }, []);
  const onLoadError = React.useCallback(() => {
    setErrorOnPreview(true);
  }, []);
  const onLoadSuccess = React.useCallback(() => {
    setErrorOnPreview(false);
  }, []);
  const onClickRefresh = React.useCallback(() => {
    if (errorOnPreview) {
      setPicturePreview(picture + `?time=${new Date().getTime()}`);
    }
  }, [errorOnPreview, picture]);

  React.useEffect(() => {
    (async () => {
      if (removePhoto) {
        const { url, method } = endpoints.putUserProfile;
        setRemovePhoto(false);
        await fetchCookieJwtWithRefreshToken({
          url: url(),
          method,
          jsonBody: { picture: "" },
        });
      }
    })();
  }, [removePhoto]);

  React.useEffect(() => {
    if (file) {
      S3UploadRef.current = new S3Upload({
        file,
        mimeType: file.type,
        getSignedUrl,
        server: undefined,
        onFinishS3Put,
        onProgress,
        onError: emptyFn,
        onAbort: emptyFn,
        signingUrlMethod: "GET",
        uploadRequestHeaders: {},
        contentDisposition: "auto",
      });
    }
  }, [file, getSignedUrl, onFinishS3Put, onProgress]);

  React.useEffect(() => {
    setPicturePreview(picture);
  }, [picture]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="My Profile"
      content={
        <div className={classes.content}>
          <div className={classes.flex1}>
            <div className={classes.contentColumn}>
              <Tooltip
                title={
                  errorOnPreview ? "Please refresh to view the new avatar" : ""
                }
              >
                <div>
                  <Preview
                    className={classes.avatar}
                    srcUrl={picturePreview}
                    placeholderIcon={"refresh"}
                    onClick={onClickRefresh}
                    style={{
                      width: 120,
                      height: 120,
                    }}
                    onLoadError={onLoadError}
                    onLoadSuccess={onLoadSuccess}
                    srcType={PreviewType.IMAGE}
                  />
                </div>
              </Tooltip>
              <div style={{ width: "80%" }}>
                <Fade in={uploadInProgress}>
                  <LinearProgress variant="determinate" value={progress} />
                </Fade>
              </div>

              <Btn
                icon="upload"
                label="REPLACE PHOTO"
                disabled={uploadInProgress}
                variant="bold"
                upload={{
                  onChangeInput: onReplacePhoto,
                  multiple: false,
                }}
                className={classes.buttonWidth}
              />

              <Btn
                icon="delete"
                label="REMOVE PHOTO"
                disabled={uploadInProgress}
                variant="bold"
                iconStyle={{ color: "red" }}
                onClick={onRemovePhoto}
                className={classes.buttonWidth}
              />
            </div>
          </div>
          <div className={classes.flex1}>
            <Label title="First name" value={firstName} />
            <Label title="Last name" value={lastName} />
            <Label title="Email" value={email} />
            <Label title="Roles" value={roles.map((r) => r.label).join(", ")} />
          </div>
        </div>
      }
      actions={<></>}
    />
  );
};

export default ModalUserInfo;
