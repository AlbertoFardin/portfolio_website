import {
  AdvancedGrid,
  ICellClick,
  IColumnsSets,
  IRenderCellContent,
  SortColumn,
  TypeCell,
} from "../../../componentsBase/StickyGrid";
import mixColors from "../../../componentsBase/utils/mixColors";
import isEmpty from "lodash-es/isEmpty";
import last from "lodash-es/last";
import * as React from "react";
import isEqual from "lodash-es/isEqual";
import {
  colorTheme,
  DEFAULT_WIDTH_COLUMN,
  MAX_COLUMN_SORT,
} from "../../../constants";
import {
  IItemStagingArea,
  IContentSort,
  IHashColumnsSets,
  Severity,
  SheetLayout,
  IItemEs,
} from "../../../interfaces";
import { ACT_VPORT } from "../reducer";
import { ContextSetSnackbar } from "../../contexts";
import getGridItems from "./getGridItems";
import CellUser from "../../AreaProducts/Content/CellUser";
import Typography from "@material-ui/core/Typography";
import * as Colors from "../../../componentsBase/style/Colors";
import searchES from "../searchES";
import Modal from "../../Modal";
import Btn from "../../../componentsBase/Btn";
import { ContextColumns, ContextDispatchViewport } from "../contexts";

const isSortAvailable = async (sort: SortColumn): Promise<boolean> => {
  if (sort) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await searchES({
      size: 0,
      sort: [{ [sort.id]: { order: sort.order } }],
    });
    const stringMatch = "No mapping found for";
    // if single elastic search reason && is no mapping found -> show readable snackBar message
    const rootCause = (res.error && res.error.root_cause) || [];
    if (rootCause.length === 1) {
      const [{ reason = "" }] = rootCause;
      if (reason.startsWith(stringMatch)) {
        console.warn("--> Error - bad request: ", res);
        return false;
      }
    }
  }
  return true;
};

interface IContent {
  items: IItemEs<IItemStagingArea>[];
  itemsIdSelected: string[];
  sortsContent: IContentSort[];
  sortsDefault: IContentSort[];
  sortsLoading: boolean;
  sortsToCheck: IContentSort[];
  hashColumnsSets: IHashColumnsSets;
  assetDataId: string;
  detailSheet: SheetLayout;
  searchStatus: string;
  paginationSize: number;
  paginationValue: number;
  disableRowClick?: boolean;
}

