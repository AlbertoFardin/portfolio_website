import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {
  AdvancedGrid,
  ICellClick,
  IRenderCellContent,
  IColumnsSets,
  SortColumn,
  TypeCell,
} from "../../../componentsBase/StickyGrid";
import isEmpty from "lodash-es/isEmpty";
import {
  DEFAULT_WIDTH_COLUMN,
  KEY_ENTITY_STRUCTURE_ID,
  KEY_MEDIA,
  MAX_COLUMN_SORT,
} from "../../../constants";
import {
  IProduct,
  IContentSort,
  IColumnSc,
  IHashColumnsSets,
  Severity,
  SheetLayout,
  AttributeFamily,
} from "../../../interfaces";
import { ACT_VPORT } from "../reducer";
import { ContextUsers, ContextSetSnackbar, ContextM2ms } from "../../contexts";
import getGridItems from "./getGridItems";
import CellUser from "./CellUser";
import * as Colors from "../../../componentsBase/style/Colors";
import Btn, { IBtn } from "../../../componentsBase/Btn";
import Typography from "@material-ui/core/Typography";
import { useHistory, useLocation } from "react-router-dom";
import getSearchString from "../getSearchString";
import CellSidebar from "./CellSidebar";
import fnDecorateCellThumbnails from "./decorateCellThumbnails";
import fnDecorateCellCategories from "./decorateCellCategories";
import Modal from "../../Modal";
import CatchCode, {
  KeyMap,
  IListener,
} from "../../../componentsBase/CatchCode";
import getAttributeKey from "../getAttributeKey";
import {
  ContextCatalogs,
  ContextCategories,
  ContextColumns,
  ContextDispatchViewport,
} from "../contexts";

const ERR_NO_CATA = "ERR_NO_CATA";
const ERR_NO_LANG = "ERR_NO_LANG";
const ERR_NO_VALUED = "ERR_NO_VALUED";
const ERR_NO_ASSOCIATED_CATA = "ERR_NO_ASSOCIATED_CATA";
const ERR_NO_ASSOCIATED_ITEM = "ERR_NO_ASSOCIATED_ITEM";
const mapError: { [err: string]: IBtn } = {
  [ERR_NO_CATA]: {
    variant: "bold",
    label: "?",
    tooltip: "Select catalog",
  },
  [ERR_NO_LANG]: {
    variant: "bold",
    label: "?",
    tooltip: "Select catalog and language",
  },
  [ERR_NO_VALUED]: {
    variant: "light",
    label: "-",
    tooltip: "Attribute not valued",
  },
  [ERR_NO_ASSOCIATED_CATA]: {
    variant: "light",
    label: "✖️",
    tooltip: "Attribute not associated to selected catalog",
  },
  [ERR_NO_ASSOCIATED_ITEM]: {
    variant: "light",
    label: "✖️",
    tooltip: "Attribute not associated to this item",
  },
};

const useStyles = makeStyles({
  content: {
    flex: 1,
    position: "relative",
    display: "flex",
    "flex-direction": "row",
  },
});
const getColumnSortable = (
  c: IColumnSc,
  catalogId: string,
  languageId: string
): boolean => {
  if (c.multiCatalog) {
    // non posso ordinare una colonna multiCatalog se non ho catalogId
    if (!catalogId) return false;
    // non posso ordinare una colonna multiLanguage se non ho languageId
    if (c.multiLanguage && !languageId) return false;
  }

  return c.sortable;
};

interface IContent {
  gridShowMediaReady: boolean;
  items: IProduct[];
  itemsIdSelected: string[];
  catalogId: string;
  languageId: string;
  sortsContent: IContentSort[];
  sortsDefault: IContentSort[];
  sortsLoading: boolean;
  hashColumnsSets: IHashColumnsSets;
  assetDataId: string;
  detailSheet: SheetLayout;
  detailTabId: string;
  detailImgId: string;
  searchStatus: string;
  paginationSize: number;
  paginationValue: number;
}

