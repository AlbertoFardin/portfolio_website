import ButtonBase from "@material-ui/core/ButtonBase";
import makeStyles from "@material-ui/core/styles/makeStyles";
import InputFile from "../../../../componentsBase/InputFile";
import PaperFold from "../../../../componentsBase/PaperFold";
import Placeholder from "../../../../componentsBase/Placeholder";
import * as React from "react";
import { emptyFn } from "../../../../componentsBase/utils/common";
import { colorTheme } from "../../../../constants";
import { MediaType } from "../../../../interfaces";
import getMediaTypeIcon from "../../../../utils/getMediaTypeIcon";

const useStyles = makeStyles(() => ({
  btnUpload: {
    width: 143,
    border: "1px dashed #ccc",
    "border-radius": 13,
    height: 143,
    "background-color": "#f1f1f1",
    position: "relative",
    margin: 0,
    cursor: "pointer",
    "& *": {
      cursor: "pointer",
    },
  },
  btnUploadIcon: {
    "font-size": "25px !important",
    margin: 5,
    color: `${colorTheme} !important`,
  },
  btnUploadLabel: {
    "font-weight": 500,
  },
}));

interface IBtnUploadMedia {
  label: string;
  type: MediaType;
  acceptFiles: string;
  onChoose: (files: File[], mediaType: MediaType) => void;
}

const BtnUploadMedia = ({
  label,
  type,
  acceptFiles,
  onChoose,
}: IBtnUploadMedia) => {
  const classes = useStyles({});
  const cbOnChange = React.useCallback(
    (event) => {
      const uploadFiles = [];
      for (const file of event.target.files) {
        uploadFiles.push(file);
      }
      onChoose(uploadFiles, type);
    },
    [type, onChoose]
  );
  return (
    <ButtonBase className={classes.btnUpload}>
      <Placeholder
        icon={getMediaTypeIcon(type)}
        iconClassName={classes.btnUploadIcon}
        label={label}
        labelClassName={classes.btnUploadLabel}
      />
      <PaperFold
        open={type === MediaType.IMAGE_S}
        anchorHorizontal="right"
        anchorVertical="bottom"
      />
      <InputFile
        acceptFiles={acceptFiles}
        setHover={emptyFn}
        onChangeInput={cbOnChange}
        multiple
      />
    </ButtonBase>
  );
};

export default BtnUploadMedia;
