import * as React from "react";
import * as Colors from "../../../componentsBase/style/Colors";
import Btn from "../../../componentsBase/Btn";
import reducer, { reducerInitState, ACT_MODAL } from "./reducer";
import { ContextDispatchMain, ContextSetSnackbar } from "../../contexts";
import Modal from "../../Modal";
import { ContextColumns } from "../contexts";
import Typography from "@material-ui/core/Typography";
import FooterCheckbox from "../ModalMediasReady/FooterCheckbox";
import {
  exportXlsx,
  getJsonConfigsSet,
  saveJsonConfigsSet,
} from "../../../api/fetchesApi";
import { v4 as uuidv4 } from "uuid";
import getColumnsTemplate from "./getColumnsTemplate";
import { ACTION_MAIN } from "../../reducer";
import { Severity } from "../../../interfaces";
import { getWebSocketConnectionId } from "../../webSocket";
import Field from "./Field";
import LinkSummary from "./LinkSummary";
import getSelectionsToSave from "./getSelectionsToSave";

const JSON_DOC_ID = "export_xlsx";
const MAX_COLUMNS = 1000;

interface IModalDownloadXlsx {
  open: boolean;
  onClose: () => void;
  itemsIdSelected: string[];
}

const ModalDownloadXlsx = ({
  open,
  onClose,
  itemsIdSelected,
}: IModalDownloadXlsx) => {
  const dispatchMain = React.useContext(ContextDispatchMain);
  const columns = React.useContext(ContextColumns);
  const setSnackbar = React.useContext(ContextSetSnackbar);

  const [stateModal, dispatchModal] = React.useReducer(
    reducer,
    reducerInitState
  );
  const {
    downloading,
    downloadWithItems,
    fieldActiveId,
    attributesInputted,
    attributesSelected,
    selectionsSave,
    selectionsHash,
    attributesSaveSelection,
    selections,
  } = stateModal;

  const onDownloadChange = React.useCallback(() => {
    dispatchModal({ type: ACT_MODAL.DOWNLOAD_WITH_ITEMS });
  }, []);
  const onDownloadStart = React.useCallback(() => {
    dispatchModal({ type: ACT_MODAL.DOWNLOAD_STARTED });
  }, []);
  const onLinkSummaryItemClick = React.useCallback(
    (id: string) => {
      dispatchModal({ type: ACT_MODAL.ATTRIBUTES_SELECTED, id });
    },
    [dispatchModal]
  );

  const columnsCount = attributesSelected.length;
  const disableDownload = columnsCount === 0 || columnsCount > MAX_COLUMNS;

  // reset on close
  React.useEffect(() => {
    if (!open) dispatchModal({ type: ACT_MODAL.RESET });
  }, [open]);

  // get selections from jsonstore
  React.useEffect(() => {
    (async () => {
      if (open) {
        const { hash, payload } = await getJsonConfigsSet({
          docId: JSON_DOC_ID,
          itemsSetsDef: [],
        });
        dispatchModal({
          type: ACT_MODAL.SELECTIONS_UPDATE,
          hash,
          payload,
        });
      }
    })();
  }, [open]);

  // save selections in jsonstore
  React.useEffect(() => {
    (async () => {
      if (selectionsSave) {
        const { hash, itemsSets } = await saveJsonConfigsSet({
          docId: JSON_DOC_ID,
          hash: selectionsHash,
          itemsSets: selections,
        });
        dispatchModal({
          type: ACT_MODAL.SELECTIONS_UPDATE,
          hash,
          payload: itemsSets,
        });
      }
    })();
  }, [selections, selectionsHash, selectionsSave]);

  // when clicked DOWNLOAD
  React.useEffect(() => {
    (async () => {
      if (!!downloading) {
        try {
          const correlationId = uuidv4();

          if (attributesSaveSelection) {
            await saveJsonConfigsSet({
              docId: JSON_DOC_ID,
              hash: selectionsHash,
              itemsSets: getSelectionsToSave(selections, attributesSelected),
            });
          }
          await exportXlsx({
            columns: getColumnsTemplate(columns, attributesSelected),
            correlationId,
            connectionId: getWebSocketConnectionId(),
            entities: downloadWithItems ? itemsIdSelected : [],
          });

          // aggiungo al componente multiDownload l'elemento da mostrare
          dispatchMain({
            type: ACTION_MAIN.DOWNLOADS_TO_ADD,
            payload: {
              correlationId,
              filename: `${correlationId}.xlsx`,
            },
          });
        } catch (err) {
          console.warn("ModalDownloadXlsx: ", err);
          setSnackbar(
            Severity.WARNING,
            "Unable to download XLSX, please refresh and retry"
          );
        }
        dispatchModal({ type: ACT_MODAL.DOWNLOAD_STOPPED });
        onClose();
      }
    })();
  }, [
    columns,
    dispatchMain,
    downloadWithItems,
    downloading,
    itemsIdSelected,
    attributesSelected,
    onClose,
    selections,
    selectionsHash,
    attributesSaveSelection,
    setSnackbar,
  ]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      loading={downloading}
      title="Download XLSX Template"
      content={
        <>
          <Typography
            variant="body1"
            children="Which attributes do you want to include in your XLSX file?"
          />
          <Field
            dispatchModal={dispatchModal}
            fieldActiveId={fieldActiveId}
            attributesInputted={attributesInputted}
            attributesSelected={attributesSelected}
            attributesSaveSelection={attributesSaveSelection}
            selections={selections}
            selectionsHash={selectionsHash}
            selectionsSave={selectionsSave}
          />
          <Typography
            variant="body1"
            children={
              !columnsCount ? (
                "Please select some attributes to proceed with the download"
              ) : (
                <>
                  <span children="The XLSX file will contain " />
                  <LinkSummary
                    attributesSelected={attributesSelected}
                    onItemClick={onLinkSummaryItemClick}
                  />
                </>
              )
            }
          />

          {columnsCount > MAX_COLUMNS ? (
            <Typography
              color="error"
              variant="body1"
              children={`⚠️ The XLSX file can handle a maximum of ${MAX_COLUMNS} columns`}
            />
          ) : null}
        </>
      }
      actions={
        <>
          <FooterCheckbox
            label="Include entity selected in grid"
            checked={downloadWithItems}
            onClick={onDownloadChange}
          />
          <div style={{ flex: 1 }} />
          <Btn variant="bold" label="CANCEL" onClick={onClose} />
          <Btn
            variant="bold"
            label="DOWNLOAD XLSX"
            color={Colors.Green}
            onClick={onDownloadStart}
            disabled={disableDownload}
          />
        </>
      }
    />
  );
};

export default ModalDownloadXlsx;
