import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import * as React from "react";
import isEmpty from "lodash-es/isEmpty";
import ActionsMenu from "../ActionsMenu";
import ClickManager from "../ClickManager";
import Preview from "../Preview";
import PreviewType from "../Preview/PreviewType";
import TypographyEllipsis from "../TypographyEllipsis";
import { emptyFn } from "../utils/common";
import mixColors from "../utils/mixColors";
import IAssetPreview from "./IAssetPreview";

const padding = 4;
const useStyles = makeStyles({
  root: {
    position: "relative" as const,
    display: "flex",
    "flex-direction": "column",
    cursor: "pointer",
    overflow: "hidden",
    border: "1px solid #dddddd",
    "background-color": "#ffffff",
    padding,
    "box-sizing": "border-box",
    "border-radius": 12,
    "align-items": "stretch",
  },
  label: {
    height: 40,
    padding: "0 10px",
  },
});

const AssetPreview = ({
  id,
  children,
  className,
  colorTheme,
  contextmenu,
  label,
  labelProps,
  onClick,
  onDoubleClick,
  onContextMenu,
  onMouseEnter,
  onMouseLeave,
  placeholderIcon,
  placeholderIconStyle,
  placeholderLabel,
  placeholderLabelStyle,
  placeholderLabelRequired,
  selected,
  style,
  srcUrl,
  srcType,
}: IAssetPreview) => {
  const classes = useStyles({});
  const [mousehover, setMousehover] = React.useState(false);
  const [contextPosition, setContextPosition] = React.useState({
    x: 0,
    y: 0,
  } as { x: number; y: number });
  const contextIsOpen = !!contextPosition.x && !!contextPosition.y;
  const styleWidth = Math.max(style.width as number, 50);
  const styleHeight = Math.max(style.height as number, 50);
  const onCbClick = React.useCallback(
    (p, event) => {
      onClick(event, {
        id,
        keyCtrlDown: p.ctrlDown,
        keyShiftDown: p.shiftKey,
      });
    },
    [id, onClick]
  );
  const onCbDoubleClick = React.useCallback(
    (event) => {
      onDoubleClick(event, {
        id,
        keyCtrlDown: false,
        keyShiftDown: false,
      });
    },
    [id, onDoubleClick]
  );
  const onCbMenuOpen = React.useCallback(
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
        keyCtrlDown: false,
        keyShiftDown: false,
      });
    },
    [contextmenu, id, onContextMenu]
  );
  const onCbMenuClose = React.useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setContextPosition({ y: 0, x: 0 });
  }, []);
  const onCbMouseEnter = React.useCallback(
    (event) => {
      if (onMouseEnter) onMouseEnter(event);
      setMousehover(true);
    },
    [onMouseEnter]
  );
  const onCbMouseLeave = React.useCallback(
    (event) => {
      if (onMouseLeave) onMouseLeave(event);
      setMousehover(false);
    },
    [onMouseLeave]
  );

  return (
    <>
      <ClickManager
        style={{
          width: styleWidth,
          height: styleHeight,
          color: colorTheme,
          borderColor: contextIsOpen || selected ? colorTheme : undefined,
          backgroundColor:
            contextIsOpen || selected
              ? mixColors(0.2, "#ffffff", colorTheme)
              : undefined,
          ...style,
        }}
        className={classnames({
          [classes.root]: true,
          [className]: !!className,
        })}
        onClick={onCbClick}
        onDoubleClick={onCbDoubleClick}
        onContextMenu={onCbMenuOpen}
        onMouseEnter={onCbMouseEnter}
        onMouseLeave={onCbMouseLeave}
      >
        <Preview
          placeholderIcon={placeholderIcon}
          placeholderIconStyle={placeholderIconStyle}
          placeholderLabel={placeholderLabel}
          placeholderLabelStyle={placeholderLabelStyle}
          placeholderLabelRequired={placeholderLabelRequired}
          srcUrl={srcUrl}
          srcType={srcType}
          style={{
            width: styleWidth - 10,
            height: styleHeight - 10,
            borderRadius: (style && style.borderRadius) || 10,
            backgroundColor: "#fff",
          }}
          selected={contextIsOpen || selected}
          colorTheme={colorTheme}
          mousehover={mousehover}
          onClick={onCbClick}
          onDoubleClick={onCbDoubleClick}
        />
        {!label ? null : (
          <TypographyEllipsis
            {...labelProps}
            variant="subtitle1"
            className={classes.label}
            children={label}
          />
        )}
        {children}
      </ClickManager>
      <ActionsMenu
        open={contextIsOpen}
        onClose={onCbMenuClose}
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

AssetPreview.srcType = PreviewType;
AssetPreview.defaultProps = {
  contextmenu: [],
  label: "",
  labelProps: {},
  onClick: emptyFn,
  onDoubleClick: emptyFn,
  onContextMenu: emptyFn,
  placeholderIconStyle: {},
  placeholderLabelStyle: {},
  placeholderLabelRequired: false,
  selected: false,
  srcUrl: "",
  srcType: PreviewType.IMAGE,
};

export default AssetPreview;
