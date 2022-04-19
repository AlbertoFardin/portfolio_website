import Modal from "../../Modal";
import * as React from "react";
import { ACT_VPORT } from "../reducer";
import reducer, { reducerInitState, ACT_MODAL } from "./reducer";
import { getFilesDetail, renameItem } from "../../../api/fetchesApi";
import { TYPE_FOLDER } from "../../../constants";
import { FieldText } from "../../../componentsBase/Field";
import Btn from "../../../componentsBase/Btn";
import { Severity } from "../../../interfaces";
import { ContextSetSnackbar } from "../../contexts";
import * as Colors from "../../../componentsBase/style/Colors";
import { errorSomethingWrong, errorNoFoundDetail } from "../constants";
import { ContextDispatchViewport } from "../contexts";

interface IModalRename {
  open: boolean;
  assetDataId: string;
}

const ModalRename = ({ open, assetDataId }: IModalRename) => {
  const [stateModal, dispatchModal] = React.useReducer(
    reducer,
    reducerInitState
  );
  const { assetData, load, save, newName } = stateModal;
  const assetDataMimetype = assetData ? assetData.mimeType : "";
  const assetDataCreatedOn = assetData ? assetData.createdOn : "";
  const isFolder = assetDataMimetype === TYPE_FOLDER;
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const setSnackbar = React.useContext(ContextSetSnackbar);
  const onCancel = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.MODAL_RENAME });
  }, [dispatchViewport]);
  const onSave = React.useCallback(() => {
    dispatchModal({ type: ACT_MODAL.SAVE });
  }, []);
  const onInputTexting = React.useCallback((newName: string) => {
    dispatchModal({ type: ACT_MODAL.INPUT_TEXTING, newName });
  }, []);
  const onInputPressEnter = React.useCallback((key, newName: string) => {
    if (key === "Enter") {
      dispatchModal({ type: ACT_MODAL.INPUT_PRESSENTER, newName });
    }
  }, []);

  // get file detail
  React.useEffect(() => {
    (async () => {
      if (open && !assetData) {
        try {
          dispatchModal({ type: ACT_MODAL.LOAD });
          const [assetData] = await getFilesDetail([assetDataId]);
          dispatchModal({ type: ACT_MODAL.UPDATED, assetData });
        } catch {
          setSnackbar(Severity.WARNING, errorNoFoundDetail);
          onCancel();
        }
      }
    })();
  }, [assetData, assetDataId, onCancel, open, setSnackbar]);

  // fetch renaming
  React.useEffect(() => {
    (async () => {
      if (open && save) {
        try {
          await renameItem({
            id: assetDataId,
            name: newName,
            isFolder,
            createdOn: assetDataCreatedOn,
          });
        } catch {
          setSnackbar(Severity.WARNING, errorSomethingWrong);
        }

        dispatchViewport({ type: ACT_VPORT.MODAL_RENAME, refresh: true });
      }
    })();
  }, [
    assetDataCreatedOn,
    assetDataId,
    dispatchViewport,
    isFolder,
    newName,
    open,
    save,
    setSnackbar,
  ]);

  // reset on closed
  React.useEffect(() => {
    if (!open) dispatchModal({ type: ACT_MODAL.RESET });
  }, [open]);

  return (
    <Modal
      open={open}
      loading={!open || load || save}
      title={`Rename ${isFolder ? "folder" : "file"}`}
      onClose={onCancel}
      content={
        <FieldText
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          value={newName}
          adornmentIcon={isFolder ? "folder_open" : "insert_drive_file"}
          onKeyPress={onInputPressEnter}
          onChange={onInputTexting}
        />
      }
      actions={
        <>
          <div style={{ flex: 1 }} />
          <Btn variant="bold" label="CANCEL" onClick={onCancel} />
          <Btn
            disabled={!newName}
            color={Colors.Green}
            variant="bold"
            label="RENAME"
            onClick={onSave}
          />
        </>
      }
    />
  );
};

export default ModalRename;
