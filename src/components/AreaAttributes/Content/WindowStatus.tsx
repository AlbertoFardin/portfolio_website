import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Paper from "@material-ui/core/Paper";
import * as Colors from "../../../componentsBase/style/Colors";
import Btn from "../../../componentsBase/Btn";
import Modal from "../../Modal";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ACT_VPORT } from "../reducer";
import { IAttribute } from "../../../interfaces";
import { ContextDispatchViewport } from "../contexts";
import hasRequired from "../hasRequired";

const useStyles = makeStyles(({ zIndex }) => ({
  windowstatus: {
    position: "absolute",
    width: "fit-content",
    height: "fit-content",
    "z-index": zIndex.drawer,
    bottom: "-18px",
    left: 0,
    right: 0,
    margin: "auto",
    padding: "4px 3px",
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    "border-radius": 100,
    "background-color": Colors.Gray3,
  },
  spinner: {
    margin: "0 10px 0 12px",
  },
  icon: {
    color: Colors.Orange,
    "font-size": "22px !important",
    margin: "0 8px 0 10px",
  },
  label: {
    "margin-right": 10,
  },
  flex1: {
    flex: 1,
  },
}));

interface IWindowStatus {
  items: IAttribute[];
  conflicts: boolean;
  loading: boolean;
}

const WindowStatus = ({ items, conflicts, loading }: IWindowStatus) => {
  const classes = useStyles({});
  const dispatchViewport = React.useContext(ContextDispatchViewport);

  const [confirm, setConfirm] = React.useState(false);

  const edited = items.filter(({ isEdited, isDraft }) => isEdited || isDraft);

  const onConfirmOpen = React.useCallback(() => setConfirm(true), []);
  const onConfirmClose = React.useCallback(() => setConfirm(false), []);
  const onResetAttributes = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.ITEMS_RESET });
  }, [dispatchViewport]);
  const onSave = React.useCallback(() => {
    alert("--- feature in development ---");
    setConfirm(false);
  }, []);
  const disabledSave = !!items.find((a) => !hasRequired(a));

  if (!edited.length && !conflicts) return null;

  return (
    <>
      <Paper className={classes.windowstatus} elevation={5}>
        {loading ? (
          <CircularProgress className={classes.spinner} size={18} />
        ) : (
          <Icon className={classes.icon} children="warning" />
        )}

        <Typography
          className={classes.label}
          variant="body2"
          children={`${edited.length} item${
            edited.length > 1 ? "s" : ""
          } to be saved`}
        />
        <div className={classes.flex1} />
        {conflicts ? null : (
          <Btn
            variant={"bold"}
            color={Colors.Green}
            label="SAVE"
            tooltip={
              disabledSave
                ? "Please, check all required fields"
                : "Save all changes"
            }
            onClick={onConfirmOpen}
            disabled={loading || disabledSave}
          />
        )}
        <Btn
          variant={"bold"}
          color={Colors.Red}
          label="DISCARD"
          tooltip={
            conflicts
              ? "There are some conflicts, need a reset"
              : "Reset all changes"
          }
          disabled={loading}
          onClick={onResetAttributes}
        />
      </Paper>
      <Modal
        open={confirm}
        onClose={onConfirmClose}
        title="Save all changes"
        content={
          <>
            <Typography
              variant="body1"
              children="This operation will trigger system reindex and it will takes some time."
            />
            <Typography
              variant="body1"
              children="Are you sure you want to continue?"
            />
          </>
        }
        actions={
          <>
            <div style={{ flex: 1 }} />
            <Btn variant="bold" label="CANCEL" onClick={onConfirmClose} />
            <Btn
              variant="bold"
              color={Colors.Green}
              label="CONTINUE"
              onClick={onSave}
            />
          </>
        }
      />
    </>
  );
};

export default WindowStatus;
