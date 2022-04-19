import classnames from "classnames";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Toolbar from "@material-ui/core/Toolbar";

const useStyles = makeStyles(({ mixins }) => ({
  actionbar: {
    position: "relative",
    display: "flex",
    "align-items": "stretch",
    "flex-direction": "row",
    transition: "all 250ms",
    "max-height": 0,
    "min-height": 0,
    "background-color": "#fff",
    padding: 0,
    margin: 0,
  },
  actionbarOpen: {
    height: mixins.toolbar.height,
    "min-height": mixins.toolbar.height,
    "max-height": mixins.toolbar.height,
  },
  content: {
    flex: 1,
    height: mixins.toolbar.height,
    "min-height": mixins.toolbar.height,
    "max-height": mixins.toolbar.height,
  },
}));

interface IActionsBar {
  /** Component's children  */
  children?: React.ReactNode;
  /** Component CSS classes */
  className?: string;
  /** Component visibility. If false, the component collapse to height:0 */
  open?: boolean;
  /** Component CSS style */
  style?: React.CSSProperties;
}

/**
 * **ActionsBar** è una Toolbar collassabile.
 * E' possibile collassare/espandere tale toolbar agendo sulla proprietà "open".
 */
const ActionsBar = ({
  children,
  className,
  open = true,
  style,
}: IActionsBar) => {
  const classes = useStyles({});
  return (
    <Toolbar
      className={classnames({
        [classes.actionbar]: true,
        [classes.actionbarOpen]: open,
      })}
      children={
        <Toolbar
          className={classnames({
            [classes.content]: true,
            [className]: !!className,
          })}
          style={style}
          children={children}
        />
      }
    />
  );
};

export default ActionsBar;