const Content = ({
  gridShowMediaReady,
  items,
  itemsIdSelected,
  catalogId,
  languageId,
  sortsDefault,
  sortsContent,
  sortsLoading,
  hashColumnsSets,
  assetDataId,
  detailSheet,
  detailTabId,
  detailImgId,
  searchStatus,
  paginationSize,
  paginationValue,
}: IContent) => {
  const classes = useStyles();
  const history = useHistory();
  const searchLocation = useLocation().search;
  const [modalSortError, setModalSortError] = React.useState(false);

  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const setSnackbar = React.useContext(ContextSetSnackbar);
  const m2ms = React.useContext(ContextM2ms);
  const users = React.useContext(ContextUsers);
  const columns = React.useContext(ContextColumns);
  const catalogs = React.useContext(ContextCatalogs);
  const categories = React.useContext(ContextCategories);

  const loading = searchStatus === "loading";
  const columnsSets = hashColumnsSets.columsnSets;
  const columnsManagementLoading = hashColumnsSets.saving;
  const onDeselect = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.ITEMS_DESELECT });
  }, [dispatchViewport]);

  const decorateCellThumbnails = React.useCallback(
    (item: IProduct, attributeKey: string) =>
      fnDecorateCellThumbnails({
        dispatch: dispatchViewport,
        item,
        attributeKey,
        m2ms,
        gridShowMediaReady,
        users,
        tenantCatalogs: catalogs,
        assetDataId,
        detailTabId,
        detailImgId,
        detailSheet,
      }),
    [
      assetDataId,
      catalogs,
      detailImgId,
      detailSheet,
      detailTabId,
      dispatchViewport,
      gridShowMediaReady,
      m2ms,
      users,
    ]
  );
  const decorateCellCategories = React.useCallback(
    (item: IProduct, attributeKey: string) =>
      fnDecorateCellCategories({
        item,
        attributeKey,
        categories,
        catalogId,
        languageId,
      }),
    [catalogId, categories, languageId]
  );
  const onRowCopyToClipboard = React.useCallback(
    (text: string) => {
      const maxLength = 20;
      const textFix =
        text.length > maxLength ? `${text.substr(0, maxLength)}...` : text;
      setSnackbar(Severity.INFO, `"${textFix}" is copied in your clipboard`);
    },
    [setSnackbar]
  );
  const onCloseModalSortError = React.useCallback(() => {
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
      }
    },
    [columns, dispatchViewport]
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
    return columns.map((c) => ({
      ...c,
      groupId: c.attributeFamily,
      width: c.width || DEFAULT_WIDTH_COLUMN,
      sortable: getColumnSortable(c, catalogId, languageId),
    }));
  }, [catalogId, columns, languageId]);
  const gridItems = React.useMemo(() => {
    return getGridItems({
      items,
      columns,
      catalogId,
      languageId,
      decorateCellThumbnails,
      decorateCellCategories,
    });
  }, [
    catalogId,
    columns,
    decorateCellCategories,
    decorateCellThumbnails,
    items,
    languageId,
  ]);
  const gridSort =
    sortsContent && sortsContent.length > 0 ? sortsContent : sortsDefault;
  const onRowDoubleClick = React.useCallback(
    ({ thumbId }: ICellClick) => {
      history.push(
        getSearchString(
          thumbId
            ? {
                entityId: assetDataId,
                detailSheet: SheetLayout.FULLSCREEN,
                detailTabId: AttributeFamily.MEDIA,
                detailImgId: thumbId,
              }
            : {
                entityId: assetDataId,
                detailSheet: SheetLayout.OPENED,
              },
          searchLocation
        )
      );
    },
    [assetDataId, history, searchLocation]
  );

  const onRowClick = React.useCallback(
    ({
      rowIndex,
      thumbId,
      selected,
      keyCtrlDown,
      keyShiftDown,
    }: ICellClick) => {
      const rowData = items[rowIndex];

      history.push(
        getSearchString(
          {
            entityId: rowData.id,
            detailImgId: thumbId,
          },
          searchLocation
        )
      );

      dispatchViewport({
        type: ACT_VPORT.ROW_ITEM_CLICK,
        rowIndex,
        selected,
        keyCtrlDown,
        keyShiftDown,
      });
    },
    [dispatchViewport, history, items, searchLocation]
  );

  const rows = React.useMemo(
    () =>
      gridItems.map((item) => ({
        id: item.id,
        selected: new Set(itemsIdSelected).has(item.id),
        data: item,
      })),
    [gridItems, itemsIdSelected]
  );
  const renderCellContent = React.useCallback(
    (p: IRenderCellContent) => {
      const { rowIndex, columnData } = p;

      if (columnData.type === TypeCell.User) {
        const rowData = rows[rowIndex].data;
        const attributeKey = getAttributeKey(columnData, catalogId, languageId);
        const value = rowData[attributeKey];
        return <CellUser {...p} value={value} />;
      }

      return null;
    },
    [rows, catalogId, languageId]
  );
  const listeners: IListener[] = React.useMemo(() => {
    const l: IListener[] = [{ toCatch: KeyMap.Escape, onCatch: onDeselect }];
    return l;
  }, [onDeselect]);
  const resetGridScrollbar = React.useMemo(() => {
    const needReset = !!paginationValue && !!paginationSize;
    return needReset ? new Date().getTime() : null;
  }, [paginationSize, paginationValue]);
  const getCellValue = React.useCallback(
    (rowData, column: IColumnSc) => {
      const { entityStructureId, multiCatalog, multiLanguage, scope } = column;

      const noEvaluable =
        !!entityStructureId &&
        rowData[KEY_ENTITY_STRUCTURE_ID] !== entityStructureId;
      if (noEvaluable) return ERR_NO_ASSOCIATED_ITEM;

      if (multiCatalog && !catalogId) return ERR_NO_CATA;
      if (multiLanguage && !languageId) return ERR_NO_LANG;

      const setScope = new Set(scope || []);
      const attributoNonInScope = !!setScope.size && !setScope.has(catalogId);
      if (attributoNonInScope) return ERR_NO_ASSOCIATED_CATA;

      const value = rowData[getAttributeKey(column, catalogId, languageId)];
      if (value == null) return ERR_NO_VALUED;

      return value;
    },
    [catalogId, languageId]
  );

  const rowHeight = React.useCallback(() => {
    const setActive = columnsSets.find((c) => c.active);
    if (setActive) {
      if (setActive.items.find((i) => i.id === KEY_MEDIA)) return 160;
    }
    return 60;
  }, [columnsSets]);

  if (isEmpty(columnsSets)) return <div style={{ flex: 1 }} />;

  return (
    <div className={classes.content}>
      <CatchCode listeners={listeners}>
        <AdvancedGrid
          columnsSets={columnsSets}
          renderCellSidebar={CellSidebar}
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
          onRowDoubleClick={onRowDoubleClick}
          onRowCopyToClipboard={onRowCopyToClipboard}
          onHeaderClick={onHeaderClick}
          rows={rows}
          resetScrollbar={resetGridScrollbar}
          rowHeight={rowHeight}
          getCellValue={getCellValue}
          mapError={mapError}
        />
      </CatchCode>
      <Modal
        open={modalSortError}
        onClose={onCloseModalSortError}
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
              onClick={onCloseModalSortError}
            />
          </>
        }
      />
    </div>
  );
};

export default React.memo(Content);
