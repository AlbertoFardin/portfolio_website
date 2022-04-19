import * as React from "react";
import * as MIMEType from "whatwg-mimetype";
import * as moment from "moment";
import FieldText from "../../../../componentsBase/Field/FieldText";
import { TYPE_FOLDER, DATE_FORMAT, FIELD_WIDTH } from "../../../../constants";
import getFileIcon from "../../getFileIcon";
import getUser from "../../../../utils/getUser";
import { ContextM2ms, ContextUsers } from "../../../contexts";
import { IFileDetail, IMediaInfo } from "../../../../interfaces";
import makeStyles from "@material-ui/core/styles/makeStyles";
import TagSelector from "../../TagSelector";

const useStyles = makeStyles({
  fieldFull: {
    display: "block",
    margin: "15px auto",
    width: FIELD_WIDTH,
  },
  mini: {
    display: "block",
    margin: "0 auto",
    width: FIELD_WIDTH,
  },
  miniField: {
    margin: "15px 0",
    width: FIELD_WIDTH / 2 - 10,
  },
  miniDivider: {
    display: "inline-block",
    width: 20,
  },
});

interface IInfoGeneral {
  onChangeTag: (items: IFileDetail[]) => void;
  assetData: IFileDetail;
  mediaData: IMediaInfo;
}

const InfoGeneral = ({ assetData, mediaData, onChangeTag }: IInfoGeneral) => {
  const classes = useStyles({});
  const users = React.useContext(ContextUsers);
  const m2ms = React.useContext(ContextM2ms);
  const { name, mimeType, createdBy, createdOn } = assetData;
  const createdByUser = getUser(createdBy, { users, m2ms });

  return (
    <>
      <FieldText
        className={classes.fieldFull}
        readOnly
        label="Name"
        value={name}
        adornmentIcon={getFileIcon(mimeType)}
        adornmentIconTooltip={
          !mimeType
            ? "Unknown type"
            : mimeType === TYPE_FOLDER
            ? "Warda Folder"
            : new MIMEType(mimeType).type
        }
      />
      <div className={classes.mini}>
        <FieldText
          readOnly
          className={classes.miniField}
          label="Created by"
          value={createdByUser.name}
          adornmentAvatar={createdByUser.picture}
        />
        <div className={classes.miniDivider} />
        <FieldText
          readOnly
          className={classes.miniField}
          label="Upload Date"
          value={moment(createdOn).format(`${DATE_FORMAT} HH:mm`)}
        />
        <br />
        <FieldText
          readOnly
          className={classes.miniField}
          label="Size"
          value={!mediaData ? "" : mediaData.filesize}
        />
        <div className={classes.miniDivider} />
        <FieldText
          readOnly
          className={classes.miniField}
          label="Dimensions"
          value={
            !mediaData
              ? ""
              : `${mediaData.geometry.width} x ${mediaData.geometry.height} px`
          }
        />
      </div>
      <TagSelector
        className={classes.fieldFull}
        files={[assetData]}
        label="Tags"
        onChange={onChangeTag}
      />
    </>
  );
};

export default InfoGeneral;
