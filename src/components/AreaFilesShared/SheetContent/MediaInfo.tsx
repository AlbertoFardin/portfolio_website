import * as React from "react";
import FieldText from "../../../componentsBase/Field/FieldText";
import { IFileDetail } from "../../../interfaces";
import { TYPE_FOLDER } from "../../../constants";
import * as MIMEType from "whatwg-mimetype";
import getFileIcon from "../../AreaFiles/getFileIcon";
import makeStyles from "@material-ui/core/styles/makeStyles";
import getUser from "../../../utils/getUser";
import { ContextM2ms, ContextUsers } from "../../contexts";
import formatHoursMinutes from "../../../utils/formatHoursMinutes";

interface IStyles {
  fullscreen: boolean;
}
const useStyles = makeStyles({
  mediainfo: {
    flex: 1,
    display: "flex",
    "flex-direction": "column",
    margin: ({ fullscreen }: IStyles) =>
      fullscreen ? "10px 5px" : "10px 20px",
  },
  field: {
    margin: "30px 0 0",
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

interface IPanel {
  assetData: IFileDetail;
  fullscreen: boolean;
}

const Panel = ({ assetData, fullscreen }: IPanel) => {
  const classes = useStyles({ fullscreen });

  const users = React.useContext(ContextUsers);
  const m2ms = React.useContext(ContextM2ms);

  const { name, mimeType, createdBy, createdOn } = assetData;
  const isFolder = mimeType === TYPE_FOLDER;
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
  ];

  if (createdBy) {
    const user = getUser(createdBy, { users, m2ms });
    const { name, picture } = user;
    fields.push({
      label: "Created by",
      value: name,
      adornmentAvatar: picture,
    });
  }

  if (createdOn) {
    fields.push({
      label: "Upload Date",
      value: formatHoursMinutes(createdOn),
    });
  }

  return (
    <div className={classes.mediainfo}>
      {fields.map((f, i) => (
        <FieldText key={i} readOnly {...f} className={classes.field} />
      ))}
    </div>
  );
};

export default Panel;
