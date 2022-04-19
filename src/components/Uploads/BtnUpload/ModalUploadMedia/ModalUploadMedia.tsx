import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Modal from "../../../Modal";
import { acceptImages, acceptVideos } from "../../../../mimeTypes";
import { MediaType } from "../../../../interfaces";
import { ContextPermissions } from "../../../contexts";
import BtnUploadMedia from "./BtnUploadMedia";
import permissionsCheck from "../../../../utils/permissionsCheck";
import PERMISSIONS from "../../../../permissions";

const useStyles = makeStyles(() => ({
  boxButtons: {
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    margin: "25px 0px",
  },
  btnDivider: {
    padding: 10,
  },
}));

interface IModalUploadMedia {
  open?: boolean;
  onClose: () => void;
  onChoose: (f: File[], mediaType: MediaType) => void;
}

const ModalUploadMedia = ({
  open = false,
  onClose,
  onChoose,
}: IModalUploadMedia) => {
  const classes = useStyles({});
  const permissions = React.useContext(ContextPermissions);
  const cbOnChoose = React.useCallback(
    (files: File[], mediaType: MediaType) => {
      onChoose(files, mediaType);
      onClose();
    },
    [onChoose, onClose]
  );
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Upload Media"
      titleSub="What media type are you going to upload?"
      content={
        <div className={classes.boxButtons}>
          {permissionsCheck({
            keys: [PERMISSIONS.seecommerce_manage_shooting_media],
            permissions,
          }) ? (
            <>
              <BtnUploadMedia
                label="Shooting Image"
                type={MediaType.IMAGE_S}
                acceptFiles={acceptImages}
                onChoose={cbOnChoose}
              />
              <div className={classes.btnDivider} />
            </>
          ) : null}
          {permissionsCheck({
            keys: [PERMISSIONS.seecommerce_manage_post_production_media],
            permissions,
          }) ? (
            <>
              <BtnUploadMedia
                label="Post Production Image"
                type={MediaType.IMAGE_P}
                acceptFiles={acceptImages}
                onChoose={cbOnChoose}
              />
              <div className={classes.btnDivider} />
            </>
          ) : null}
          <BtnUploadMedia
            label="File Video"
            type={MediaType.VIDEO}
            acceptFiles={acceptVideos}
            onChoose={cbOnChoose}
          />
        </div>
      }
    />
  );
};

export default ModalUploadMedia;
