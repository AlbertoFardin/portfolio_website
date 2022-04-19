import makeStyles from "@material-ui/core/styles/makeStyles";
import Divider from "@material-ui/core/Divider";
import * as React from "react";
import isEmpty from "lodash-es/isEmpty";
import { IProduct, Severity } from "../../../interfaces";
import { multiassignEntity } from "../../../api/fetchesApi";
import reducer, { reducerInitState, ACTION, ACTION_CLICKED } from "./reducer";
import Footer from "./Footer";
import SelectViews from "./SelectViews";
import SelectAssignees from "./SelectAssignees";
import getAssignmentsToSave from "./getAssignmentsToSave";
import { ContextSetSnackbar } from "../../contexts";
import Modal from "../../Modal";

const useStyles = makeStyles(() => ({
  dialogContent: {
    flex: 1,
    display: "flex",
    "flex-direction": "row",
    "align-items": "stretch",
  },
}));

interface IModalViewsAssign {
  open?: boolean;
  loading?: boolean;
  onClose: () => void;
  items: IProduct[];
}

const ModalViewsAssign = ({
  open,
  loading,
  onClose,
  items,
}: IModalViewsAssign) => {
  const setSnackbar = React.useContext(ContextSetSnackbar);
  const classes = useStyles({});
  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const { selectedAssigneesId, selectedViewsId, actionClicked, saving } = state;
  const onClickAssign = React.useCallback(() => {
    dispatch({ type: ACTION.CLICK_ASSIGN });
  }, []);
  const onClickUnassign = React.useCallback(() => {
    dispatch({ type: ACTION.CLICK_REMOVE });
  }, []);
  const onSelectAssignees = React.useCallback((selectedIds: string[]) => {
    dispatch({ type: ACTION.CHANGE_ASSIGNEES, selectedIds });
  }, []);
  const onSelectViews = React.useCallback((selectedIds: string[]) => {
    dispatch({ type: ACTION.CHANGE_VIEWS, selectedIds });
  }, []);
  const disabledAssign =
    isEmpty(selectedViewsId) || isEmpty(selectedAssigneesId);
  const disabledUnassign =
    isEmpty(selectedViewsId) || !isEmpty(selectedAssigneesId);
  const isActionClicked = actionClicked !== ACTION_CLICKED.NONE;

  // when close the modal, reset the reducer state
  React.useEffect(() => {
    if (!open && !isEmpty(items)) dispatch({ type: ACTION.RESET });
  }, [open, items]);

  // when clicked CONFIRM, fetch data
  React.useEffect(() => {
    (async () => {
      if (isActionClicked && !saving && !isEmpty(items)) {
        dispatch({ type: ACTION.SAVING });
        try {
          await multiassignEntity(
            getAssignmentsToSave({
              actionClicked,
              selectedAssigneesId,
              selectedViewsId,
              items,
            })
          );
          setSnackbar(
            Severity.SUCCESS,
            `Views will be ${
              actionClicked === ACTION_CLICKED.REMOVE ? "un" : ""
            }assigned soon`
          );
        } catch (err) {
          console.warn("ModalMassiveMediaReady: ", err);
          setSnackbar(
            Severity.WARNING,
            "Unable to assign views, please refresh and retry"
          );
        }
        dispatch({ type: ACTION.SAVE_STOP });
        onClose();
      }
    })();
  }, [
    isActionClicked,
    items,
    onClose,
    actionClicked,
    saving,
    selectedAssigneesId,
    selectedViewsId,
    setSnackbar,
  ]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      loading={isEmpty(items) || loading || isActionClicked || saving}
      title="Assign views"
      content={
        <>
          <div className={classes.dialogContent}>
            <SelectViews
              items={items}
              selectedIds={selectedViewsId}
              onChange={onSelectViews}
            />
            <div style={{ margin: 10 }} />
            <SelectAssignees
              selectedIds={selectedAssigneesId}
              onChange={onSelectAssignees}
            />
          </div>
          <Divider />
        </>
      }
      actions={
        <Footer
          disabledAssign={disabledAssign}
          disabledUnassign={disabledUnassign}
          onAssign={onClickAssign}
          onUnassign={onClickUnassign}
          onCancel={onClose}
        />
      }
    />
  );
};

export default ModalViewsAssign;
