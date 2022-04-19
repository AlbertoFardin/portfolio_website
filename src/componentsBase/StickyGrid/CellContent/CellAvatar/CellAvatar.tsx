import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
import Popover from "@material-ui/core/Popover";
import drop from "lodash-es/drop";
import dropRight from "lodash-es/dropRight";
import floor from "lodash-es/floor";
import isEmpty from "lodash-es/isEmpty";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tooltip from "../../../Tooltip";
import Badge from "../Badge";
import Chip from "../../../Chip";
import Cell from "../../Cell/Cell";
import IAvatar from "./IAvatar";
import { ICellClick } from "../../interfaces";
import { IActions } from "../../../ActionsMenu";

const avatarMargin = 5;
const avatarSize = 45;
const useStyles = makeStyles({
  avatar: {
    width: avatarSize - avatarMargin,
    height: avatarSize - avatarMargin,
    "margin-right": avatarMargin,
    "vertical-align": "middle",
    display: "inline-block",
    "background-color": "#eee",
    position: "relative",
  },
  center: {
    position: "absolute",
    margin: "auto",
    bottom: 0,
    top: 0,
    right: 0,
    left: 0,
  },
  container: {
    flex: 1,
    position: "relative",
    display: "inline-flex",
    overflow: "hidden",
  },
  badge: {
    top: "50%",
    right: 2,
    transform: "translateY(-100%)",
  },
});

interface ICellAvatar {
  value: IAvatar[];
  rowIndex: number;
  columnIndex: number;
  selected: boolean;
  focused: boolean;
  style: React.CSSProperties;
  onClick: (p: ICellClick) => void;
  onDoubleClick: (p: ICellClick) => void;
  onContextMenu: (p: ICellClick) => void;
  contextmenu: IActions[];
}

const CellAvatar = ({
  value,
  rowIndex,
  columnIndex,
  selected,
  focused,
  style,
  onClick,
  onDoubleClick,
  onContextMenu,
  contextmenu,
}: ICellAvatar) => {
  const classes = useStyles({});
  const contentRef = React.useRef(null);
  const [popover, setPopover] = React.useState(false);
  const cellWidth = Number(style.width);
  const items: IAvatar[] =
    typeof value === "string" ? [{ id: "avatar", url: value }] : value;
  const itemsVisibled = dropRight(
    items,
    items.length - floor(cellWidth / avatarSize)
  );
  const itemsNotVisibled =
    items.length - itemsVisibled.length > 0
      ? drop(items, itemsVisibled.length)
      : [];
  const cbTogglePopover = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      setPopover(!popover);
    },
    [popover]
  );

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
      <div ref={contentRef} className={classes.container}>
        {itemsVisibled.map(({ id, label, url }: IAvatar) => (
          <Tooltip key={id} title={label}>
            <Avatar src={url} className={classes.avatar}>
              <Icon className={classes.center} children="person" />
            </Avatar>
          </Tooltip>
        ))}
        <Badge
          open={!isEmpty(itemsNotVisibled)}
          onClick={cbTogglePopover}
          className={classes.badge}
          children={`+${itemsNotVisibled.length}`}
        />
      </div>
      <Popover
        open={popover}
        anchorEl={contentRef.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          elevation: 1,
          style: { padding: 10 },
        }}
        onClose={cbTogglePopover}
      >
        {itemsNotVisibled.map(({ id, label, url }: IAvatar) => (
          <div key={id} className={classes.container}>
            <Chip label={label} avatar={url} />
          </div>
        ))}
      </Popover>
    </Cell>
  );
};

export default React.memo(CellAvatar);
