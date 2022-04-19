import Icon from "@material-ui/core/Icon";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import * as React from "react";
import isEmpty from "lodash-es/isEmpty";
import ActionsMenu from "../ActionsMenu";
import ClickManager from "../ClickManager";
import TypographyEllipsis from "../TypographyEllipsis";
import { emptyFn } from "../utils/common";
import mixColors from "../utils/mixColors";
import IAssetFolder from "./IAssetFolder";

const Flex1 = () => <div style={{ flex: 1 }} />;
const useStyles = makeStyles(({ shape, typography }) => ({
  root: {
    display: "flex",
    "flex-direction": "row",
    cursor: "pointer",
    overflow: "hidden",
    border: "1px solid #dddddd",
    "background-color": "#ffffff",
    padding: 3,
    "box-sizing": "border-box",
    "align-items": "center",
    "border-radius": shape.borderRadius,
  },
  label: {
    margin: "0 10px 0 0",
    "user-select": "none",
  },
  icon: {
    "font-size": 20,
    margin: "0 8px",
    color: typography.subtitle1.color,
  },
}));

const AssetFolder = ({
  id,
  className,
  contextmenu,
  label,
  labelProps,
  icon,
  iconProps,
  onClick,
  onDoubleClick,
  onContextMenu,
  colorTheme,
  selected,
  style,
  children,
}: IAssetFolder) => {
  const classes = useStyles({});
  const [contextPosition, setContextPosition] = React.useState({
    x: 0,
    y: 0,
  } as { x: number; y: number });
  const contextIsOpen = !!contextPosition.x && !!contextPosition.y;
  const contextmenuOnClose = React.useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setContextPosition({ x: 0, y: 0 });
  }, []);
  const cbOnContextmenu = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (!isEmpty(contextmenu)) {
        setContextPosition({
          y: event.clientY,
          x: event.clientX,
        });
      }
      onContextMenu(event, {
        id,
        keyShiftDown: false,
        keyCtrlDown: false,
      });
    },
    [contextmenu, id, onContextMenu]
  );
  const cbOnClick = React.useCallback(
    (p, event) => {
      onClick(event, {
        id,
        keyCtrlDown: p.ctrlDown,
        keyShiftDown: p.shiftKey,
      });
    },
    [id, onClick]
  );
  const cbOnDoubleClick = React.useCallback(
    (event) => {
      onDoubleClick(event, {
        id,
        keyCtrlDown: false,
        keyShiftDown: false,
      });
    },
    [id, onDoubleClick]
  );

  return (
    <>
      <ClickManager
        style={{
          color: colorTheme,
          borderColor: selected || contextIsOpen ? colorTheme : undefined,
          backgroundColor:
            selected || contextIsOpen
              ? mixColors(0.2, "#ffffff", colorTheme)
              : undefined,
          ...style,
        }}
        className={classnames({
          [classes.root]: true,
          [className]: !!className,
        })}
        onClick={cbOnClick}
        onDoubleClick={cbOnDoubleClick}
        onContextMenu={cbOnContextmenu}
      >
        <Icon
          {...iconProps}
          className={classnames({
            [classes.icon]: true,
            [className]: !!iconProps.className,
          })}
          style={{
            color: selected || contextIsOpen ? colorTheme : undefined,
            ...iconProps.style,
          }}
          children={icon}
        />
        <TypographyEllipsis
          {...labelProps}
          variant="subtitle1"
          className={classnames({
            [classes.label]: true,
            [className]: !!labelProps.className,
          })}
          children={label}
        />
        <Flex1 />
        {children}
      </ClickManager>
      <ActionsMenu
        open={contextIsOpen}
        onClose={contextmenuOnClose}
        anchorReference="anchorPosition"
        anchorPosition={{
          top: contextPosition.y,
          left: contextPosition.x,
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
    </>
  );
};

AssetFolder.defaultProps = {
  className: "",
  colorTheme: "#ff0000",
  label: "",
  labelProps: {},
  icon: "folder_open",
  iconProps: {},
  onClick: emptyFn,
  onDoubleClick: emptyFn,
  onContextMenu: emptyFn,
  contextmenu: [],
  selected: false,
  style: {},
};

export default AssetFolder;
