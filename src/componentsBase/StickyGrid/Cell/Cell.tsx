import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { columnsPadding } from "../statics";
import { ICellClick } from "../interfaces";
import ActionsMenu, { IActions } from "../../ActionsMenu";
import isEmpty from "lodash-es/isEmpty";
import classnames from "classnames";
import mixColors from "../../utils/mixColors";
import { emptyFn } from "../../utils/common";

interface IStyles {
  selected: boolean;
  focused: boolean;
  rowIndex: number;
}
const useStyles = makeStyles(({ palette }) => {
  const colorMain = palette.primary.main;
  return {
    cell: {
      position: "absolute",
      "justify-content": "center",
      cursor: "pointer",
      "flex-direction": "row",
      "align-items": "center",
      "vertical-align": "middle",
      overflow: "hidden",
      padding: `0 ${columnsPadding}px`,
      "box-sizing": "border-box",
      display: "flex",
      "border-top": "1px solid #fff",
      "border-bottom": "1px solid #fff",
      "border-color": ({ focused }: IStyles) =>
        focused ? colorMain : "transparent",
      backgroundColor: ({ rowIndex, selected }: IStyles) => {
        if (selected) return mixColors(0.8, colorMain, "#ffffff");
        return rowIndex % 2 === 0 ? "#fafafa" : "#ffffff";
      },
    },
  };
});

interface IMenu {
  top: number;
  left: number;
}
const menuDefault: IMenu = {
  top: 0,
  left: 0,
};

interface ICell {
  rowIndex: number;
  columnIndex: number;
  selected: boolean;
  focused: boolean;
  style?: React.CSSProperties;
  className?: string;
  onClick?: (p: ICellClick) => void;
  onDoubleClick?: (p: ICellClick) => void;
  onContextMenu?: (p: ICellClick) => void;
  contextmenu?: IActions[];
  children: JSX.Element | React.ReactNode;
}

const Cell = ({
  style,
  className,
  rowIndex,
  columnIndex,
  selected,
  focused,
  onClick = emptyFn,
  onDoubleClick = emptyFn,
  onContextMenu = emptyFn,
  contextmenu = [],
  children = emptyFn,
}: ICell) => {
  const [menu, setMenu] = React.useState(menuDefault as IMenu);
  const classes = useStyles({
    selected,
    focused,
    rowIndex,
  });
  const cbOnClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      const ctrlDown = event.ctrlKey || event.metaKey;
      const { shiftKey } = event;
      const clickProps: ICellClick = {
        columnIndex,
        rowIndex,
        selected,
        focused,
        keyCtrlDown: ctrlDown,
        keyShiftDown: shiftKey,
      };
      if (event.detail === 1) {
        onClick(clickProps);
      } else {
        onDoubleClick(clickProps);
      }
    },
    [columnIndex, focused, onClick, onDoubleClick, rowIndex, selected]
  );
  const cbOnContextMenu = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!isEmpty(contextmenu)) {
        event.preventDefault();
        event.stopPropagation();
        const ctrlDown = event.ctrlKey || event.metaKey;
        const { shiftKey, clientX, clientY } = event;
        setMenu({ top: clientY, left: clientX });
        onContextMenu({
          columnIndex,
          rowIndex,
          selected,
          focused,
          keyCtrlDown: ctrlDown,
          keyShiftDown: shiftKey,
        });
      }
    },
    [columnIndex, contextmenu, focused, onContextMenu, rowIndex, selected]
  );
  const cbOnMenuClose = React.useCallback(() => {
    setMenu(menuDefault);
  }, []);

  return (
    <div
      role="presentation"
      style={style}
      className={classnames({
        [classes.cell]: true,
        [className]: !!className,
      })}
      onClick={cbOnClick}
      onContextMenu={cbOnContextMenu}
    >
      {children}
      {isEmpty(contextmenu) ? null : (
        <ActionsMenu
          open={!!menu.top && !!menu.left}
          onClose={cbOnMenuClose}
          anchorReference="anchorPosition"
          anchorPosition={menu}
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
      )}
    </div>
  );
};

export default React.memo(Cell);
