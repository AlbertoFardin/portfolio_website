import * as React from "react";
import Modal from "../../Modal";
import InfoCopyright from "../PanelDetail/Content/InfoCopyright";
import reducer, { reducerInitState, ACT_MODAL } from "./reducer";
import * as Colors from "../../../componentsBase/style/Colors";
import Btn from "../../../componentsBase/Btn";
import { ContextDispatchViewport } from "../contexts";
import { ACT_VPORT } from "../reducer";
import { getFilesDetail, putCopyright } from "../../../api/fetchesApi";
import { ContextSetSnackbar } from "../../contexts";
import { Severity } from "../../../interfaces";
import { genericErrorText } from "../../../utils/manageFetchErrors";
import { MAX_PRODUCTS_MASSIVE_ACTIONS } from "../../../constants";
import Typography from "@material-ui/core/Typography";

interface IModalCopyright {
  open: boolean;
  itemsIdSelected: string[];
}

const ModalCopyright = ({ open, itemsIdSelected }: IModalCopyright) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const setSnackbar = React.useContext(ContextSetSnackbar);

  const [stateModal, dispatchModal] = React.useReducer(
    reducer,
    reducerInitState
  );
  const {
    copyrightDirty,
    copyrightSaved,
    fetchingData,
    fetchingSave,
  } = stateModal;

  const onCancel = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.MODAL_COPYRIGHT });
  }, [dispatchViewport]);
  const onConfirm = React.useCallback(() => {
    dispatchModal({ type: ACT_MODAL.FETCH_SAVE });
  }, []);
  const onChange = React.useCallback((id: string, value) => {
    dispatchModal({ type: ACT_MODAL.CHANGE_VALUE, id, value });
  }, []);

  React.useEffect(() => {
    if (!open) dispatchModal({ type: ACT_MODAL.RESET });
  }, [open]);

  React.useEffect(() => {
    (async () => {
      if (
        open &&
        !copyrightSaved &&
        itemsIdSelected.length <= MAX_PRODUCTS_MASSIVE_ACTIONS
      ) {
        const value = await getFilesDetail(itemsIdSelected);
        dispatchModal({ type: ACT_MODAL.FETCH_DATA, value });
      }
    })();
  }, [copyrightSaved, itemsIdSelected, open]);

  React.useEffect(() => {
    (async () => {
      if (fetchingSave) {
        try {
          await putCopyright({
            fileIds: itemsIdSelected,
            correlationId: "editingCopyrightBulk",
            ...copyrightDirty,
          });

          setSnackbar(Severity.SUCCESS, "Digital Right updated");
        } catch {
          setSnackbar(Severity.WARNING, genericErrorText);
        }
        dispatchViewport({ type: ACT_VPORT.MODAL_COPYRIGHT });
      }
    })();
  }, [
    copyrightDirty,
    dispatchViewport,
    fetchingSave,
    itemsIdSelected,
    setSnackbar,
  ]);

  return (
    <Modal
      open={open}
      title="Editing Digital Right"
      loading={fetchingData || fetchingSave}
      onClose={onCancel}
      content={
        itemsIdSelected.length > MAX_PRODUCTS_MASSIVE_ACTIONS ? (
          <Typography
            variant="body1"
            children={`You selected ${itemsIdSelected.length} files, the limit of massive editing is 500`}
          />
        ) : (
          <InfoCopyright
            onChange={onChange}
            copyrightSaved={copyrightSaved}
            copyrightDirty={copyrightDirty}
          />
        )
      }
      actions={
        itemsIdSelected.length > MAX_PRODUCTS_MASSIVE_ACTIONS ? (
          <>
            <div style={{ flex: 1 }} />
            <Btn
              color={Colors.Green}
              variant="bold"
              label="OK"
              onClick={onCancel}
            />
          </>
        ) : (
          <>
            <div style={{ flex: 1 }} />
            <Btn variant="bold" label="CANCEL" onClick={onCancel} />
            <Btn
              disabled={!Object.keys(copyrightDirty).length}
              color={Colors.Green}
              variant="bold"
              label="CONFIRM"
              onClick={onConfirm}
            />
          </>
        )
      }
    />
  );
};

export default ModalCopyright;
