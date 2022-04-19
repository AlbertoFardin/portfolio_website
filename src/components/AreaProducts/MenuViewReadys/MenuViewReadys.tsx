import * as React from "react";
import List from "@material-ui/core/List";
import Popover from "@material-ui/core/Popover";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { IMenuViewReadys } from "../../../interfaces";
import getCatalogsByContentId from "../../../utils/getCatalogsByContentId";
import styles from "./styles";
import ListitemReady from "./ListitemReady";
import ListitemNotReady from "./ListitemNotReady";
import { ACT_VPORT } from "../reducer";
import Divider from "@material-ui/core/Divider";
import { ContextCatalogs, ContextDispatchViewport } from "../contexts";

const useStyles = makeStyles(styles);
const getCollapsedDefault = (n: number): boolean[] => new Array(n).fill(false);

const MenuViewReadys = ({
  open,
  positionTop,
  positionLeft,
  contentsCatalogs,
  contentsPublication,
  contentsReady,
  mediaId,
}: IMenuViewReadys) => {
  const classes = useStyles({});
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const catalogs = React.useContext(ContextCatalogs);

  const onClose = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.MENU_VIEW_READYS, reset: true });
  }, [dispatchViewport]);
  const catReadys = getCatalogsByContentId({
    catalogs: contentsReady,
    contentId: mediaId,
  });
  const catPublications = getCatalogsByContentId({
    catalogs: contentsPublication,
    contentId: mediaId,
  });
  const [collapses, setCollapses] = React.useState(
    getCollapsedDefault(catReadys.length)
  );
  const onCollapse = React.useCallback(
    (index: number) => {
      const collapsesNew = Array.from(collapses);
      collapsesNew[index] = !collapses[index];
      setCollapses(collapsesNew);
    },
    [collapses]
  );

  React.useEffect(() => {
    if (!open) setCollapses(getCollapsedDefault(catReadys.length));
  }, [catReadys.length, open]);

  return !open ? null : (
    <Popover
      open
      anchorReference="anchorPosition"
      anchorPosition={{
        top: positionTop,
        left: positionLeft,
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      onClose={onClose}
    >
      <List className={classes.list}>
        {contentsCatalogs.map((catId: string, i, a) => {
          const catalog = catalogs.find((c) => c.id === catId);
          const ready = catReadys.find((c) => c.catalog === catId);
          const divider = i + 1 !== a.length;
          const collapsed = !collapses[i];
          const label = catalog.displayName;

          return (
            <React.Fragment key={catId}>
              {!ready ? (
                <ListitemNotReady label={label} />
              ) : (
                <ListitemReady
                  index={i}
                  label={label}
                  instant={ready.instant}
                  collapsed={collapsed}
                  onCollapse={onCollapse}
                  publications={catPublications.filter(
                    (c) => c.catalog === catId
                  )}
                />
              )}
              {!divider ? null : <Divider className={classes.divider} />}
            </React.Fragment>
          );
        })}
      </List>
    </Popover>
  );
};

export default MenuViewReadys;
