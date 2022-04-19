import * as React from "react";
import * as Colors from "../../../componentsBase/style/Colors";
import Btn from "../../../componentsBase/Btn";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ICopyright } from "../../../interfaces";
import ActionBarLibrary from "../../../componentsBase/ActionsBar";
import { ACT_PANEL } from "./reducer";

const useStyles = makeStyles(({ zIndex }) => ({
  actionbar: {
    "border-top": "1px solid #e5e5e5",
    "background-color": Colors.Gray4,
    padding: "0 15px",
    "z-index": zIndex.drawer + 12,
  },
  labelLoading: {
    "font-style": "italic",
    "margin-left": 10,
  },
  flex1: {
    flex: 1,
  },
}));

interface IActionsBar {
  dispatchPanel: React.Dispatch<unknown>;
  dirtyCopyright: ICopyright;
  saveCopyright: boolean;
}

const ActionsBar = ({
  dispatchPanel,
  dirtyCopyright,
  saveCopyright,
}: IActionsBar) => {
  const classes = useStyles({});
  const dirtyCount = Object.keys(dirtyCopyright).length;

  const onSave = React.useCallback(() => {
    dispatchPanel({ type: ACT_PANEL.SAVE_COPYRIGHT_STARTED });
  }, [dispatchPanel]);
  const onCancel = React.useCallback(() => {
    dispatchPanel({ type: ACT_PANEL.DIALOG_UNSAVED });
  }, [dispatchPanel]);

  return (
    <ActionBarLibrary open={!!dirtyCount} className={classes.actionbar}>
      {saveCopyright ? (
        <>
          <CircularProgress size={20} />
          <Typography
            className={classes.labelLoading}
            variant="body1"
            children="loading..."
          />
        </>
      ) : (
        <>
          <Typography
            variant="body1"
            children={`${dirtyCount} value${dirtyCount > 1 ? "s" : ""} edited`}
          />
          <div className={classes.flex1} />
          <Btn variant="bold" label="CANCEL" onClick={onCancel} />
          <Btn
            variant="bold"
            label="SAVE"
            color={Colors.Green}
            onClick={onSave}
          />
        </>
      )}
    </ActionBarLibrary>
  );
};

export default ActionsBar;
