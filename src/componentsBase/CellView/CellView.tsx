import classnames from "classnames";
import * as React from "react";
import { VariableSizeGrid } from "react-window";
import makeStyles from "@material-ui/core/styles/makeStyles";
import isEmpty from "lodash-es/isEmpty";
import ActionsMenu from "../ActionsMenu";
import { emptyFn } from "../utils/common";
import CellRender from "./CellRender";
import {
  cellHeightDefault,
  getkeyRender,
  getRowCount,
  itemCountInRow,
  prepareItems,
} from "./utils";
import AutoSizer from "../Autosizer";
import { ICellView } from ".";

const useStyles = makeStyles({
  cellview: {
    flex: 1,
    position: "relative",
    display: "flex",
    "flex-direction": "row",
    height: "100%",
    "align-items": "stretch",
    "min-height": 50,
  },
});

const CellView = ({
  cellHeight,
  cellRender,
  cellWidth,
  className,
  colorTheme,
  contextmenu = [],
  headers,
  items,
  itemsSelectedId = [],
  onClick = emptyFn,
  onContextMenu = emptyFn,
  style,
}: ICellView) => {
  const classes = useStyles({});
  const [keyRender, setKeyRender] = React.useState("");
  const [resizing, setResizing] = React.useState(false);
  const [columnCount, setColumnCount] = React.useState(0);
  const [contextmenuX, setContextmenuX] = React.useState(0);
  const [contextmenuY, setContextmenuY] = React.useState(0);
  const itemsP = prepareItems({
    items,
    headers,
    columnCount,
  });
  const rowCount = getRowCount({
    itemsCount: itemsP.length,
    columnCount,
  });
  const itemData = {
    colorTheme,
    cellRender,
    cellWidth,
    cellHeight,
    itemsSelectedId,
    columnCount,
    items: itemsP,
  };
  const resizeGrid = React.useCallback(
    ({ height, width }) => {
      setResizing(true);
      if (!!height && !!width) {
        const listWidth = width;
        const columnCountNew = itemCountInRow({
          listWidth,
          cellWidth,
        });
        setColumnCount(columnCountNew);
        setResizing(false);
      }
    },
    [cellWidth]
  );
  const rowHeight = React.useCallback(
    (rowIndex) => {
      const firstIndexInRowItems = columnCount * (rowIndex + 1) - columnCount;
      const { cellType } = itemsP[firstIndexInRowItems];
      return cellHeight(cellType) || cellHeightDefault;
    },
    [cellHeight, columnCount, itemsP]
  );
  const columnWidth = React.useCallback(() => cellWidth, [cellWidth]);
  const actionmenuOnClose = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setContextmenuY(0);
      setContextmenuX(0);
    },
    []
  );
  const cellviewOnContextMenu = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (!isEmpty(contextmenu)) {
        setContextmenuX(event.clientX);
        setContextmenuY(event.clientY);
      }
      onContextMenu(event);
    },
    [contextmenu, onContextMenu]
  );
  const cellviewOnClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      onClick(event);
    },
    [onClick]
  );
  const cellviewRef = React.useCallback(
    (element) => {
      if (element && resizing) resizeGrid(element.getBoundingClientRect());
    },
    [resizeGrid, resizing]
  );

  React.useEffect(() => {
    if (getkeyRender(items) !== keyRender) {
      setKeyRender(getkeyRender(items));
      setResizing(true);
    }
  }, [items, keyRender]);

  return (
    <div
      role="presentation"
      ref={cellviewRef}
      className={classnames({
        [classes.cellview]: true,
        [className]: !!className,
      })}
      style={style}
      onContextMenu={cellviewOnContextMenu}
      onClick={cellviewOnClick}
    >
      <AutoSizer onResize={resizeGrid}>
        {({ width, height }) =>
          resizing || !width || !height ? null : (
            <VariableSizeGrid
              itemData={itemData}
              columnCount={columnCount}
              columnWidth={columnWidth}
              height={height}
              rowCount={rowCount}
              rowHeight={rowHeight}
              width={width}
              children={CellRender}
            />
          )
        }
      </AutoSizer>
      <ActionsMenu
        open={!!contextmenuX && !!contextmenuY}
        onClose={actionmenuOnClose}
        anchorReference="anchorPosition"
        anchorPosition={{
          top: contextmenuY,
          left: contextmenuX,
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        actions={contextmenu}
      />
    </div>
  );
};

export default CellView;
