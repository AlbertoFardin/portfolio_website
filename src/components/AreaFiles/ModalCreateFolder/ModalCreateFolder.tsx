import Modal from "../../Modal";
import * as React from "react";
import { ACT_VPORT } from "../reducer";
import { createFolder } from "../../../api/fetchesApi";
import { FieldText } from "../../../componentsBase/Field";
import last from "lodash-es/last";
import * as Colors from "../../../componentsBase/style/Colors";
import Btn from "../../../componentsBase/Btn";
import reducer, { reducerInitState, ACT_MODAL } from "./reducer";
import { ContextSetSnackbar } from "../../contexts";
import { Severity, IPath } from "../../../interfaces";
import { errorSomethingWrong } from "../constants";
import { ContextDispatchViewport } from "../contexts";

interface IModalCreateFolder {
  open: boolean;
  folders: IPath[];
}

const ModalCreateFolder = ({ open, folders }: IModalCreateFolder) => {
  const [stateModal, dispatchModal] = React.useReducer(
    reducer,
    reducerInitState
  );
  const { save, newName } = stateModal;
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const setSnackbar = React.useContext(ContextSetSnackbar);
  const onSave = React.useCallback(() => {
    dispatchModal({ type: ACT_MODAL.SAVE });
  }, []);
  const onCancel = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.MODAL_CREATE_FOLDER });
  }, [dispatchViewport]);
  const onInputChange = React.useCallback((newName: string) => {
    dispatchModal({ type: ACT_MODAL.INPUT_TEXTING, newName });
  }, []);
  const onInputKeyPress = React.useCallback((key, newName: string) => {
    if (key === "Enter") {
      dispatchModal({ type: ACT_MODAL.INPUT_PRESSENTER, newName });
    }
  }, []);

  React.useEffect(() => {
    if (open && save) {
      (async () => {
        try {
          await createFolder({
            name: newName,
            parentId: last(folders).id,
          });
        } catch {
          setSnackbar(Severity.WARNING, errorSomethingWrong);
        }

        dispatchViewport({
          type: ACT_VPORT.MODAL_CREATE_FOLDER,
          refresh: true,
        });
      })();
    }
  }, [dispatchViewport, folders, newName, open, save, setSnackbar]);

  React.useEffect(() => {
    if (!open) dispatchModal({ type: ACT_MODAL.RESET });
  }, [open]);

  return (
    <Modal
      open={open}
      title="Create folder"
      loading={!open || save}
      onClose={onCancel}
      content={
        <FieldText
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          value={newName}
          adornmentIcon="folder"
          onKeyPress={onInputKeyPress}
          onChange={onInputChange}
          onBlur={onInputChange}
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
            label="CREATE"
            onClick={onSave}
          />
        </>
      }
    />
  );
};

export default ModalCreateFolder;
