import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import {
  IFilter,
  IFile,
  ISort,
  CellType,
  IPath,
  SheetLayout,
} from "../../../interfaces";
import CellView, { ICell } from "../../../componentsBase/CellView";
import CatchCode, {
  KeyMap,
  IListener,
} from "../../../componentsBase/CatchCode";
import LoadingMask from "../../../componentsBase/LoadingMask";
import Placeholder from "../../../componentsBase/Placeholder";
import isEmpty from "lodash-es/isEmpty";
import last from "lodash-es/last";
import { colorTheme, TYPE_FOLDER } from "../../../constants";
import CellFile, {
  getCellHeader as getCellFileHeader,
  getCellHeight as getCellFileHeight,
} from "./CellFile";
import CellFolder, {
  getCellHeader as getCellFolderHeader,
  getCellHeight as getCellFolderHeight,
} from "./CellFolder";
import ICellItem from "./ICellItem";
import { ACT_VPORT } from "../reducer";
import Sorting from "./Sorting";
import { MAP_TYPE, MAP_UPLOAD_DIRECTORY, getContentActions } from "../actions";
import InputDA from "../../Uploads/BtnUpload/InputDA";
import { isMacintosh, isWindows } from "../../../utils/getNavigatorPlatform";
import isFiltered from "../../FiltersChips/isFiltered";
import { ContextDispatchViewport } from "../contexts";
import Tooltip from "../../../componentsBase/Tooltip";
import { Typography } from "@material-ui/core";

const getCellHeight = (cellType: string) => {
  switch (cellType) {
    case CellType.FOLDER:
      return getCellFolderHeight();
    case CellType.FILE:
      return getCellFileHeight();
    default:
      return 50;
  }
};

const getHeaders = (items: IFile[]) => (cellType) => {
  let totalFolder = 0;
  let totalFile = 0;

  items.forEach(({ mimeType }) => {
    if (mimeType === TYPE_FOLDER) {
      totalFolder = totalFolder + 1;
    } else {
      totalFile = totalFile + 1;
    }
  });

  switch (cellType) {
    case CellType.FOLDER:
      return getCellFolderHeader(totalFolder);
    case CellType.FILE:
      return getCellFileHeader(totalFile);
    default:
      return "";
  }
};

const useStyles = makeStyles({
  content: {
    position: "relative",
    flex: 1,
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
  },
});

interface IFileCell extends IFile {
  cellType: CellType;
}

interface IContent {
  items: IFile[];
  itemsTotal: number;
  itemsIdSelected: string[];
  sort: ISort;
  path: IPath[];
  filters: IFilter[];
  cuttedFile: IFile[];
  cuttedPath: string;
  assetDataId: string;
  detailSheet: SheetLayout;
  loading: boolean;
}

