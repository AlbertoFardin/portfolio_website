import * as React from "react";
import { ACT_VPORT } from "../reducer";
import Modal from "../../Modal";
import Divider from "@material-ui/core/Divider";
import ShareCdn from "./ShareCdn";
import ShareLink from "./ShareLink";
import { TYPE_FOLDER } from "../../../constants";
import reducer, { reducerInitState, ACT_MODAL } from "./reducer";
import { getFilesDetail } from "../../../api/fetchesApi";
import { ContextSetSnackbar } from "../../contexts";
import { IFile, IFileDetail, Severity } from "../../../interfaces";
import { ContextDispatchViewport } from "../contexts";
import { errorNoFoundDetail } from "../constants";

interface IModalShareLink {
  open: boolean;
  items: IFile[];
  assetDataId: string;
}

const ModalShareLink = ({ open, items, assetDataId }: IModalShareLink) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const setSnackbar = React.useContext(ContextSetSnackbar);

  const itemData = items.find((c) => c.id === assetDataId);
  const { mimeType } = itemData || {};

  const [stateModal, dispatchModal] = React.useReducer(
    reducer,
    reducerInitState
  );
  const { assetData } = stateModal;

  const onCancel = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.MODAL_SHARE_LINK });
  }, [dispatchViewport]);
  const onUpdateLink = React.useCallback(
    (assetData: IFileDetail) => {
      dispatchModal({ type: ACT_MODAL.UPDATED, assetData });
      dispatchViewport({ type: ACT_VPORT.REFRESH });
    },
    [dispatchViewport]
  );
  const onUpdateCdn = React.useCallback((assetData: IFileDetail) => {
    dispatchModal({ type: ACT_MODAL.UPDATED, assetData });
  }, []);

  // get file detail
  React.useEffect(() => {
    if (open && !!itemData) {
      (async () => {
        try {
          const [assetData] = await getFilesDetail([assetDataId]);
          dispatchModal({ type: ACT_MODAL.UPDATED, assetData });
        } catch {
          setSnackbar(Severity.WARNING, errorNoFoundDetail);
          onCancel();
        }
      })();
    }
  }, [assetDataId, itemData, onCancel, open, setSnackbar]);

  // reset on closed
  React.useEffect(() => {
    if (!open) dispatchModal({ type: ACT_MODAL.RESET });
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onCancel}
      loading={!assetData}
      content={
        <div style={{ margin: "20px 0" }}>
          <ShareLink
            assetData={assetData}
            onUpdate={onUpdateLink}
            onCancel={onCancel}
          />
          {mimeType === TYPE_FOLDER ? null : (
            <>
              <Divider style={{ margin: "20px 0" }} />
              <ShareCdn
                assetData={assetData}
                onUpdate={onUpdateCdn}
                onCancel={onCancel}
              />
            </>
          )}
        </div>
      }
    />
  );
};

export default ModalShareLink;
