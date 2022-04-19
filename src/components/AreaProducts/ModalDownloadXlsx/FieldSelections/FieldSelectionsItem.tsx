import * as React from "react";
import * as Colors from "../../../../componentsBase/style/Colors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Zoom from "@material-ui/core/Zoom";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import { ISelection } from "../reducer";
import Btn from "../../../../componentsBase/Btn";
import LinkSummary from "../LinkSummary";
import reducer, { reducerInitState, ACT_ITEM } from "./reducer";
import classnames from "classnames";

const useStyles = makeStyles(({ typography }) => ({
  listitem: {
    padding: "5px 15px 5px 5px",
    "align-items": "center",
  },
  listitemLabel: {
    "max-width": 300,
    "white-space": "nowrap",
    "text-overflow": "ellipsis",
    overflow: "hidden",
  },
  listitemCount: {
    "margin-right": 10,
  },
  flex1: {
    flex: 1,
  },
  listitemInModify: {
    "z-index": 10,
    background: "#fff",
    "box-shadow": `0 0 10px 0 ${Colors.Purple}`,
  },
  input: {
    padding: 0,
    border: 0,
    outline: "none",
    flex: 1,
    ...typography.body1,
  },
}));

interface IFieldSelectionsItem extends ISelection {
  onRename: (id: string, label: string) => void;
  onRemove: (id: string) => void;
  onSelect: (id: string) => void;
  setBackdrop: (b: boolean) => void;
}

const FieldSelectionsItem = ({
  id,
  label,
  items,
  onRename,
  onRemove,
  onSelect,
  setBackdrop,
}: IFieldSelectionsItem) => {
  const classes = useStyles({});
  const [stateItem, dispatchItem] = React.useReducer(reducer, reducerInitState);
  const { hover, labelInModify, labelNewValue } = stateItem;

  const onRemoveCb = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      onRemove(id);
    },
    [id, onRemove]
  );
  const onLabelModifyStart = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      dispatchItem({ type: ACT_ITEM.LABEL_EDIT_STARTED, value: true });
      setBackdrop(true);
    },
    [setBackdrop]
  );
  const onLabelModifyConfirm = React.useCallback(() => {
    dispatchItem({ type: ACT_ITEM.LABEL_EDIT_STOPPED, value: false });
    setBackdrop(false);
    if (label !== labelNewValue) {
      onRename(id, labelNewValue);
    }
  }, [id, label, labelNewValue, onRename, setBackdrop]);
  const onLabelModifyCancel = React.useCallback(() => {
    dispatchItem({ type: ACT_ITEM.LABEL_EDIT_STOPPED, value: false });
    setBackdrop(false);
  }, [setBackdrop]);
  const onLabelKeyPress = React.useCallback(
    (event) => {
      if (event.key === "Enter") onLabelModifyConfirm();
    },
    [onLabelModifyConfirm]
  );
  const onLabelChange = React.useCallback((event) => {
    const value = event.target.value;
    dispatchItem({ type: ACT_ITEM.LABEL_CHANGE, value });
  }, []);
  const onSelectCb = React.useCallback(() => {
    onSelect(id);
  }, [id, onSelect]);
  const onMouseEnter = React.useCallback(() => {
    dispatchItem({ type: ACT_ITEM.HOVER, value: true });
  }, []);
  const onMouseLeave = React.useCallback(() => {
    dispatchItem({ type: ACT_ITEM.HOVER, value: false });
  }, []);

  return labelInModify ? (
    <ListItem
      className={classnames([classes.listitem, classes.listitemInModify])}
    >
      <Btn icon="edit" disabled />
      <input
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        className={classes.input}
        onChange={onLabelChange}
        onKeyPress={onLabelKeyPress}
        defaultValue={label}
        placeholder="Write a new label for this selection"
      />
      <Btn
        tooltip="Cancel changes to the label"
        icon="close"
        onClick={onLabelModifyCancel}
      />
      <Btn
        tooltip="Confirm new label inputted"
        icon="check"
        onClick={onLabelModifyConfirm}
      />
    </ListItem>
  ) : (
    <ListItem
      button
      className={classes.listitem}
      onClick={onSelectCb}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Zoom in={hover}>
        <Btn
          tooltip="Edit selection's label"
          icon="edit"
          onClick={onLabelModifyStart}
        />
      </Zoom>
      <Typography
        variant="body1"
        className={classes.listitemLabel}
        children={label}
      />
      <div className={classes.flex1} />
      <Typography
        variant="body1"
        className={classes.listitemCount}
        children={
          <LinkSummary
            attributesSelected={items}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            onMenuClose={onMouseLeave}
          />
        }
      />
      <Zoom in={hover}>
        <Btn
          color={Colors.Red}
          tooltip="Delete this selection"
          icon="delete"
          menu={{
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left",
            },
            onClose: onMouseLeave,
            title: "Remove this selection?",
            items: [
              {
                id: "removeNo",
                label: "Cancel",
                onClick: onMouseLeave,
              },
              {
                id: "removeYes",
                label: "Remove",
                onClick: onRemoveCb,
              },
            ],
          }}
        />
      </Zoom>
    </ListItem>
  );
};

export default FieldSelectionsItem;
