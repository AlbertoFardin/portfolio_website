import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import DialogContent from "@material-ui/core/DialogContent";
import Paper from "@material-ui/core/Paper";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import classnames from "classnames";
import Btn from "../../Btn";
import { FieldText } from "../../Field";
import * as Colors from "../../style/Colors";
import { IConferenceStart } from ".";
import {
  ZINDEX_CONFERENCE,
  ZINDEX_CONFERENCE_BACKDROP,
} from "../../utils/zIndex";

const padding = 20;
const useStyles = makeStyles({
  displayNone: {
    display: "none",
  },
  dialog: {
    position: "fixed",
    margin: "auto",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: 350,
    height: "fit-content",
    "z-index": ZINDEX_CONFERENCE,
  },
  backdrop: {
    "z-index": ZINDEX_CONFERENCE_BACKDROP,
  },
  modalHeader: {
    padding,
    "padding-bottom": 10,
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
  },
  modalContent: {
    padding,
    "padding-top": 10,
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
  },
  flexRow: {
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
  },
  button: {
    margin: "0 0 0 10px !important",
  },
});

const ConferenceStart = ({
  open,
  onClose,
  onCreate,
  onJoin,
  onResetJoinError,
  createError = "",
  createLoading = false,
  joinError = "",
  joinLoading = false,
}: IConferenceStart) => {
  const classes = useStyles();
  const [joinValue, setJoinValue] = React.useState("");
  const cbOnCreate = React.useCallback(() => onCreate("new"), [onCreate]);
  const cbOnJoin = React.useCallback((v = "") => onJoin(v || joinValue), [
    onJoin,
    joinValue,
  ]);
  const cbOnBtnJoin = React.useCallback(() => cbOnJoin(), [cbOnJoin]);
  const cbOnInputChange = React.useCallback(
    (value: string) => {
      onResetJoinError();
      setJoinValue(value);
    },
    [setJoinValue, onResetJoinError]
  );
  const cbOnInputKeyPress = React.useCallback(
    (key: string, value: string) => {
      if (key === "Enter") {
        setJoinValue(value);
        cbOnJoin(value);
      }
    },
    [cbOnJoin]
  );

  React.useEffect(() => {
    if (!open) setJoinValue("");
  }, [open]);

  return (
    <>
      <Paper
        elevation={3}
        className={classnames({
          [classes.dialog]: true,
          [classes.displayNone]: !open,
        })}
      >
        <div className={classes.modalHeader}>
          <Typography variant="h3" children="Join or Create a Web Conference" />
        </div>
        <DialogContent className={classes.modalContent}>
          <FieldText
            value={joinValue}
            label="To Join"
            placeholder="Type here web conference code"
            readOnly={joinLoading || createLoading}
            onChange={cbOnInputChange}
            onKeyPress={cbOnInputKeyPress}
          />
          <div className={classes.flexRow}>
            {createLoading || joinLoading ? (
              <>
                <div style={{ flex: 1 }} />
                <CircularProgress
                  style={{ color: Colors.Green, margin: 3 }}
                  size={20}
                  thickness={5}
                />
                <div style={{ flex: 1 }} />
              </>
            ) : (
              <>
                <Typography
                  style={{ color: Colors.Red }}
                  variant="caption"
                  children={createError || joinError}
                />
                <div style={{ flex: 1 }} />
                <Btn
                  disabled={!!joinValue}
                  className={classes.button}
                  color={Colors.Green}
                  label="CREATE"
                  onClick={cbOnCreate}
                />
                <Btn
                  disabled={!joinValue}
                  className={classes.button}
                  color={Colors.Green}
                  label="JOIN"
                  onClick={cbOnBtnJoin}
                  selected
                />
              </>
            )}
          </div>
        </DialogContent>
      </Paper>
      <Backdrop open={open} onClick={onClose} className={classes.backdrop} />
    </>
  );
};

export default ConferenceStart;
