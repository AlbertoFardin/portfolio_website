import Typography from "@material-ui/core/Typography";
import * as React from "react";
import Tooltip from "../../../Tooltip";
import { columnsPadding } from "../../statics";
import BtnCopyToClipboard from "./BtnCopyToClipboard";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Cell from "../../Cell/Cell";
import ICellString from "./ICellString";

const useStyles = makeStyles({
  cellValue: {
    width: "-webkit-fill-available",
    display: "inline-flex",
  },
  cellValueLabel: {
    display: "inline-block",
    position: "relative",
    "white-space": "nowrap",
    "text-overflow": "ellipsis",
    overflow: "hidden",
  },
});

const CellString = ({
  value,
  rowIndex,
  columnIndex,
  selected,
  focused,
  style,
  contextmenu,
  onClick,
  onDoubleClick,
  onContextMenu,
  onCopyToClipboard,
}: ICellString) => {
  const classes = useStyles({});
  const typoRef = React.useRef(null);
  const [needTooltip, setNeedTooltip] = React.useState(false);
  const [mousehover, setMousehover] = React.useState(false);
  const width = Number(style.width) || 0;

  React.useEffect(() => {
    if (typoRef) {
      const labelSpaceNeed = typoRef.current.scrollWidth;
      const labelSpaceHave = width - 2 * columnsPadding;
      setNeedTooltip(labelSpaceHave <= labelSpaceNeed);
    }
  }, [width]);

  const onCbMouseEnter = React.useCallback(() => {
    setMousehover(true);
  }, []);
  const onCbMouseLeave = React.useCallback(() => {
    setMousehover(false);
  }, []);
  const onClickBtnCopyToClipboard = React.useCallback(() => {
    onCopyToClipboard(value);
  }, [onCopyToClipboard, value]);

  return (
    <Cell
      rowIndex={rowIndex}
      columnIndex={columnIndex}
      selected={selected}
      focused={focused}
      style={style}
      contextmenu={contextmenu}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
    >
      <div
        className={classes.cellValue}
        onMouseEnter={onCbMouseEnter}
        onMouseLeave={onCbMouseLeave}
      >
        <Tooltip title={needTooltip ? value : ""}>
          <Typography
            ref={typoRef}
            className={classes.cellValueLabel}
            variant="body1"
            children={value}
          />
        </Tooltip>
        {!onCopyToClipboard ? null : (
          <BtnCopyToClipboard
            visibled={mousehover && !!value}
            value={value}
            onClick={onClickBtnCopyToClipboard}
          />
        )}
      </div>
    </Cell>
  );
};

export default React.memo(CellString);
