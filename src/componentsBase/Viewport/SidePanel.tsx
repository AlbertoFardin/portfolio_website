import classnames from "classnames";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

interface ISidePanel {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  open?: boolean;
  title?: React.ReactNode;
  widthClose?: number;
  widthOpen: number;
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    "flex-direction": "column",
    transition: "all 250ms",
    "box-sizing": "border-box",
    height: "100%",
    overflow: "hidden",
  },
  dividerSidePanel: {
    height: "100%",
    "border-right": "1px solid #e5e5e5",
  },
});

const SidePanel = ({
  open = true,
  widthOpen,
  widthClose = 0,
  className,
  children,
  style,
}: ISidePanel) => {
  const classes = useStyles({});
  const width = open ? widthOpen : widthClose;
  return (
    <>
      <div
        className={classnames({
          [classes.root]: true,
          [className]: !!className,
        })}
        style={{
          width,
          ...style,
        }}
        children={children}
      />
      {!open ? null : <div className={classes.dividerSidePanel} />}
    </>
  );
};

export default SidePanel;
