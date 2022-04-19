import * as React from "react";
import classnames from "classnames";
import { alpha } from "@material-ui/core/styles";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  skeleton: {
    display: "block",
    height: "1.2em",
    borderRadius: 5,
    backgroundColor: alpha(
      theme.palette.text.primary,
      theme.palette.type === "light" ? 0.11 : 0.13
    ),
  },
  /* Styles applied to the root element if `animation="pulse"`. */
  pulse: {
    animation: "$pulse 1.5s ease-in-out 0.5s infinite",
  },
  "@keyframes pulse": {
    "0%": {
      opacity: 1,
    },
    "50%": {
      opacity: 0.4,
    },
    "100%": {
      opacity: 1,
    },
  },
  /* Styles applied to the root element if `animation="wave"`. */
  wave: {
    position: "relative",
    overflow: "hidden",
    "&::after": {
      animation: "$wave 1.6s linear 0.5s infinite",
      background: `linear-gradient(90deg, transparent, ${theme.palette.action.hover}, transparent)`,
      content: '""',
      position: "absolute",
      transform: "translateX(-100%)", // Avoid flash during server-side hydration
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
    },
  },
  "@keyframes wave": {
    "0%": {
      transform: "translateX(-100%)",
    },
    "60%": {
      // +0.5s of delay between each loop
      transform: "translateX(100%)",
    },
    "100%": {
      transform: "translateX(100%)",
    },
  },
  fitContent: {
    maxWidth: "fit-content",
  },
  heightAuto: {
    height: "auto",
  },
}));

export interface ISkeleton {
  className?: string;
  style?: React.CSSProperties;
  height?: number;
  width?: number;
  animation?: "pulse" | "wave";
}

const Skeleton = ({
  className,
  style,
  height,
  width,
  animation = "pulse",
}: ISkeleton) => {
  const classes = useStyles({});

  return (
    <span
      className={classnames({
        [classes.skeleton]: true,
        //
        [classes.fitContent]: !!width,
        [classes.heightAuto]: !!height,
        //
        [classes.pulse]: animation === "pulse",
        [classes.wave]: animation === "wave",
        //
        [className]: !!className,
      })}
      style={{
        width,
        minWidth: width,
        maxWidth: width,
        height,
        minHeight: height,
        maxHeight: height,
        ...style,
      }}
    />
  );
};

export default Skeleton;
