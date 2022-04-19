import ButtonBase from "@material-ui/core/ButtonBase";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Zoom from "@material-ui/core/Zoom";
import * as React from "react";
import classnames from "classnames";
import Tooltip from "../../Tooltip";

const BadgeSize = 18;
const useStyles = makeStyles(({ palette }) => ({
  badge: {
    position: "absolute",
    top: "-8px",
    right: "-8px",
    "z-index": 0,
    width: "fit-content",
    margin: "auto",
  },
  buttonbase: {
    height: BadgeSize,
    "min-height": BadgeSize,
    "max-height": BadgeSize,
    "min-width": BadgeSize,
    "border-radius": 20,
    "box-shadow": "0 2px 4px 0 rgba(0, 0, 0, .14)",
    padding: "0 6px",
    "background-color": palette.primary.main,
  },
  label: {
    color: "#ffffff",
    "text-align": "center",
  },
}));

interface IAvatarBadge {
  className?: string;
  children: string | number | React.ReactNode;
  open?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  style?: React.CSSProperties;
  tooltip?: string | React.ReactNode;
}

const AvatarBadge = ({
  className,
  children,
  open = true,
  onClick,
  style,
  tooltip,
}: IAvatarBadge) => {
  const classes = useStyles({});
  return (
    <Tooltip title={open && tooltip}>
      <div
        className={classnames({
          [classes.badge]: true,
          [className]: !!className,
        })}
        style={style}
      >
        <Zoom in={open && !!children}>
          <ButtonBase
            className={classes.buttonbase}
            onClick={onClick}
            disableRipple={!onClick}
            children={
              <Typography
                children={children}
                variant="caption"
                className={classes.label}
              />
            }
          />
        </Zoom>
      </div>
    </Tooltip>
  );
};

export default AvatarBadge;
