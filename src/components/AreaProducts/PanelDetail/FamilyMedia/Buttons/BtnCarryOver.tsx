import ButtonBase from "@material-ui/core/ButtonBase";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { CopyToClipboard } from "react-copy-to-clipboard";
import classnames from "classnames";
import Tooltip from "../../../../../componentsBase/Tooltip";
import { colorTheme } from "../../../../../constants";
import { ContextSetSnackbar } from "../../../../contexts";
import { Severity } from "../../../../../interfaces";

const useStyles = makeStyles({
  badgeCarryover: {
    color: colorTheme,
    "border-radius": 5,
    border: "1px solid #ddd",
    "background-color": "#fff",
    padding: "2px 8px",
    "&:hover": {
      "box-shadow": "0 0 5px 0px rgba(0,0,0,0.3)",
    },
  },
  icon: {
    color: colorTheme,
    "font-size": "20px !important",
  },
  tooltipTitle: {
    "font-weight": "bold",
    color: "#fff",
  },
  tooltipLabel: {
    color: "#fff",
  },
});

interface IBtnCarryOver {
  text: string;
  className?: string;
  classNameIcon?: string;
}

const BtnCarryOver = ({ text, className, classNameIcon }: IBtnCarryOver) => {
  const setSnackbar = React.useContext(ContextSetSnackbar);
  const classes = useStyles({});
  const cbOnClick = React.useCallback(() => {
    setSnackbar(Severity.INFO, "Carry-over ID copied");
  }, [setSnackbar]);

  if (!text) return null;

  return (
    <Tooltip
      title={
        <>
          <Typography
            className={classes.tooltipTitle}
            variant="body1"
            children="Click to copy carry-over ID"
          />
          <Typography
            className={classes.tooltipLabel}
            variant="body1"
            children={text}
          />
        </>
      }
    >
      <CopyToClipboard text={text}>
        {/* this div need to fix layout with Tooltip + CopyToClipboard + Buttonbase */}
        <div>
          <ButtonBase
            className={classnames({
              [classes.badgeCarryover]: true,
              [className]: !!className,
            })}
            onClick={cbOnClick}
          >
            <Icon
              className={classnames({
                [classes.icon]: true,
                [classNameIcon]: !!classNameIcon,
              })}
              children="all_inclusive"
            />
          </ButtonBase>
        </div>
      </CopyToClipboard>
    </Tooltip>
  );
};

export default BtnCarryOver;
