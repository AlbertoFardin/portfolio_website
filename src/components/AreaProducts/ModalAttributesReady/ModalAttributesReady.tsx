import * as Colors from "../../../componentsBase/style/Colors";
import Btn from "../../../componentsBase/Btn";
import * as React from "react";
import Typography from "@material-ui/core/Typography";
import {
  IProduct,
  Severity,
  IReadySet,
  ContentType,
} from "../../../interfaces";
import isEmpty from "lodash-es/isEmpty";
import reducer, { reducerInitState, ACTION } from "./reducer";
import { ContextSetSnackbar } from "../../contexts";
import { multiReady } from "../../../api/fetchesApi";
import getReadySets from "./getReadySets";
import Modal from "../../Modal";
import { ContextColumns } from "../contexts";

interface IModalAttributesReady {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  items: IProduct[];
  itemsRoot: IProduct[];
}

const ModalAttributesReady = ({
  open,
  onClose,
  loading,
  items,
  itemsRoot,
}: IModalAttributesReady) => {
  const columns = React.useContext(ContextColumns);
  const setSnackbar = React.useContext(ContextSetSnackbar);

  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const { saveClicked, saving } = state;
  const onConfirm = React.useCallback(() => {
    dispatch({ type: ACTION.SAVE_CLICK });
  }, []);
  const readySets: IReadySet[] = React.useMemo(() => {
    return getReadySets({
      items,
      itemsRoot,
      columns,
    });
  }, [columns, items, itemsRoot]);
  const spinner = open && (isEmpty(items) || loading || saveClicked || saving);

  // reset on close
  React.useEffect(() => {
    if (!open) dispatch({ type: ACTION.RESET });
  }, [open]);

  // when clicked CONFIRM, fetch data
  React.useEffect(() => {
    (async () => {
      if (saveClicked && !saving && !isEmpty(items)) {
        dispatch({ type: ACTION.SAVING });
        try {
          await multiReady(readySets, ContentType.ATTRIBUTE);
          setSnackbar(Severity.SUCCESS, "Ready Status will be applied soon");
        } catch (err) {
          console.warn("ModalAttributesReady: ", err);
          setSnackbar(
            Severity.WARNING,
            "Unable to apply Ready Status, please refresh and retry"
          );
        }
        dispatch({ type: ACTION.SAVE_STOP });
        onClose();
      }
    })();
  }, [items, onClose, readySets, saveClicked, saving, setSnackbar]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Apply Ready Status"
      loading={spinner}
      content={
        <>
          {/*
        <Checkbox
          className={classes.checkbox}
          label="Skip items ready"
          checked={checkSkipReady}
          onChange={onChangeCheckSkipReady}
        />
        */}
          <Typography
            variant="body1"
            children="You are about to set Ready all the product attributes."
          />
          <Typography
            variant="body1"
            children="Are you sure you want to confirm this operation?"
          />
        </>
      }
      actions={
        <>
          <div style={{ flex: 1 }} />
          <Btn variant="bold" label="CANCEL" onClick={onClose} />
          <Btn
            variant="bold"
            label="CONFIRM"
            disabled={isEmpty(readySets)}
            color={Colors.Cyan}
            onClick={onConfirm}
            tooltip={isEmpty(readySets) ? "No attributes to set Ready" : ""}
          />
        </>
      }
    />
  );
};

export default ModalAttributesReady;
