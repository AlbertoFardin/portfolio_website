import * as React from "react";
import * as Colors from "../../../../componentsBase/style/Colors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Btn from "../../../../componentsBase/Btn";
import { ACT_DETAIL } from "../reducer";
import { ContextDispatchDetail } from "../../contexts";
import ActionsbarLink from "./ActionsbartLink";
import Paper from "@material-ui/core/Paper";
import Grow from "@material-ui/core/Grow";

interface IStyles {
  fullscreen: boolean;
}
const useStyles = makeStyles(({ zIndex }) => ({
  actionbar: {
    position: "absolute",
    bottom: 10,
    left: 10,
    "z-index": zIndex.drawer + 10,
    "border-radius": 5,
    padding: 5,
    "background-color": Colors.Gray3,
    width: ({ fullscreen }: IStyles) => (fullscreen ? 190 : 390),
    display: ({ fullscreen }: IStyles) => (fullscreen ? "block" : "flex"),
    "flex-direction": "row",
    "align-items": "center",
  },
  group: {
    padding: ({ fullscreen }: IStyles) => (fullscreen ? "2px 0" : 0),
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
  },
  flex1: {
    flex: 1,
  },
}));

interface IActionsbar {
  fullscreen: boolean;
  assetdataDirty;
  editingConflict: boolean;
  editingSaveRequest: boolean;
}

const Actionsbar = ({
  fullscreen,
  assetdataDirty,
  editingConflict,
  editingSaveRequest,
}: IActionsbar) => {
  const classes = useStyles({ fullscreen });
  const dispatchDetail = React.useContext(ContextDispatchDetail);
  const dirties = Object.keys(assetdataDirty).length;
  const open = !editingSaveRequest && !!dirties;

  const onSave = React.useCallback(() => {
    dispatchDetail({ type: ACT_DETAIL.EDITING_SAVE_STARTED });
  }, [dispatchDetail]);
  const onCancel = React.useCallback(() => {
    if (editingConflict) {
      dispatchDetail({ type: ACT_DETAIL.EDITING_DISCARDED });
    } else {
      dispatchDetail({ type: ACT_DETAIL.SHOW_DIALOG_UNSAVED, value: true });
    }
  }, [editingConflict, dispatchDetail]);
  const onDiscard = React.useCallback(() => {
    dispatchDetail({ type: ACT_DETAIL.EDITING_DISCARDED });
  }, [dispatchDetail]);

  return (
    <Grow in={open}>
      <Paper className={classes.actionbar} elevation={5}>
        <div className={classes.group}>
          {editingConflict ? (
            <Btn
              emoji="⚠️"
              tooltip="A data conflict occurred, is unable to save your pending changes, we suggest to save your data changes elsewhere"
            />
          ) : (
            <Btn emoji="🗂️" tooltip="You have unsaved pending changes" />
          )}
          <ActionsbarLink assetdataDirty={assetdataDirty} />
        </div>
        <div className={classes.flex1} />
        <div className={classes.group}>
          <div className={classes.flex1} />
          {editingConflict ? (
            <Btn
              variant="bold"
              color={Colors.Red}
              label="DISCARD"
              onClick={onDiscard}
            />
          ) : (
            <>
              <Btn variant="bold" label="DISCARD" onClick={onCancel} />
              <Btn
                variant="bold"
                label="SAVE"
                color={Colors.Green}
                disabled={editingConflict}
                onClick={onSave}
              />
            </>
          )}
        </div>
      </Paper>
    </Grow>
  );
};

export default Actionsbar;
