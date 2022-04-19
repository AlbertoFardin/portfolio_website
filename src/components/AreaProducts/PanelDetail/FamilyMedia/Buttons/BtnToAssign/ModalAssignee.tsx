import * as React from "react";
import * as Colors from "../../../../../../componentsBase/style/Colors";
import Popover from "@material-ui/core/Popover";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { ContextSetSnackbar } from "../../../../../contexts";
import FieldSearch from "../../../../../FieldSearch";
import {
  IProduct,
  IAssignmentContentType,
  Severity,
} from "../../../../../../interfaces";
import { colorTheme } from "../../../../../../constants";
import AssigneesList from "./AssigneesList";
import reducer, { ACTION, reducerInitState } from "./reducer";
import getAssignments from "./getAssignments";
import LoadingMask from "../../../../../../componentsBase/LoadingMask";
import Btn from "../../../../../../componentsBase/Btn";
import { assignEntity } from "../../../../../../api/fetchesApi";
import { genericErrorText } from "../../../../../../utils/manageFetchErrors";

const useStyles = makeStyles({
  flex1: {
    flex: 1,
  },
  modalAssignee: {
    position: "relative",
    width: 300,
  },
  toolbar: {
    padding: "0 10px",
  },
  searchInput: {
    width: "-webkit-fill-available",
    margin: "0 10px",
  },
});

interface IModalAssignee {
  open: boolean;
  onClose: () => void;
  anchorEl: Element | ((element: Element) => Element);
  assetData: IProduct;
  viewName: string;
}

const ModalAssignee = ({
  open,
  onClose,
  anchorEl,
  assetData,
  viewName,
}: IModalAssignee) => {
  const classes = useStyles({});
  const setSnackbar = React.useContext(ContextSetSnackbar);

  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const { setup, apply, loading, inputSearch, selectedIds } = state;
  const assignments = getAssignments(assetData, viewName);
  const assignmentsId = assignments.map(({ assignee }) => assignee);

  const onListChange = React.useCallback(
    (id: string) => {
      dispatch({ type: ACTION.CLICK_USER_ID, id });
    },
    [dispatch]
  );
  const onInputChange = React.useCallback(
    (value) => {
      dispatch({ type: ACTION.INPUT, value });
    },
    [dispatch]
  );
  const onClickConfirm = React.useCallback(() => {
    dispatch({ type: ACTION.APPLY });
  }, [dispatch]);

  // setup initial value on open modal
  React.useEffect(() => {
    if (open && !setup) dispatch({ type: ACTION.SETUP, assetData, viewName });
  }, [assetData, open, setup, viewName]);

  // reset reducer on close modal
  React.useEffect(() => {
    if (!open && setup) dispatch({ type: ACTION.RESET });
  }, [open, setup]);

  // save new assignees
  React.useEffect(() => {
    (async () => {
      if (apply && !loading) {
        try {
          dispatch({ type: ACTION.LOADING_STARTED });

          const id = viewName;
          const contentType = IAssignmentContentType.VIEW;

          const res = await assignEntity({
            entityId: assetData.id,
            version: assetData.version,
            assignmentsToAdd: selectedIds.map((assignee) => ({
              id,
              contentType,
              assignee,
            })),
            assignmentsToRemove: assignmentsId.map((assignee) => ({
              id,
              contentType,
              assignee,
            })),
          });
          if (res.error) throw res.error;

          setSnackbar(Severity.SUCCESS, "Update view assignment");
        } catch (err) {
          console.error("ERROR BtnAssignees", err);
          setSnackbar(Severity.WARNING, genericErrorText);
        }

        dispatch({ type: ACTION.LOADING_STOPPED });
        onClose();
      }
    })();
  }, [
    apply,
    assetData.id,
    assetData.version,
    assignmentsId,
    loading,
    onClose,
    selectedIds,
    setSnackbar,
    viewName,
  ]);

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "bottom", horizontal: "right" }}
      PaperProps={{ className: classes.modalAssignee }}
    >
      <LoadingMask open={apply} backgroundColor="rgba(250,250,250,0.5)" />
      <Toolbar>
        <Typography variant="subtitle2" children="Assign View" />
        <div className={classes.flex1} />
        <Typography
          variant="body1"
          style={{ color: colorTheme }}
          children={!selectedIds.length ? "" : `${selectedIds.length} selected`}
        />
      </Toolbar>
      <FieldSearch
        className={classes.searchInput}
        autofocus
        placeholder="Search user..."
        value={inputSearch}
        onChange={onInputChange}
      />
      <AssigneesList
        inputSearch={inputSearch}
        selectedIds={selectedIds}
        onChange={onListChange}
      />
      <Divider />
      <Toolbar className={classes.toolbar}>
        <div className={classes.flex1} />
        <Btn variant="bold" label="CANCEL" onClick={onClose} />
        <Btn
          variant="bold"
          color={Colors.Green}
          label="APPLY"
          onClick={onClickConfirm}
          disabled={selectedIds.sort().join() === assignmentsId.sort().join()}
        />
      </Toolbar>
    </Popover>
  );
};

export default ModalAssignee;
