import * as React from "react";
import Popover, { PopoverOrigin } from "@material-ui/core/Popover";
import Link from "@material-ui/core/Link";
import makeStyles from "@material-ui/core/styles/makeStyles";
import getLinkSummaryItems from "./getLinkSummaryItems";
import { ContextCatalogs, ContextColumns } from "../../contexts";
import AttributeMenuItem from "../FieldAttributes/AttributeMenuItem";
import List from "@material-ui/core/List";

const useStyles = makeStyles({
  link: {
    cursor: "pointer",
    "font-weight": "bold",
  },
  list: {
    "max-height": 300,
    "min-width": 165,
    overflow: "auto",
  },
});
const anchorOriginDefault: PopoverOrigin = {
  vertical: "bottom",
  horizontal: "right",
};
const transformOriginDefault: PopoverOrigin = {
  vertical: "bottom",
  horizontal: "left",
};

interface ILinkSummary {
  attributesSelected: string[];
  onItemClick?: (id: string) => void;
  anchorOrigin?: PopoverOrigin;
  transformOrigin?: PopoverOrigin;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

const LinkSummary = ({
  attributesSelected,
  onItemClick,
  anchorOrigin = anchorOriginDefault,
  transformOrigin = transformOriginDefault,
  onMenuOpen,
  onMenuClose,
}: ILinkSummary) => {
  const classes = useStyles({});
  const columns = React.useContext(ContextColumns);
  const catalogs = React.useContext(ContextCatalogs);

  const menuRef = React.useRef(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const onMenuOpenCb = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      setMenuOpen(true);
      if (onMenuOpen) onMenuOpen();
    },
    [onMenuOpen]
  );
  const onMenuCloseCb = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      setMenuOpen(false);
      if (onMenuClose) onMenuClose();
    },
    [onMenuClose]
  );

  const items = getLinkSummaryItems(
    columns,
    catalogs,
    attributesSelected,
    onItemClick
  );
  const itemsCount = items.filter((a) => !a.title).length;

  return (
    <>
      <Link
        ref={menuRef}
        className={classes.link}
        onClick={onMenuOpenCb}
        children={`${itemsCount} column${itemsCount > 1 ? "s" : ""}`}
      />
      <Popover
        open={menuOpen}
        anchorEl={menuRef.current}
        onClose={onMenuCloseCb}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
      >
        <List className={classes.list}>
          {items.map((a) => (
            <AttributeMenuItem key={a.id} {...a} />
          ))}
        </List>
      </Popover>
    </>
  );
};

export default LinkSummary;
