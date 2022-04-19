import * as React from "react";
import * as Colors from "../style/Colors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import Btn from "../Btn";
import ICategory from "./ICategory";
import Tooltip from "../Tooltip";

interface IStyles {
  color?: string;
}
const useStyle = makeStyles({
  chip: {
    position: "relative",
    display: "inline-flex",
    "align-items": "center",
    margin: 2,
    "background-color": ({ color }: IStyles) => color || Colors.Gray1,
    "border-radius": 5,
    "max-width": 225,
  },
  btnClick: {
    color: "#fff !important",
    flex: 1,
    overflow: "hidden",
    "text-overflow": "ellipsis",
  },
  label: {
    color: "#fff !important",
    overflow: "hidden",
    "text-overflow": "ellipsis",
    "white-space": "nowrap",
    padding: "1px 8px",
  },
  btnRemove: {
    color: "#fff !important",
    "background-color": "transparent",
    padding: 0,
    margin: "0 0 0 5px",
    "min-width": 1,
    "min-height": 1,
  },
  removeIcon: {
    color: "#fff !important",
    "font-size": "12px !important",
  },
});

const ChipCategory = ({
  id,
  label,
  tooltip,
  color,
  onClick,
  onRemove,
}: ICategory) => {
  const classes = useStyle({ color });
  const onRemoveCb = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      onRemove(id);
    },
    [id, onRemove]
  );
  const onClickCb = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      onClick(id);
    },
    [id, onClick]
  );

  if (!id) {
    console.warn("Unable render category", {
      id,
      label,
      color,
      tooltip,
    });
    return null;
  }

  return (
    <Tooltip title={tooltip}>
      <div className={classes.chip}>
        {!onRemove ? null : (
          <Btn
            className={classes.btnRemove}
            icon="close"
            iconClassName={classes.removeIcon}
            onClick={onRemoveCb}
          />
        )}
        <ButtonBase
          onClick={onClickCb}
          className={classes.btnClick}
          disabled={!onClick}
        >
          <Typography
            variant="body1"
            className={classes.label}
            children={label}
          />
        </ButtonBase>
      </div>
    </Tooltip>
  );
};

export default ChipCategory;
