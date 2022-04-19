import * as React from "react";
import { FixedSizeGrid } from "react-window";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Thumb from "./Thumb";
import { getThumbSize, getThumbMargin } from "./utils";
import Cell from "../../Cell/Cell";
import { ICellClick, IThumbnail } from "../../interfaces";
import isEqual from "lodash-es/isEqual";
import { IActions } from "../../../ActionsMenu";
import { columnsPadding } from "../../statics";

const useStyles = makeStyles({
  cellThumbnails: {
    "overflow-y": "hidden",
    "border-right": "1px solid transparent",
    "border-left": "1px solid transparent",
    "box-sizing": "border-box",
    "&:hover": {
      "border-color": "#eee",
    },
  },
});

interface ICellThumbnails {
  value: IThumbnail[];
  columnIndex: number;
  rowIndex: number;
  selected: boolean;
  focused: boolean;
  style: React.CSSProperties;
  onClick: (p: ICellClick) => void;
  onDoubleClick: (p: ICellClick) => void;
  onContextMenu: (p: ICellClick) => void;
  contextmenu: IActions[];
  thumbnailSize?: number;
}

export const CellThumbnails = ({
  value,
  columnIndex,
  rowIndex,
  selected,
  focused,
  style,
  onClick,
  onDoubleClick,
  onContextMenu,
  contextmenu,
  thumbnailSize,
}: ICellThumbnails) => {
  const classes = useStyles({});
  const height = Number(style.height) || 0;
  const width = (Number(style.width) || 0) - columnsPadding * 2;
  const thumbSize = thumbnailSize || getThumbSize(height);
  const thumbFixedSized = !!thumbnailSize;
  const thumbMargin = getThumbMargin(height);

  return (
    <Cell
      rowIndex={rowIndex}
      columnIndex={columnIndex}
      selected={selected}
      focused={focused}
      style={style}
      contextmenu={contextmenu}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      <FixedSizeGrid
        className={classes.cellThumbnails}
        columnCount={value.length}
        columnWidth={thumbSize + thumbMargin * 2}
        height={height}
        width={width}
        rowCount={1}
        rowHeight={height - 10}
        itemData={{
          columnIndex,
          rowIndex,
          thumbs: value,
          thumbSize,
          thumbFixedSized,
          thumbMargin,
          selected,
          focused,
          onClick,
          onDoubleClick,
        }}
        children={Thumb}
      />
    </Cell>
  );
};

export default React.memo(CellThumbnails, isEqual);