const Content = ({
  items,
  itemsIdSelected,
  sortsDefault,
  sortsContent,
  sortsToCheck,
  sortsLoading,
  hashColumnsSets,
  assetDataId,
  detailSheet,
  searchStatus,
  paginationSize,
  paginationValue,
  disableRowClick,
}: IContent) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const columns = React.useContext(ContextColumns);
  const setSnackbar = React.useContext(ContextSetSnackbar);

  const [modalSortError, setModalSortError] = React.useState(false);
  const loading = searchStatus === "loading";
  const columnsSets = hashColumnsSets.columsnSets;
  const columnsManagementLoading = hashColumnsSets.saving;
  const detailOpen = detailSheet === SheetLayout.OPENED;
  const cbOnListDeselectItems = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.ITEMS_DESELECT });
  }, [dispatchViewport]);
  const onRowCopyToClipboard = React.useCallback(
    (text: string) => {
      const maxLength = 20;
      const textFix =
        text.length > maxLength ? `${text.substr(0, maxLength)}...` : text;
      setSnackbar(Severity.INFO, `"${textFix}" is copied in your clipboard`);
    },
    [setSnackbar]
  );
  const cbCloseModalSortError = React.useCallback(() => {
    setModalSortError(false);
  }, []);
  const onHeaderClick = React.useCallback(
    (newSort: SortColumn[]) => {
      // max columns sorting reached -> error
      if (newSort.length > MAX_COLUMN_SORT) {
        setModalSortError(true);
        return;
      }

      const sortIntersectionFound = newSort.reduce((acc, cur: SortColumn) => {
        const column = columns.find(({ id }) => id === cur.id);
        if (column !== undefined) {
          acc.push({
            id: cur.id,
            order: cur.order,
            label: column.label,
            keyword: column.keyword,
          });
        }
        return acc;
      }, []) as IContentSort[];

      if (sortIntersectionFound.length > 0) {
        // columns found -> apply sort
        dispatchViewport({
          type: ACT_VPORT.SORT_CHECK_LOADING,
          payload: { loading: true, sorts: sortIntersectionFound },
        });
      } else {
        // reset sort
        dispatchViewport({ type: ACT_VPORT.SORTS_CONTENT_SET, payload: [] });
        // if there is a default sorting -> show message
        if (!isEmpty(sortsDefault)) {
          setSnackbar(Severity.INFO, "Default sorting activeted");
        }
      }
    },
    [columns, dispatchViewport, setSnackbar, sortsDefault]
  );

  const onColumnsSetsChange = React.useCallback(
    (newItemsSets: IColumnsSets[]) => {
      dispatchViewport({
        type: ACT_VPORT.HASHSETS_COLUMNS_SET_DRAFT,
        columnsSetsDraft: newItemsSets,
      });
    },
    [dispatchViewport]
  );

  const gridColumns = React.useMemo(() => {
    return columns.map((col) => ({
      ...col,
      groupId: col.groupId || "DEFAULT",
      width: col.width || DEFAULT_WIDTH_COLUMN,
    }));
  }, [columns]);
  const gridItems = React.useMemo(() => getGridItems(items, columns), [
    columns,
    items,
  ]);
  const gridSort =
    sortsContent && sortsContent.length > 0 ? sortsContent : sortsDefault;
  const onRowClick = React.useCallback(
    ({ rowIndex, selected, keyCtrlDown, keyShiftDown }: ICellClick) => {
      if (disableRowClick) return null;

      dispatchViewport({
        type: ACT_VPORT.ROW_ITEM_CLICK,
        rowIndex,
        selected,
        keyCtrlDown,
        keyShiftDown,
      });
    },
    [disableRowClick, dispatchViewport]
  );
  const rows = React.useMemo(
    () =>
      gridItems.map((item) => {
        const selected = new Set(itemsIdSelected).has(item.id);
        return {
          id: item.id,
          focused: selected && detailOpen && assetDataId === item.id,
          selected,
          data: item.data,
        };
      }),
    [gridItems, itemsIdSelected, detailOpen, assetDataId]
  );
  const renderCellContent = React.useCallback(
    (p: IRenderCellContent) => {
      const { rowIndex, columnData } = p;

      if (columnData.type === TypeCell.User) {
        const rowData = rows[rowIndex].data;
        const value = rowData[columnData.id];
        return <CellUser {...p} value={value} />;
      }

      return null;
    },
    [rows]
  );
  const headerBackgroundColor = isEqual(gridSort, sortsDefault)
    ? "#fff"
    : mixColors(0.15, "#fff", colorTheme);
  const resetGridScrollbar = React.useMemo(() => {
    const needReset = !!paginationValue && !!paginationSize;
    return needReset ? new Date().getTime() : null;
  }, [paginationSize, paginationValue]);

  React.useEffect(() => {
    const keydownHandle = (event) => {
      const k = event.keyCode;
      // press ESC
      if (k === 27) cbOnListDeselectItems();
    };

    window.addEventListener("keydown", keydownHandle);
    return () => {
      window.removeEventListener("keydown", keydownHandle);
    };
  }, [cbOnListDeselectItems]);

  // check if ES know the last column selected
  React.useEffect(() => {
    if (sortsLoading === true) {
      (async () => {
        const sortAvailable = await isSortAvailable(last(sortsToCheck));
        if (sortAvailable) {
          dispatchViewport({
            type: ACT_VPORT.SORTS_CONTENT_SET,
            payload: sortsToCheck,
          });
        } else {
          dispatchViewport({
            type: ACT_VPORT.SORT_CHECK_LOADING,
            payload: { loading: false, sorts: [] },
          });
          setSnackbar(
            Severity.INFO,
            "Sorry, you can’t sort by this column because there are no values"
          );
        }
      })();
    }
  }, [dispatchViewport, setSnackbar, sortsLoading, sortsToCheck]);

  if (isEmpty(columnsSets)) return <div style={{ flex: 1 }} />;

  return (
    <>
      <AdvancedGrid
        columnsSets={columnsSets}
        renderCellContent={renderCellContent}
        rootLoading={loading || columnsManagementLoading || sortsLoading}
        sidebarWidth={50}
        enabledColumnsMove
        enabledColumnsMultiSort
        enabledColumnsResize
        enabledColumnsRemove
        columns={gridColumns}
        onColumnsSetsChange={onColumnsSetsChange}
        columnsSort={gridSort}
        onRowClick={onRowClick}
        onRowCopyToClipboard={onRowCopyToClipboard}
        onHeaderClick={onHeaderClick}
        headerBackgroundColor={headerBackgroundColor}
        rows={rows}
        resetScrollbar={resetGridScrollbar}
      />
      <Modal
        open={modalSortError}
        onClose={cbCloseModalSortError}
        title="Sorting"
        content={
          <>
            <Typography
              variant="body1"
              children={`You can sort up to ${MAX_COLUMN_SORT} columns`}
            />
            <Typography
              variant="body1"
              children="If you want to sort by this column please remove sorting from at least one column"
            />
          </>
        }
        actions={
          <>
            <div style={{ flex: 1 }} />
            <Btn
              variant="bold"
              color={Colors.Green}
              label="I UNDERSTAND"
              onClick={cbCloseModalSortError}
            />
          </>
        }
      />
    </>
  );
};

export default React.memo(Content);
