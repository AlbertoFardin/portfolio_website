import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { emptyFn } from "../../componentsBase/utils/common";
import BtnExpand from "./BtnExpand";
import BorderShadow from "./BorderShadow";

interface IStyles {
  width: number;
  collapsed: boolean;
}
const useStyles = makeStyles({
  drawer: {
    "min-width": ({ collapsed, width }: IStyles) => (collapsed ? 20 : width),
    width: 0,
    flex: 0,
    transition: "all 250ms",
    position: "relative",
    display: "flex",
    "flex-direction": "row",
    "align-items": "stretch",
    "background-color": "#FAFBFC",
  },
  drawerContent: {
    height: "100%",
    display: "flex",
    flex: 2,
    "flex-direction": "column",
    "align-items": "stretch",
    "box-sizing": "border-box",
    "min-width": ({ width }: IStyles) => width,
    "overflow-y": "overlay",
    "overflow-x": "hidden",
    "text-align": "center",
  },
});

interface IDrawer {
  direction?: "right" | "left";
  children;
  onChange?: (collapse: boolean) => void;
  width?: number;
}

const Drawer = ({
  direction = "left",
  children,
  onChange = emptyFn,
  width = 250,
}: IDrawer) => {
  const [collapsed, setCollapsed] = React.useState(false);
  const classes = useStyles({ width, collapsed });

  const onClick = React.useCallback(() => {
    const collapsedNew = !collapsed;
    onChange(collapsedNew);
    setCollapsed(collapsedNew);
  }, [collapsed, onChange]);

  return (
    <div className={classes.drawer}>
      <BtnExpand
        direction={direction}
        collapsed={collapsed}
        onClick={onClick}
      />
      <BorderShadow direction={direction} />
      <div style={{ overflow: "hidden" }}>
        <div
          className={classes.drawerContent}
          children={collapsed ? null : children}
        />
      </div>
    </div>
  );
};

export default Drawer;
