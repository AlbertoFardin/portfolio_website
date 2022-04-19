import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import { CellType, IFileDetail, ISort } from "../../../interfaces";
import CellView, { ICell } from "../../../componentsBase/CellView";
import LoadingMask from "../../../componentsBase/LoadingMask";
import Placeholder from "../../../componentsBase/Placeholder";
import isEmpty from "lodash-es/isEmpty";
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
import { ACTION } from "../reducer";
import Sorting from "./Sorting";
import { isMacintosh, isWindows } from "../../../utils/getNavigatorPlatform";
import { last } from "lodash-es";

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

const getHeaders = (items: IFileDetail[]) => (cellType) => {
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

interface IContent {
  dispatch: React.Dispatch<unknown>;
  keyboardDown: number;
  items: IFileDetail[];
  itemsTotal: number;
  itemsIdSelected: string[];
  itemLastSelectedIndex: number;
  sort: ISort;
  searchStatus: string;
  assetDataId: string;
  detailOpen: boolean;
}

const Content = ({
  dispatch,
  keyboardDown,
  items,
  itemsIdSelected,
  itemLastSelectedIndex,
  sort,
  searchStatus,
  assetDataId,
  detailOpen,
}: IContent) => {
  const classes = useStyles({});
  const loading = searchStatus === "loading";
  const onDeselect = React.useCallback(() => {
    dispatch({ type: ACTION.ITEMS_DESELECT });
  }, [dispatch]);
  const onSelectAll = React.useCallback(() => {
    const ids = items.map(({ id }) => id);
    dispatch({
      type: ACTION.ITEMS_SELECT,
      itemsIdSelected: ids,
      assetDataId: last(ids),
    });
  }, [dispatch, items]);
  const onSelectNextItem = React.useCallback(
    (n: number) => {
      const index = items.findIndex(({ id }) => id === last(itemsIdSelected));
      const newIndex =
        n < 0 ? Math.max(index + n, 0) : Math.min(index + n, items.length - 1);
      const newId = items[newIndex].id;
      dispatch({
        type: ACTION.ITEMS_SELECT,
        itemsIdSelected: [newId],
        assetDataId: newId,
      });
    },
    [dispatch, items, itemsIdSelected]
  );
  const cellRender = React.useCallback(
    (p: ICell) => {
      const { id, cellType } = p.data;
      const focused = detailOpen && assetDataId === id;
      const cellProp: ICellItem = {
        ...p,
        dispatch,
        focused,
        items,
        itemsIdSelected,
        itemLastSelectedIndex,
        detailOpen,
      };
      switch (cellType) {
        case CellType.FILE:
          return <CellFile {...cellProp} />;
        case CellType.FOLDER:
          return <CellFolder {...cellProp} />;
        default:
          return <div children="- NO_TYPE -" />;
      }
    },
    [
      dispatch,
      assetDataId,
      detailOpen,
      itemLastSelectedIndex,
      items,
      itemsIdSelected,
    ]
  );
  const itemsCell = React.useMemo(
    () =>
      items.map((item) => ({
        ...item,
        cellType:
          item.mimeType === TYPE_FOLDER ? CellType.FOLDER : CellType.FILE,
      })),
    [items]
  );

  React.useEffect(() => {
    const keydownHandle = (event) => {
      if (document.activeElement === document.body) {
        const key = event.keyCode;
        // press ESC
        if (key === 27 && !isEmpty(itemsIdSelected)) onDeselect();
        // press cmd + A
        if (keyboardDown === 91 && key === 65 && isMacintosh()) onSelectAll();
        // press ctrl + A
        if (keyboardDown === 17 && key === 65 && isWindows()) onSelectAll();
        // press →
        if (key === 39 && !isEmpty(itemsIdSelected)) onSelectNextItem(1);
        // press ←
        if (key === 37 && !isEmpty(itemsIdSelected)) onSelectNextItem(-1);
        //
        dispatch({ type: ACTION.KEYBOARD_DOWN, key });
      }
    };

    window.addEventListener("keydown", keydownHandle);
    return () => {
      window.removeEventListener("keydown", keydownHandle);
    };
  }, [
    dispatch,
    itemsIdSelected,
    keyboardDown,
    onDeselect,
    onSelectAll,
    onSelectNextItem,
  ]);

  return (
    <div className={classes.content}>
      <Sorting dispatch={dispatch} sort={sort} />
      {isEmpty(items) && !loading ? (
        <Placeholder icon={"folder_open"} label={"EMPTY FOLDER"} />
      ) : null}
      <LoadingMask open={loading} />
      <CellView
        cellRender={cellRender}
        items={itemsCell}
        cellWidth={180}
        cellHeight={getCellHeight}
        headers={getHeaders(items)}
        colorTheme={colorTheme}
        itemsSelectedId={itemsIdSelected}
        onClick={onDeselect}
        style={{ marginLeft: 15 }}
      />
    </div>
  );
};

export default Content;
