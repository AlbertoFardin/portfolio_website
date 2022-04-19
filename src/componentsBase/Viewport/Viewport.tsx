import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import SidePanel from "./SidePanel";
import { IViewport } from ".";

interface IStyles {
  sidepanelWidth: number;
}
const useStyles = makeStyles({
  viewport: {
    height: "inherit",
    width: "inherit",
    "background-color": "#ffffff",
    display: "flex",
    "flex-direction": "column",
    flex: 1,
    "align-items": "stretch",
  },
  viewportContent: {
    display: "flex",
    "flex-direction": "row",
    flex: 1,
    "align-items": "stretch",
    "min-height": 0,
    height: 0,
  },
  toolbar: {
    position: "relative",
    padding: 0,
  },
  title: {
    display: "flex",
    "flex-direction": "row",
    flex: 1,
    "align-items": "center",
    "max-width": ({ sidepanelWidth }: IStyles) => sidepanelWidth,
    "min-width": ({ sidepanelWidth }: IStyles) => sidepanelWidth,
  },
  toolbarContent: {
    display: "flex",
    "flex-direction": "row",
    flex: 1,
    "align-items": "center",
    padding: "0 10px",
  },
  toolbarDivider: {
    width: 1,
    "border-left": "1px solid #e5e5e5",
    height: "100%",
  },
});

/**
 * **Viewport** is a component used to set main component position of WARDA applications
 */
const Viewport = ({
  content,
  sidepanel,
  sidepanelOpen,
  sidepanelWidth,
  title,
  toolbar,
}: IViewport) => {
  const classes = useStyles({ sidepanelWidth });
  return (
    <div className={classes.viewport}>
      <Toolbar className={classes.toolbar}>
        {!title ? null : (
          <>
            <div className={classes.title}>
              {title}
              <div style={{ flex: 1 }} />
            </div>
            <div className={classes.toolbarDivider} />
          </>
        )}
        <div className={classes.toolbarContent}>{toolbar}</div>
      </Toolbar>
      <Divider />
      <div className={classes.viewportContent}>
        <SidePanel
          open={sidepanelOpen}
          widthOpen={sidepanelWidth}
          children={sidepanel}
        />
        {content}
      </div>
    </div>
  );
};

export default Viewport;
