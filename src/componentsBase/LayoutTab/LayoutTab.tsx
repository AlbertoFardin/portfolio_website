import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import Tabs from "./Tabs";
import Carousel from "./Carousel";
import ILayoutTabPanel from "./ILayoutTabPanel";
import Divider from "@material-ui/core/Divider";
import Toolbar from "@material-ui/core/Toolbar";
import { emptyFn } from "../utils/common";
import ILayoutTab from "./ILayoutTab";

const useStyles = makeStyles({
  layoutTab: {
    height: "100%",
    width: "100%",
    position: "relative",
    display: "inline-flex",
    "flex-direction": "column",
    "align-items": "stretch",
    overflow: "hidden",
  },
  toolbar: {
    padding: 0,
  },
  flex1: {
    flex: 1,
  },
});

/**
 * **LayoutTab** è un React.Fragment composto da una Toolbar ed un Panel.
 * Dato un array di configurazioni ("panels") si può agire sulla Toolbar per selezionare il panel da renderizzare.
 */
const LayoutTab = ({
  className,
  style,
  panels,
  panelSelectedId,
  onChange = emptyFn,
  tabsContentLeft = null,
  tabsContentRight = null,
  tabsVisible = true,
}: ILayoutTab) => {
  const classes = useStyles({});
  const childSelected = panels.find(
    ({ id }: ILayoutTabPanel) => id === panelSelectedId
  );
  const noTabs = !childSelected || panels.length <= 1;
  return (
    <div
      className={classnames({
        [classes.layoutTab]: true,
        [className]: !!className,
      })}
      style={style}
    >
      {!tabsVisible ||
      (noTabs && !tabsContentLeft && !tabsContentRight) ? null : (
        <>
          <Toolbar className={classes.toolbar}>
            {tabsContentLeft}
            <div className={classes.flex1} />
            {noTabs ? null : (
              <Tabs
                tabs={panels}
                tabSelectedId={panelSelectedId}
                onSelectTab={onChange}
              />
            )}
            <div className={classes.flex1} />
            {tabsContentRight}
          </Toolbar>
          <Divider />
        </>
      )}
      <Carousel panels={panels} panelSelectedId={panelSelectedId} />
    </div>
  );
};

export default LayoutTab;
