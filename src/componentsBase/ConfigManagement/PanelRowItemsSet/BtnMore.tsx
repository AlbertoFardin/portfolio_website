import * as React from "react";
import Btn from "../../Btn";
import * as Colors from "../../style/Colors";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { emptyFn } from "../../utils/common";

const useStyles = makeStyles({
  btnIcon: {
    "font-size": "15px !important",
  },
});

interface IBtnMore {
  onDelete: () => void;
  onDuplicate: () => void;
}

const BtnMore = ({ onDelete, onDuplicate }: IBtnMore) => {
  const classes = useStyles({});
  const iconButtonStyle = { margin: "0 2px 0 0", minWidth: 20, minHeight: 20 };
  const [mouseOver, setMouseOver] = React.useState(false);
  const onMouseEnter = React.useCallback(() => setMouseOver(true), []);
  const onMouseLeave = React.useCallback(() => setMouseOver(false), []);
  return (
    <div
      role="presentation"
      style={{ display: "flex", flexDirection: "row" }}
      onFocus={emptyFn}
      onMouseOver={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {mouseOver ? (
        <>
          <Btn
            tooltip="Delete"
            color={Colors.Red}
            style={iconButtonStyle}
            onClick={onDelete}
            icon="delete"
            iconClassName={classes.btnIcon}
          />
          <Btn
            tooltip="Duplicate"
            style={iconButtonStyle}
            onClick={onDuplicate}
            icon="content_copy"
            iconClassName={classes.btnIcon}
          />
        </>
      ) : (
        <Btn icon="more_vert" style={iconButtonStyle} />
      )}
    </div>
  );
};

export default BtnMore;
