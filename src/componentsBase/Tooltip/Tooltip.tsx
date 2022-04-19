import * as React from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";

const tooltipColor = "#000";

const arrowGenerator = (color: string) => ({
  '&[x-placement*="bottom"] $arrow': {
    top: 0,
    left: 0,
    marginTop: "-0.95em",
    width: "2em",
    height: "1em",
    "&::before": {
      borderWidth: "0 1em 1em 1em",
      borderColor: `transparent transparent ${color} transparent`,
    },
  },
  '&[x-placement*="top"] $arrow': {
    bottom: 0,
    left: 0,
    marginBottom: "-0.95em",
    width: "2em",
    height: "1em",
    "&::before": {
      borderWidth: "1em 1em 0 1em",
      borderColor: `${color} transparent transparent transparent`,
    },
  },
  '&[x-placement*="right"] $arrow': {
    left: 0,
    marginLeft: "-0.95em",
    height: "2em",
    width: "1em",
    "&::before": {
      borderWidth: "1em 1em 1em 0",
      borderColor: `transparent ${color} transparent transparent`,
    },
  },
  '&[x-placement*="left"] $arrow': {
    right: 0,
    marginRight: "-0.95em",
    height: "2em",
    width: "1em",
    "&::before": {
      borderWidth: "1em 0 1em 1em",
      borderColor: `transparent transparent transparent ${color}`,
    },
  },
});

const useStyles = makeStyles({
  ...createStyles({
    arrow: {
      position: "absolute",
      fontSize: 6,
      "&::before": {
        content: '""',
        margin: "auto",
        display: "block",
        width: 0,
        height: 0,
        borderStyle: "solid",
      },
    },
    popper: arrowGenerator(tooltipColor),
    tooltip: {
      position: "relative",
      "background-color": tooltipColor,
      "border-radius": 5,
    },
    tooltipPlacementLeft: {
      margin: "0 8px",
    },
    tooltipPlacementRight: {
      margin: "0 8px",
    },
    tooltipPlacementTop: {
      margin: "8px 0",
    },
    tooltipPlacementBottom: {
      margin: "8px 0",
    },
  }),
});

const TooltipCustomized = (props: TooltipProps) => {
  const classes = useStyles();
  const { title } = props;
  const [arrowRef, setArrowRef] = React.useState<HTMLSpanElement | null>(null);
  return (
    <Tooltip
      classes={classes}
      PopperProps={{
        popperOptions: {
          modifiers: {
            arrow: {
              enabled: Boolean(arrowRef),
              element: arrowRef,
            },
          },
        },
      }}
      {...props}
      title={
        title ? (
          <>
            {typeof title === "string" ? (
              <Typography
                style={{ color: "#fff" }}
                variant="body1"
                children={title}
              />
            ) : (
              title
            )}
            <span className={classes.arrow} ref={setArrowRef} />
          </>
        ) : (
          ""
        )
      }
    />
  );
};

TooltipCustomized.defaultProps = {
  placement: "top",
  title: "",
};

export default TooltipCustomized;
