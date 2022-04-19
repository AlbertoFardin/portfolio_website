import MUIToolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import IFileStatus from "../IFileStatus";
import makeStyles from "@material-ui/core/styles/makeStyles";
import IUploadFile from "../IUploadFile";
import * as Colors from "../../../componentsBase/style/Colors";
import classnames from "classnames";
import Btn from "../../../componentsBase/Btn";

const useStyles = makeStyles({
  toolbar: {
    "background-color": Colors.Gray4,
    padding: "0px 18px",
  },
  toolbarLabel: {
    margin: "0 10px",
    flex: 1,
  },
  toolbarButton: {
    margin: "0 !important",
  },
});

interface IToolbar {
  className?: string;
  expanded: boolean;
  files: IUploadFile[];
  i18n: {
    filesUploaded: string;
    filesProcessed: string;
  };
  onClose: () => void;
  onExpand: () => void;
}

const Toolbar = ({
  className,
  expanded,
  files,
  i18n,
  onClose,
  onExpand,
}: IToolbar) => {
  const classes = useStyles({});
  const fileProcessed = files.reduce((acc, cur) => {
    const completedSet = new Set([
      IFileStatus.Completed,
      IFileStatus.Abort,
      IFileStatus.Error,
    ]);
    if (completedSet.has(cur.status)) acc += 1;
    return acc;
  }, 0);
  const fileCompleted = files.reduce((acc, cur) => {
    if (new Set([IFileStatus.Completed]).has(cur.status)) acc += 1;
    return acc;
  }, 0);
  const allFileProcessed = fileProcessed === files.length;
  const textAllProcessed = `${fileCompleted} ${i18n.filesUploaded}`;
  const textNotProcessed = `${fileProcessed}/${files.length} ${i18n.filesProcessed}`;
  return (
    <MUIToolbar className={classnames([className, classes.toolbar])}>
      <Btn
        className={classes.toolbarButton}
        onClick={onExpand}
        icon={expanded ? "expand_more" : "expand_less"}
      />
      <Typography
        className={classes.toolbarLabel}
        variant="body1"
        noWrap
        children={allFileProcessed ? textAllProcessed : textNotProcessed}
      />
      <Btn className={classes.toolbarButton} onClick={onClose} icon="close" />
    </MUIToolbar>
  );
};

export default Toolbar;
