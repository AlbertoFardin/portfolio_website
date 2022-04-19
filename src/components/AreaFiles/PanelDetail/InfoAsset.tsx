import FieldText from "../../../componentsBase/Field/FieldText";
import * as React from "react";
import { TYPE_FOLDER, FIELD_WIDTH } from "../../../constants";
import * as MIMEType from "whatwg-mimetype";
import getFileIcon from "../getFileIcon";
import getUser from "../../../utils/getUser";
import { ContextM2ms, ContextUsers } from "../../contexts";
import { IFileDetail, IMediaInfo } from "../../../interfaces";
import makeStyles from "@material-ui/core/styles/makeStyles";
import formatHoursMinutes from "../../../utils/formatHoursMinutes";

const useStyles = makeStyles({
  field: {
    margin: "15px 10px",
    "vertical-align": "top",
    width: FIELD_WIDTH / 2,
  },
  avatar: {
    position: "relative",
    display: "inline-block",
    "vertical-align": "middle",
    "margin-right": 5,
    "background-color": "#ddd",
    height: 24,
    width: 24,
  },
});

interface IField {
  label: string;
  value: string;
  adornmentIcon?: string;
  adornmentAvatar?: string;
}

interface IInfoAsset {
  assetData: IFileDetail;
  mediaInfo: IMediaInfo;
  className?: string;
}

const InfoAsset = ({ assetData, mediaInfo, className }: IInfoAsset) => {
  const classes = useStyles({});
  const users = React.useContext(ContextUsers);
  const m2ms = React.useContext(ContextM2ms);

  const { name, mimeType, createdBy, createdOn } = assetData;
  const isFolder = mimeType === TYPE_FOLDER;
  const createdByUser = getUser(createdBy, { users, m2ms });
  const fields: IField[] = [
    {
      label: "Name",
      value: name,
    },
    {
      label: "Type",
      value: !mimeType
        ? "Unknown"
        : isFolder
        ? "Warda Folder"
        : new MIMEType(mimeType).type,
      adornmentIcon: getFileIcon(mimeType),
    },
    {
      label: "Created by",
      value: createdByUser.name,
      adornmentAvatar: createdByUser.picture,
    },
    {
      label: "Upload Date",
      value: formatHoursMinutes(createdOn),
    },
  ];

  if (!!mediaInfo) {
    fields.push({
      label: "Size",
      value: mediaInfo.filesize,
    });

    fields.push({
      label: "Dimensions",
      value: `${mediaInfo.geometry.width} x ${mediaInfo.geometry.height} px`,
    });
  }

  return (
    <div className={className}>
      {fields.map((f, i) => (
        <FieldText
          key={i}
          className={classes.field}
          readOnly
          label={f.label}
          value={f.value}
          adornmentIcon={f.adornmentIcon}
          adornmentAvatar={f.adornmentAvatar}
        />
      ))}
    </div>
  );
};

export default InfoAsset;
