import * as React from "react";
import { FileSection } from "../../../../interfaces";
import Btn from "../../../../componentsBase/Btn";
import { useHistory } from "react-router-dom";
import { AREA_FILES, TYPE_FOLDER } from "../../../../constants";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
  btnfile: {
    "align-self": "baseline",
    "min-height": 22,
    "max-width": 160,
    "margin-top": 6,
  },
  btnfileIcon: {
    "font-size": "12px !important",
    "margin-left": 5,
  },
  btnfileLabel: {
    "font-weight": 300,
  },
});

interface IBtnFile {
  id: string;
  name: string;
  mimeType: string;
}

const BtnFile = ({ id, name, mimeType }: IBtnFile) => {
  const classes = useStyles({});
  const isFolder = mimeType === TYPE_FOLDER;
  const history = useHistory();
  const onClick = React.useCallback(() => {
    if (isFolder) {
      history.push(`/${AREA_FILES}/${id}`);
    } else {
      history.push(`/${AREA_FILES}/${FileSection.SHARES_PRIVATE}`);
    }
  }, [history, id, isFolder]);
  return (
    <Btn
      className={classes.btnfile}
      variant="bold"
      icon={isFolder ? "folder" : "insert_drive_file"}
      iconClassName={classes.btnfileIcon}
      label={name}
      labelClassName={classes.btnfileLabel}
      onClick={onClick}
    />
  );
};

export default BtnFile;
