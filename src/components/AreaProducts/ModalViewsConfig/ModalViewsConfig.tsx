import * as React from "react";
import isEmpty from "lodash-es/isEmpty";
import { IProduct, Severity } from "../../../interfaces";
import reducer, { reducerInitState, ACTION, FetchStatus } from "./reducer";
import ModalContent from "./Content";
import ModalFooter from "./Footer";
import {
  KEY_ENTITY_TYPE,
  KEY_VIEWS_EDITING_PERFORMED,
} from "../../../constants";
import { setMultiViewData, resetViews } from "../../../api/fetchesApi";
import composeJsonToSave from "./composeJsonToSave";
import * as Colors from "../../../componentsBase/style/Colors";
import { ContextSetSnackbar } from "../../contexts";
import Modal from "../../Modal";
import Typography from "@material-ui/core/Typography";
import Btn from "../../../componentsBase/Btn";
import { ContextViews } from "../contexts";

interface IModalViewsConfig {
  open?: boolean;
  loading?: boolean;
  onClose: () => void;
  items: IProduct[];
}

const ModalViewsConfig = ({
  open,
  loading,
  onClose,
  items,
}: IModalViewsConfig) => {
  const tenantViews = React.useContext(ContextViews);
  const setSnackbar = React.useContext(ContextSetSnackbar);

  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const { views, fetch, confirmReset } = state;
  const itemsTypeSize = new Set(items.map((a) => a[KEY_ENTITY_TYPE])).size;
  const fetching = loading || fetch !== FetchStatus.NONE;
  const onResetViews = React.useCallback(() => {
    dispatch({
      type: ACTION.FETCHING,
      value: FetchStatus.VIEWS_RESETED,
    });
  }, []);
  const onCancelReset = React.useCallback(() => {
    dispatch({ type: ACTION.CONFIRM_RESET, value: false });
  }, []);
  const countEditedPerformed = items.filter(
    (p) => p[KEY_VIEWS_EDITING_PERFORMED]
  ).length;
  const spinner = isEmpty(items) || fetching;

  // when open, init state
  React.useEffect(() => {
    if (open && !isEmpty(items)) dispatch({ type: ACTION.START, items });
  }, [open, items]);

  // when closed, reset state
  React.useEffect(() => {
    if (!open) dispatch({ type: ACTION.RESET });
  }, [open]);

  // when clicked CONFIRM, fetch data
  React.useEffect(() => {
    (async () => {
      if (open && fetch === FetchStatus.VIEWS_CHANGED) {
        try {
          await setMultiViewData(composeJsonToSave(items, views, tenantViews));
        } catch (err) {
          console.warn("ModalMassiveMediaReady: ", err);
        }
        setSnackbar(
          Severity.SUCCESS,
          "New View configurations will be applied soon"
        );
        onClose();
      }
    })();
  }, [fetch, items, onClose, open, setSnackbar, tenantViews, views]);

  // when clicked RESET, fetch data
  React.useEffect(() => {
    (async () => {
      if (open && fetch === FetchStatus.VIEWS_RESETED) {
        try {
          const entityToReset = items.map(({ id, version }) => ({
            entityId: id,
            version,
          }));
          await resetViews(entityToReset);
        } catch (err) {
          console.warn("ModalMassiveMediaReady: ", err);
        }
        setSnackbar(Severity.SUCCESS, "Product view will be reset soon");
        onClose();
      }
    })();
  }, [fetch, items, onClose, open, setSnackbar, tenantViews, views]);

  if (itemsTypeSize > 1) {
    return (
      <Modal
        open={open}
        loading={spinner}
        onClose={onClose}
        title="Can’t edit view"
        content={
          <Typography
            variant="body1"
            children="Please select items of the same level in order to edit views"
          />
        }
        actions={
          <>
            <div style={{ flex: 1 }} />
            <Btn
              variant="bold"
              color={Colors.Green}
              label="OK, I UNDERSTAND"
              onClick={onClose}
            />
          </>
        }
      />
    );
  }

  if (confirmReset) {
    return (
      <Modal
        open={open}
        loading={spinner}
        onClose={onClose}
        title="Confirm view reset"
        content={
          <Typography
            variant="body1"
            children={`Please confirm that you want to reset automatic rules for the selected item${
              countEditedPerformed > 1 ? "s" : ""
            }`}
          />
        }
        actions={
          <>
            <div style={{ flex: 1 }} />
            <Btn variant="bold" label="CANCEL" onClick={onCancelReset} />
            <Btn
              variant="bold"
              color={Colors.Orange}
              label="RESET"
              onClick={onResetViews}
            />
          </>
        }
      />
    );
  }

  return (
    <Modal
      open={open}
      loading={spinner}
      onClose={onClose}
      title="Edit Product View"
      titleSub={`${items.length} Product selected`}
      content={<ModalContent dispatch={dispatch} views={views} items={items} />}
      actions={
        <ModalFooter
          dispatch={dispatch}
          views={views}
          fetching={fetching}
          countEditedPerformed={countEditedPerformed}
          onClose={onClose}
        />
      }
    />
  );
};

export default ModalViewsConfig;
