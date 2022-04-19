import Icon from "@material-ui/core/Icon";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Cell from "../../Cell/Cell";
import { ICellClick } from "../../interfaces";
import { IActions } from "../../../ActionsMenu";

const useStyles = makeStyles(({ palette }) => ({
  cellIcon: {
    display: "flex",
  },
  icon: {
    "font-size": "18px !important",
    "line-height": "18px",
    cursor: "pointer",
    color: palette.primary.main,
  },
}));

interface ICellIcon {
  value: string;
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

const CellIcon = ({
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
}: ICellIcon) => {
  const classes = useStyles({});
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
      <div className={classes.cellIcon}>
        <Icon className={classes.icon} children={value} />
      </div>
    </Cell>
  );
};

export default React.memo(CellIcon);
