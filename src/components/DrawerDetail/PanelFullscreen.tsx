import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Slide from "@material-ui/core/Slide";
import { SheetLayout } from "../../interfaces";
import classnames from "classnames";

const useStyles = makeStyles(({ zIndex }) => ({
  panelFullscreen: {
    flex: 1,
    position: "absolute",
    display: "flex",
    "flex-direction": "column",
    width: "100%",
    height: "100%",
    "z-index": zIndex.drawer,
    "background-color": "#fff",
  },
}));

interface IPanelFullscreen {
  layout: SheetLayout;
  content: JSX.Element;
  className: string;
}

const PanelFullscreen = ({ layout, content, className }: IPanelFullscreen) => {
  const open = layout === SheetLayout.FULLSCREEN;
  const classes = useStyles({});
  return (
    <Slide direction="left" in={open} mountOnEnter unmountOnExit>
      <div
        className={classnames({
          [classes.panelFullscreen]: true,
          [className]: !!className,
        })}
        children={content}
      />
    </Slide>
  );
};

export default PanelFullscreen;
