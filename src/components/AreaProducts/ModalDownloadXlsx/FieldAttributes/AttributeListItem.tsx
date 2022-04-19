import * as React from "react";
import ListItem from "@material-ui/core/ListItem";
import Icon from "@material-ui/core/Icon";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import boldSearchText from "../../../../componentsBase/utils/boldSearchText";
import { ACT_MODAL } from "../reducer";
import { colorTheme } from "../../../../constants";
import { ContextCatalogs } from "../../contexts";
import AttributeMenu from "./AttributeMenu";
import getMenuItems from "./getMenuItems";
import getListIcon from "./getListIcon";

const useStyles = makeStyles({
  listitem: {
    padding: "8px 13px",
    "align-items": "stretch",
  },
  listitemIcon: {
    "font-size": "17px !important",
  },
  listitemLabel: {
    "max-width": 300,
    "white-space": "nowrap",
    "text-overflow": "ellipsis",
    overflow: "hidden",
    "margin-left": 15,
  },
  countLabel: {
    color: colorTheme,
    "text-align": "right",
    "margin-right": 15,
  },
  countIcon: {
    color: colorTheme,
    "font-size": "17px !important",
    "margin-right": 5,
  },
  flex1: {
    flex: 1,
  },
});

interface IAttributeListItem {
  id: string;
  label: string;
  attributesInputted: string;
  attributesSelected: string[];
  multiCatalog: boolean;
  multiLanguage: boolean;
  scope: string[];
  dispatchModal: React.Dispatch<unknown>;
}

const AttributeListItem = ({
  id,
  label,
  attributesInputted,
  attributesSelected,
  multiCatalog,
  multiLanguage,
  scope,
  dispatchModal,
}: IAttributeListItem) => {
  const classes = useStyles({});
  const catalogs = React.useContext(ContextCatalogs);
  const menuRef = React.useRef(null);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const onListItemClick = React.useCallback(() => {
    if (!multiCatalog && !multiLanguage) {
      dispatchModal({ type: ACT_MODAL.ATTRIBUTES_SELECTED, id });
    } else {
      setMenuOpen(true);
    }
  }, [dispatchModal, id, multiCatalog, multiLanguage]);
  const onMenuClose = React.useCallback(() => {
    setMenuOpen(false);
  }, []);
  const onMenuClick = React.useCallback(
    (id: string) => {
      dispatchModal({ type: ACT_MODAL.ATTRIBUTES_SELECTED, id });
    },
    [dispatchModal]
  );

  const menuItems = getMenuItems({
    id,
    idsSelected: attributesSelected,
    catalogs,
    multiCatalog,
    multiLanguage,
    scope,
    onClick: onMenuClick,
  });
  const attributesId = !menuItems.length
    ? [id]
    : menuItems.filter((c) => !c.title).map((c) => c.id);
  const [icon, iconColor] = getListIcon(attributesId, attributesSelected);

  return (
    <>
      <ListItem
        ref={menuRef}
        button
        className={classes.listitem}
        onClick={onListItemClick}
        selected={menuOpen}
      >
        <Icon
          className={classes.listitemIcon}
          style={{ color: iconColor }}
          children={icon}
        />
        <Typography
          variant="body1"
          className={classes.listitemLabel}
          children={boldSearchText(attributesInputted, label)}
        />
        <div className={classes.flex1} />
        {!menuItems.length ? null : (
          <>
            {!multiCatalog ? null : (
              <Icon
                className={classes.countIcon}
                children={multiLanguage ? "flag" : "auto_stories"}
              />
            )}
            <Typography
              variant="body1"
              className={classes.countLabel}
              children={
                menuItems.filter((a) => a.selected).length +
                "/" +
                menuItems.filter((a) => !a.title).length
              }
            />
          </>
        )}
      </ListItem>
      <AttributeMenu
        dispatchModal={dispatchModal}
        open={menuOpen}
        titleLabel={multiLanguage ? "Select languages" : "Select catalogs"}
        titleIcon={multiLanguage ? "flag" : "auto_stories"}
        items={menuItems}
        anchorEl={menuRef.current}
        onClose={onMenuClose}
        attributesSelected={attributesSelected}
      />
    </>
  );
};

export default AttributeListItem;
