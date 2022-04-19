import * as React from "react";
import Btn from "../../../componentsBase/Btn";
import isEmpty from "lodash-es/isEmpty";
import * as moment from "moment";
import { exportData } from "../../../api/fetchesApi";
import { Severity } from "../../../interfaces";
import { ACTION_MAIN } from "../../reducer";
import {
  getColumnsForExportData,
  exportExcelColumnsLimit,
  generateFileName,
  prepareDataForExportExcel,
} from "../../../utils/exportExcel";
import ModalMediasArchiver from "../ModalMediasArchiver";
import { IColumnsSets } from "../../../componentsBase/StickyGrid";
import {
  ContextDispatchMain,
  ContextPermissions,
  ContextSetSnackbar,
} from "../../contexts";
import { IActions } from "../../../componentsBase/ActionsMenu";
import permissionsCheck from "../../../utils/permissionsCheck";
import PERMISSIONS from "../../../permissions";
import {
  MAX_PRODUCTS_MASSIVE_ACTIONS,
  MAX_PRODUCTS_SELECTABLE,
} from "../../../constants";
import { ContextColumns } from "../contexts";
import ModalDownloadXlsx from "../ModalDownloadXlsx";

const idMedias = "idMedias";
const idXlsxCurrent = "idXlsxCurrent";
const idXlsxTmpl = "idXlsxTmpl";
const downloadError = "Unable to download XLSX, please refresh and retry";

interface IBtnDownloads {
  columnsSets: IColumnsSets[];
  itemsIdSelected: string[];
  catalogId: string;
  languageId: string;
}

const BtnDownloads = ({
  columnsSets = [],
  itemsIdSelected = [],
  catalogId,
  languageId,
}: IBtnDownloads) => {
  const dispatchMain = React.useContext(ContextDispatchMain);
  const columns = React.useContext(ContextColumns);
  const setSnackbar = React.useContext(ContextSetSnackbar);
  const permissions = React.useContext(ContextPermissions);

  const [modalArchiverMedia, setModalArchiverMedia] = React.useState(false);
  const [modalDownloadTempl, setModalDownloadTempl] = React.useState(false);
  const [clickId, setClickId] = React.useState("");

  const columnsSet = columnsSets.find(({ active }) => active);
  const columnsExportData = getColumnsForExportData(columns, columnsSet);
  const disabledDownloadXlsx =
    isEmpty(columnsExportData) ||
    columnsExportData.length > exportExcelColumnsLimit ||
    itemsIdSelected.length > MAX_PRODUCTS_SELECTABLE;

  const onClick = React.useCallback((event, id) => {
    setClickId(id);
  }, []);
  const onModalArchiverMedia = React.useCallback(() => {
    setModalArchiverMedia(!modalArchiverMedia);
  }, [modalArchiverMedia]);
  const onModalDownloadTempl = React.useCallback(() => {
    setModalDownloadTempl(!modalDownloadTempl);
  }, [modalDownloadTempl]);

  const menuItems: IActions[] = React.useMemo(() => {
    const actions: IActions[] = [];

    const noSelected = itemsIdSelected.length === 0;
    if (
      permissionsCheck({
        keys: [PERMISSIONS.seecommerce_download],
        permissions,
      }) &&
      !noSelected
    ) {
      actions.push({
        id: idMedias,
        label: "Media",
        icon: "image",
        onClick: onModalArchiverMedia,
        disabled:
          !!clickId || itemsIdSelected.length > MAX_PRODUCTS_MASSIVE_ACTIONS,
      });
    }

    if (
      permissionsCheck({
        keys: [PERMISSIONS.secommerce_export_xls],
        permissions,
      })
    ) {
      if (!noSelected) {
        actions.push({
          id: idXlsxCurrent,
          label: "XLSX Current Columns",
          icon: "list_alt",
          onClick: onClick,
          disabled: disabledDownloadXlsx,
        });
      }
      actions.push({
        id: idXlsxTmpl,
        label: "XLSX Template",
        icon: "list_alt",
        onClick: onModalDownloadTempl,
      });
    }

    return actions;
  }, [
    clickId,
    disabledDownloadXlsx,
    itemsIdSelected.length,
    onClick,
    onModalArchiverMedia,
    onModalDownloadTempl,
    permissions,
  ]);

  // download XLSX current columns
  React.useEffect(() => {
    if (clickId === idXlsxCurrent) {
      (async () => {
        try {
          setClickId("");
          const now = moment();
          const filename = generateFileName(now);
          dispatchMain({
            type: ACTION_MAIN.DOWNLOADS_TO_ADD,
            payload: {
              correlationId: filename,
              filename,
            },
          });
          const { headers, rows } = await prepareDataForExportExcel(
            itemsIdSelected,
            columnsExportData,
            catalogId,
            languageId
          );
          const { url } = await exportData({
            headers,
            rows,
            fileName: filename,
          });
          dispatchMain({
            type: ACTION_MAIN.DOWNLOADS_FINISH,
            payload: {
              correlationId: filename,
              filename,
              message: url,
            },
          });
        } catch (err) {
          console.warn("-> BtnDownloads:", err);
          setSnackbar(Severity.WARNING, downloadError);
        }
      })();
    }
  }, [
    catalogId,
    clickId,
    columnsExportData,
    dispatchMain,
    itemsIdSelected,
    languageId,
    setSnackbar,
  ]);

  if (isEmpty(menuItems)) return null;

  return (
    <>
      <Btn
        icon="file_download"
        tooltip="Downloads"
        disabled={!!clickId}
        menu={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          items: menuItems,
          title: "Download",
        }}
      />
      <ModalMediasArchiver
        open={modalArchiverMedia}
        itemsIdSelected={itemsIdSelected}
        onClose={onModalArchiverMedia}
      />
      <ModalDownloadXlsx
        open={modalDownloadTempl}
        itemsIdSelected={itemsIdSelected}
        onClose={onModalDownloadTempl}
      />
    </>
  );
};

export default BtnDownloads;
