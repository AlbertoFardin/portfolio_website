import Modal from "../../Modal";
import * as React from "react";
import TagSelector from "../TagSelector";
import { ACT_VPORT } from "../reducer";
import { TYPE_FOLDER } from "../../../constants";
import reducer, { reducerInitState, ACT_MODAL } from "./reducer";
import isEmpty from "lodash-es/isEmpty";
import { ContextSetSnackbar } from "../../contexts";
import { IFileDetail, Severity } from "../../../interfaces";
import { getFilesDetail } from "../../../api/fetchesApi";
import { errorNoFoundDetail } from "../constants";
import { ContextDispatchViewport } from "../contexts";

interface IModalTag {
  open: boolean;
  itemsIdSelected: string[];
}
const ModalTag = ({ open, itemsIdSelected }: IModalTag) => {
  const [stateModal, dispatchModal] = React.useReducer(
    reducer,
    reducerInitState
  );
  const { files, loading } = stateModal;
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const setSnackbar = React.useContext(ContextSetSnackbar);
  const onCancel = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.MODAL_TAG });
  }, [dispatchViewport]);
  const onChange = React.useCallback((files: IFileDetail[]) => {
    dispatchModal({ type: ACT_MODAL.UPDATED, files });
  }, []);

  // get files
  React.useEffect(() => {
    (async () => {
      if (open && isEmpty(files)) {
        try {
          dispatchModal({ type: ACT_MODAL.LOADING });
          const files = await getFilesDetail(itemsIdSelected);
          dispatchModal({ type: ACT_MODAL.UPDATED, files });
        } catch {
          setSnackbar(Severity.WARNING, errorNoFoundDetail);
          onCancel();
        }
      }
    })();
  }, [files, itemsIdSelected, onCancel, open, setSnackbar]);

  // reset on closed
  React.useEffect(() => {
    if (!open) dispatchModal({ type: ACT_MODAL.RESET });
  }, [open]);

  return (
    <Modal
      open={open}
      loading={loading}
      title={
        files.length === 1
          ? `Tag ${files[0].mimeType === TYPE_FOLDER ? "folder" : "file"}`
          : `Tag ${files.length} items`
      }
      onClose={onCancel}
      content={
        <div style={{ width: 400, maxWidth: 400 }}>
          <TagSelector
            files={files}
            tagManagement={false}
            onChange={onChange}
          />
        </div>
      }
    />
  );
};

export default ModalTag;
