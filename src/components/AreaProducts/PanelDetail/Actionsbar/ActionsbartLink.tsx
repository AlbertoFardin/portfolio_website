import * as React from "react";
import Popover from "@material-ui/core/Popover";
import Link from "@material-ui/core/Link";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { ContextCatalogs, ContextColumns } from "../../contexts";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import { getAttributeId } from "../../getAttributeKey";

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
  listTitle: {
    padding: "10px 15px",
  },
  listItem: {
    padding: "8px 15px",
    "align-items": "center",
  },
  listItemLabel: {
    "max-width": 300,
    "white-space": "nowrap",
    "text-overflow": "ellipsis",
    overflow: "hidden",
  },
});

interface IActionsbarLink {
  assetdataDirty;
}

const ActionsbarLink = ({ assetdataDirty }: IActionsbarLink) => {
  const classes = useStyles({});
  const columns = React.useContext(ContextColumns);
  const catalogs = React.useContext(ContextCatalogs);

  const dirtiesId = Object.keys(assetdataDirty);

  const menuRef = React.useRef(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const onMenuOpen = React.useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuOpen(true);
  }, []);
  const onMenuClose = React.useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuOpen(false);
  }, []);

  return (
    <>
      <Typography variant="body1">
        <Link
          ref={menuRef}
          className={classes.link}
          onClick={onMenuOpen}
          children={`${dirtiesId.length} attributes ${
            dirtiesId.length > 1 ? "s" : ""
          } edited`}
        />
      </Typography>
      <Popover
        open={menuOpen}
        anchorEl={menuRef.current}
        onClose={onMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <>
          <Typography
            className={classes.listTitle}
            variant="body2"
            children="Attributes edited"
          />
          <Divider />
          <List className={classes.list}>
            {dirtiesId.map((key) => {
              const { id, catalogId, languageId } = getAttributeId(key);
              const catalog = catalogs.find((c) => c.id === catalogId);
              const column = columns.find((c) => c.id === id);

              return (
                <ListItem key={key} className={classes.listItem}>
                  <Typography variant="body1" className={classes.listItemLabel}>
                    <>
                      <span children={column.label} />
                      {!catalogId ? null : (
                        <span children={` - ${catalog.displayName}`} />
                      )}
                      {!languageId ? null : (
                        <span
                          children={` - ${languageId.toLocaleUpperCase()}`}
                        />
                      )}
                    </>
                  </Typography>
                </ListItem>
              );
            })}
          </List>
        </>
      </Popover>
    </>
  );
};

export default ActionsbarLink;
