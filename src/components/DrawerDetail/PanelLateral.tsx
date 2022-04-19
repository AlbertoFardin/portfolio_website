import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Fade from "@material-ui/core/Fade";
import { SheetLayout } from "../../interfaces";
import classnames from "classnames";

interface IStyles {
  open: boolean;
  width: number;
  widthCollapsed: number;
}
const useStyle = makeStyles(({ zIndex }) => ({
  panelLateral: {
    display: "flex",
    "flex-direction": "column",
    "overflow-x": "hidden",
    "align-items": "stretch",
    "background-color": "#ffffff",
    position: "relative",
    height: "-webkit-fill-available",
    width: ({ open, width, widthCollapsed }: IStyles) =>
      !open ? widthCollapsed : width,
    transition: "width 200ms",
    "z-index": zIndex.drawer,
  },
  panelLateralContent: {
    position: "relative",
    width: "100%",
    minWidth: ({ width }: IStyles) => width,
    overflow: "hidden",
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
    flex: 1,
  },
}));

interface IPanelLateral {
  layout: SheetLayout;
  content: JSX.Element;
  className: string;
  width: number;
  widthCollapsed: number;
}

const PanelLateral = ({
  layout,
  content,
  className,
  width,
  widthCollapsed,
}: IPanelLateral) => {
  const openPanel = layout !== SheetLayout.CLOSED;
  const openFade = layout === SheetLayout.OPENED;
  const classes = useStyle({
    open: openPanel,
    width,
    widthCollapsed,
  });

  return (
    <div
      className={classnames({
        [classes.panelLateral]: true,
        [className]: !!className,
      })}
    >
      <div className={classes.panelLateralContent}>
        <Fade in={openFade} mountOnEnter unmountOnExit children={content} />
      </div>
    </div>
  );
};

export default PanelLateral;
