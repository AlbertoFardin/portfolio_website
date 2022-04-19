import * as React from "react";
import { ACT_VPORT } from "../reducer";
import Modal from "../../Modal";
import reducer, { reducerInitState, ACT_MODAL } from "./reducer";
import { ContextSetSnackbar } from "../../contexts";
import {
  IFileDetail,
  Severity,
  IShared,
  INPayloadSharedFile,
  NotificationType,
} from "../../../interfaces";
import isEmpty from "lodash-es/isEmpty";
import concat from "lodash-es/concat";
import {
  createNotification,
  getFilesDetail,
  setPrivateshares,
} from "../../../api/fetchesApi";
import composeJsonToSave from "./composeJsonToSave";
import PanelAddUsers from "./PanelAddUsers";
import PanelListShared from "./PanelListShared";
import * as Colors from "../../../componentsBase/style/Colors";
import Btn from "../../../componentsBase/Btn";
import { errorSomethingWrong, errorNoFoundDetail } from "../constants";
import { ContextDispatchViewport } from "../contexts";

interface IModalSharePrivate {
  open: boolean;
  itemsIdSelected: string[];
}

const ModalSharePrivate = ({ open, itemsIdSelected }: IModalSharePrivate) => {
  const [stateModal, dispatchModal] = React.useReducer(
    reducer,
    reducerInitState
  );
  const {
    assetDatas,
    load,
    save,
    sharesToCreate,
    sharesToEdited,
    confirmDiscard,
    notifyToCreate,
  } = stateModal;
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const setSnackbar = React.useContext(ContextSetSnackbar);
  const toggleConfirm = React.useCallback(() => {
    dispatchModal({ type: ACT_MODAL.CONFIRM_DISCARD });
  }, []);
  const toggleNotify = React.useCallback(() => {
    dispatchModal({ type: ACT_MODAL.NOTIFY_TO_CREATE });
  }, []);
  const onClose = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.MODAL_SHARE_PRIVATE });
  }, [dispatchViewport]);
  const onCancel = React.useCallback(() => {
    if (isEmpty(sharesToCreate) && isEmpty(sharesToEdited)) {
      onClose();
    } else {
      toggleConfirm();
    }
  }, [onClose, toggleConfirm, sharesToCreate, sharesToEdited]);
  const onSave = React.useCallback(() => {
    dispatchModal({ type: ACT_MODAL.SHARES_SAVING });
  }, []);
  const setCreateShares = React.useCallback((shares: IShared[]) => {
    dispatchModal({ type: ACT_MODAL.SHARES_TO_CREATE, shares });
  }, []);
  const setEditedShares = React.useCallback((userId, roleId) => {
    dispatchModal({ type: ACT_MODAL.SHARES_TO_EDITED, userId, roleId });
  }, []);

  // get file detail
  React.useEffect(() => {
    if (isEmpty(assetDatas) && open) {
      (async () => {
        try {
          dispatchModal({ type: ACT_MODAL.DATAS_LOADING });
          const assetDatas = await getFilesDetail(itemsIdSelected);
          dispatchModal({ type: ACT_MODAL.DATAS_UPDATED, assetDatas });
        } catch {
          setSnackbar(Severity.WARNING, errorNoFoundDetail);
          onClose();
        }
      })();
    }
  }, [assetDatas, itemsIdSelected, onClose, open, setSnackbar]);

  // reset on closed
  React.useEffect(() => {
    if (!open) dispatchModal({ type: ACT_MODAL.RESET });
  }, [open]);

  // save shares
  React.useEffect(() => {
    if (save) {
      (async () => {
        let itemsToUpdate: IFileDetail[] = [];
        try {
          itemsToUpdate = await setPrivateshares(
            composeJsonToSave({
              assetDatas,
              shares: concat(sharesToCreate, sharesToEdited),
            })
          );

          if (notifyToCreate && !isEmpty(sharesToCreate)) {
            const payload: INPayloadSharedFile = {
              assetDatas: assetDatas.map(({ id, name, mimeType }) => ({
                id,
                name,
                mimeType,
              })),
            };
            await createNotification({
              toUsers: sharesToCreate.map((u) => u.id),
              type: NotificationType.SHARED_FILES,
              payload,
            });
          }

          setSnackbar(Severity.SUCCESS, "Share settings have been updated");
        } catch {
          setSnackbar(Severity.WARNING, errorSomethingWrong);
        }
        onClose();

        dispatchViewport({
          type: ACT_VPORT.MODAL_SHARE_PRIVATE,
          ids: itemsToUpdate.map(({ id }) => id),
          refresh: true,
        });
      })();
    }
  }, [
    assetDatas,
    dispatchViewport,
    notifyToCreate,
    onClose,
    save,
    setSnackbar,
    sharesToCreate,
    sharesToEdited,
  ]);

  return (
    <Modal
      open={open}
      loading={save || load}
      title="Share with"
      onClose={onCancel}
      content={
        <>
          <PanelAddUsers
            assetDatas={assetDatas}
            sharesToEdited={sharesToEdited}
            onChange={setCreateShares}
            onNotify={toggleNotify}
            onCancel={onCancel}
            onSave={onSave}
            notify={notifyToCreate}
          />
          <PanelListShared
            assetDatas={assetDatas}
            sharesToCreate={sharesToCreate}
            sharesToEdited={sharesToEdited}
            onChange={setEditedShares}
            onCancel={onCancel}
            onSave={onSave}
          />
          <Modal
            open={confirmDiscard}
            onClose={toggleConfirm}
            title="Discard unsaved changes?"
            actions={
              <>
                <div style={{ flex: 1 }} />
                <Btn variant="bold" label="CANCEL" onClick={toggleConfirm} />
                <Btn
                  color={Colors.Red}
                  variant="bold"
                  label="DISCARD"
                  onClick={onClose}
                />
              </>
            }
          />
        </>
      }
    />
  );
};

export default ModalSharePrivate;
