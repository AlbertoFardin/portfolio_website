import Modal from "../../Modal";
import * as Colors from "../../../componentsBase/style/Colors";
import Btn from "../../../componentsBase/Btn";
import * as React from "react";
import { IFile, Severity } from "../../../interfaces";
import { ACT_VPORT } from "../reducer";
import { deleteItems } from "../../../api/fetchesApi";
import { TYPE_FOLDER } from "../../../constants";
import isEmpty from "lodash-es/isEmpty";
import Typography from "@material-ui/core/Typography";
import { ContextSetSnackbar } from "../../contexts";
import reducer, { reducerInitState, ACT_MODAL } from "./reducer";
import { errorSomethingWrong } from "../constants";
import { ContextDispatchViewport } from "../contexts";

interface IModalDelete {
  open: boolean;
  items: IFile[];
  itemsIdSelected: string[];
}
const ModalDelete = ({ open, items, itemsIdSelected }: IModalDelete) => {
  const [stateModal, dispatchModal] = React.useReducer(
    reducer,
    reducerInitState
  );
  const { deleting, errorDescendant } = stateModal;
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const setSnackbar = React.useContext(ContextSetSnackbar);
  const onDelete = React.useCallback(() => {
    dispatchModal({ type: ACT_MODAL.DELETE });
  }, []);
  const onCancel = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.MODAL_DELETE });
  }, [dispatchViewport]);
  const itemsSelected = items.filter(({ id }) => {
    const selectedSet = new Set(itemsIdSelected);
    return selectedSet.has(id);
  });
  const singleItem = itemsSelected.length === 1;
  const folders = itemsSelected.filter((a) => a.mimeType === TYPE_FOLDER);
  const files = itemsSelected.filter((a) => a.mimeType !== TYPE_FOLDER);
  const thereArePublicLink = !!itemsSelected.find(({ publicshares }) => {
    return publicshares && publicshares.length !== 0;
  });

  React.useEffect(() => {
    (async () => {
      if (open && deleting) {
        try {
          await deleteItems(
            items.reduce((acc, { id, mimeType }) => {
              const selectedSet = new Set(itemsIdSelected);
              if (selectedSet.has(id)) {
                acc.push({
                  id,
                  isFolder: mimeType === TYPE_FOLDER,
                });
              }
              return acc;
            }, [])
          );
          dispatchViewport({
            type: ACT_VPORT.MODAL_DELETE,
            refresh: true,
          });
        } catch (err) {
          const errJson = await err.response.json();

          if (errJson.code === "descendant_without_deletion_permission") {
            dispatchModal({ type: ACT_MODAL.ERROR_DESCENDANT });
          } else {
            setSnackbar(Severity.WARNING, errorSomethingWrong);
            dispatchViewport({ type: ACT_VPORT.MODAL_DELETE, refresh: true });
          }
        }
      }
    })();
  }, [deleting, dispatchViewport, items, itemsIdSelected, open, setSnackbar]);

  React.useEffect(() => {
    if (!open) dispatchModal({ type: ACT_MODAL.RESET });
  }, [open]);

  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={!thereArePublicLink ? "Delete" : "⚠️ Deleting Shared Item"}
      loading={!open || deleting}
      content={
        errorDescendant ? (
          <Typography
            variant="body1"
            children={
              <>
                <span children="Unable to delete this folder." />
                <br />
                <span children="You haven't permission to delete one or more of the contained items." />
              </>
            }
          />
        ) : (
          <>
            <Typography
              variant="body1"
              children={
                <>
                  Are you sure to delete
                  {!singleItem ? null : (
                    <span
                      style={{ fontWeight: "bold" }}
                      children={` "${itemsSelected[0].name}"`}
                    />
                  )}
                  {singleItem || isEmpty(folders) ? null : (
                    <span
                      style={{ fontWeight: "bold" }}
                      children={` ${folders.length} folder${
                        folders.length > 1 ? "s" : ""
                      }`}
                    />
                  )}
                  {isEmpty(folders) || isEmpty(files) ? null : " and"}
                  {singleItem || isEmpty(files) ? null : (
                    <span
                      style={{ fontWeight: "bold" }}
                      children={` ${files.length} file${
                        files.length > 1 ? "s" : ""
                      }`}
                    />
                  )}
                  ?
                </>
              }
            />
            {!thereArePublicLink ? null : (
              <Typography
                variant="body1"
                children="People with file link or share page link won't be able to access the asset anymore."
              />
            )}
          </>
        )
      }
      actions={
        errorDescendant ? (
          <>
            <div style={{ flex: 1 }} />
            <Btn
              color={Colors.Green}
              variant="bold"
              label="OK, I UNDERSTAND"
              onClick={onCancel}
            />
          </>
        ) : (
          <>
            <div style={{ flex: 1 }} />
            <Btn variant="bold" label="CANCEL" onClick={onCancel} />
            <Btn
              color={Colors.Red}
              variant="bold"
              label="DELETE"
              onClick={onDelete}
            />
          </>
        )
      }
    />
  );
};

export default ModalDelete;
