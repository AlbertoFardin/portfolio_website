import * as React from "react";
import Cell from "../../Cell/Cell";
import ChipCategory, { ICategory } from "../../../ChipCategory";
import { ICellClick } from "../../interfaces";
import { IActions } from "../../../ActionsMenu";

const styleContent: React.CSSProperties = {
  flex: 1,
  position: "relative",
  display: "inline-flex",
  flexDirection: "row",
  overflow: "auto",
  height: "inherit",
  alignItems: "center",
};

interface ICellCategory {
  value: ICategory[];
  rowIndex: number;
  columnIndex: number;
  selected: boolean;
  focused: boolean;
  style: React.CSSProperties;
  onClick: (p: ICellClick) => void;
  onDoubleClick: (p: ICellClick) => void;
  onContextMenu: (p: ICellClick) => void;
  contextmenu: IActions[];
}

const CellCategory = ({
  value,
  rowIndex,
  columnIndex,
  selected,
  focused,
  style,
  onClick,
  onDoubleClick,
  onContextMenu,
  contextmenu,
}: ICellCategory) => {
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
      <div style={styleContent}>
        {(value || []).map((c) => (
          <ChipCategory key={c.id} {...c} />
        ))}
      </div>
    </Cell>
  );
};

export default React.memo(CellCategory);
