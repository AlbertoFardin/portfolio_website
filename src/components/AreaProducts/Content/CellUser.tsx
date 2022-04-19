import * as React from "react";
import Tooltip from "../../../componentsBase/Tooltip";
import Btn from "../../../componentsBase/Btn";
import { Cell, ICellRenderer } from "../../../componentsBase/StickyGrid";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import getUser from "../../../utils/getUser";
import { colorTheme } from "../../../constants";
import { ContextM2ms, ContextUsers } from "../../contexts";
import Avatar from "@material-ui/core/Avatar";

const useStyles = makeStyles({
  cellContent: {
    flex: 1,
    position: "relative",
    padding: "5px 10px",
    display: "flex",
    "align-items": "center",
    "flex-direction": "row",
    overflow: "hidden",
  },
  labelContent: {
    display: "inline-block",
    overflow: "hidden",
  },
  label: {
    "white-space": "nowrap",
    "text-overflow": "ellipsis",
    overflow: "hidden",
  },
  btnCopy: {
    minWidth: 20,
    minHeight: 20,
  },
  btnCopyIcon: {
    fontSize: "12px !important",
  },
  avatar: {
    position: "relative",
    display: "inline-block",
    "vertical-align": "middle",
    "margin-right": 5,
    "background-color": "#ddd",
    height: 40,
    width: 40,
  },
});

interface ICellUser extends ICellRenderer {
  value: string;
}
const CellUser = (p: ICellUser) => {
  const { onCopyToClipboard, style, value } = p;
  const classes = useStyles({});

  const users = React.useContext(ContextUsers);
  const m2ms = React.useContext(ContextM2ms);
  const user = getUser(value, { users, m2ms });
  const { name, picture } = user;

  const typoRef = React.useRef(null);
  const [offsetWidth, setOffsetWidth] = React.useState(0);
  const [scrollWidth, setScrollWidth] = React.useState(0);
  const [needTooltip, setNeedTooltip] = React.useState(false);
  const [mousehover, setMousehover] = React.useState(false);

  const onCbMouseEnter = React.useCallback(() => setMousehover(true), []);
  const onCbMouseLeave = React.useCallback(() => setMousehover(false), []);
  const onClick = React.useCallback(() => onCopyToClipboard(name), [
    name,
    onCopyToClipboard,
  ]);

  React.useEffect(() => {
    const newNeedTooltip = offsetWidth < scrollWidth;
    setNeedTooltip(newNeedTooltip);
  }, [offsetWidth, scrollWidth]);

  React.useEffect(() => {
    if (!!typoRef && !!typoRef.current && style.width) {
      setOffsetWidth(typoRef.current.offsetWidth);
      setScrollWidth(typoRef.current.scrollWidth);
    }
  }, [style.width]);

  return (
    <Cell {...p}>
      <div
        className={classes.cellContent}
        onMouseEnter={onCbMouseEnter}
        onMouseLeave={onCbMouseLeave}
      >
        <Avatar className={classes.avatar} src={picture} />
        <Tooltip title={needTooltip ? name : ""}>
          <Typography
            ref={typoRef}
            className={classes.label}
            variant="body1"
            children={name}
          />
        </Tooltip>
        {!mousehover ? null : (
          <Btn
            className={classes.btnCopy}
            copyToClipboard={name}
            icon="content_copy"
            iconClassName={classes.btnCopyIcon}
            color={colorTheme}
            onClick={onClick}
          />
        )}
      </div>
    </Cell>
  );
};

export default CellUser;