const Content = ({
  items,
  itemsIdSelected,
  sort,
  path,
  filters,
  cuttedFile,
  cuttedPath,
  assetDataId,
  detailSheet,
  loading,
}: IContent) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const classes = useStyles({});
  const filtered = isFiltered(filters);
  const onDeselect = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.ITEMS_DESELECT });
  }, [dispatchViewport]);
  const onSelectAll = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.ITEMS_SELECT_ALL });
  }, [dispatchViewport]);
  const onSelectIndex = React.useCallback(
    (n: number) => {
      if (!isEmpty(itemsIdSelected)) {
        const index = items.findIndex(({ id }) => id === last(itemsIdSelected));
        const newIndex =
          n < 0
            ? Math.max(index + n, 0)
            : Math.min(index + n, items.length - 1);
        const itemId = items[newIndex].id;
        dispatchViewport({ type: ACT_VPORT.ITEMS_SELECT, itemId });
      }
    },
    [dispatchViewport, items, itemsIdSelected]
  );
  const onPressArrowRight = React.useCallback(() => {
    onSelectIndex(+1);
  }, [onSelectIndex]);
  const onPressArrowLeft = React.useCallback(() => {
    onSelectIndex(-1);
  }, [onSelectIndex]);
  const cellRender = React.useCallback(
    (p: ICell) => {
      const { id, cellType } = p.data;
      const focused = detailSheet === SheetLayout.OPENED && assetDataId === id;
      const cuted = !!cuttedFile.find((c) => c.id === id);
      // se c'è una sola cartella selezionata, effettuo il controllo
      // per controlli più sofisticati, da discutere
      const hideActions = (() => {
        const item = items.find((i) => i.id === id);
        return !!item?.publicshares?.find((p) => !p.availability);
      })();
      const cellProp: ICellItem = {
        ...p,
        hideActions,
        focused,
        cuted,
        items,
        itemsIdSelected,
        detailSheet,
        path,
      };
      const cellFragment = (() => {
        switch (cellType) {
          case CellType.FILE:
            return <CellFile {...cellProp} />;
          case CellType.FOLDER:
            return <CellFolder {...cellProp} />;
          default:
            return <div children="- NO_TYPE -" />;
        }
      })();
      return hideActions ? (
        <Tooltip
          title={
            <div>
              <Typography style={{ color: "white" }}>
                This item is currently unavailable.
              </Typography>
              <Typography style={{ color: "white" }}>
                If the item stays unavailable for too long please contact the
                support.
              </Typography>
            </div>
          }
        >
          <div>{cellFragment}</div>
        </Tooltip>
      ) : (
        cellFragment
      );
    },
    [assetDataId, cuttedFile, detailSheet, items, itemsIdSelected, path]
  );
  const onActionClick = React.useCallback(
    (event, id) => {
      const type = MAP_TYPE[id];
      if (type) dispatchViewport({ type });
    },
    [dispatchViewport]
  );
  const getActionChildren = React.useCallback(
    ({ id, onClose }) => {
      if (!Object.keys(MAP_UPLOAD_DIRECTORY).find((f) => f === id)) return null;
      const folder = last(path);
      return (
        <InputDA
          folderId={folder.id}
          onClose={onClose}
          directory={MAP_UPLOAD_DIRECTORY[id]}
        />
      );
    },
    [path]
  );
  const listeners: IListener[] = React.useMemo(() => {
    const l: IListener[] = [
      { toCatch: KeyMap.Escape, onCatch: onDeselect },
      { toCatch: KeyMap.ArrowRight, onCatch: onPressArrowRight },
      { toCatch: KeyMap.ArrowLeft, onCatch: onPressArrowLeft },
    ];

    if (isMacintosh())
      l.push({ toCatch: KeyMap.Meta + "A", onCatch: onSelectAll });

    if (isWindows())
      l.push({ toCatch: KeyMap.Alt + "A", onCatch: onSelectAll });

    return l;
  }, [onDeselect, onPressArrowLeft, onPressArrowRight, onSelectAll]);
  const cellItems: IFileCell[] = React.useMemo(
    () =>
      items.map((data) => ({
        ...data,
        cellType:
          data.mimeType === TYPE_FOLDER ? CellType.FOLDER : CellType.FILE,
      })),
    [items]
  );

  return (
    <CatchCode listeners={listeners}>
      <div className={classes.content}>
        <Sorting sort={sort} />
        <Placeholder
          open={isEmpty(items) && !loading}
          icon={filtered ? "search" : "folder_open"}
          label={filtered ? "NO ITEM FOUND" : "EMPTY FOLDER"}
        />
        <LoadingMask open={loading} />
        <CellView
          cellRender={cellRender}
          items={cellItems}
          cellWidth={180}
          cellHeight={getCellHeight}
          headers={getHeaders(items)}
          colorTheme={colorTheme}
          itemsSelectedId={itemsIdSelected}
          onClick={onDeselect}
          style={{ marginLeft: 15 }}
          onContextMenu={onDeselect}
          contextmenu={getContentActions({
            cuttedFile,
            cuttedPath,
            path,
            onClick: onActionClick,
            getAdditionalChildren: getActionChildren,
          })}
        />
      </div>
    </CatchCode>
  );
};

export default Content;
