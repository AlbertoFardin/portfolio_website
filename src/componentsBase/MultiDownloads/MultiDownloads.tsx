import CircularProgress from "@material-ui/core/CircularProgress";
import Collapse from "@material-ui/core/Collapse";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Toolbar from "@material-ui/core/Toolbar";
import classnames from "classnames";
import * as React from "react";
import TypographyEllipsis from "../TypographyEllipsis";
import Btn from "../Btn";
import { emptyFn } from "../utils/common";
import BtnClickDownload from "./BtnClickDownload";
import BtnAutoDownload from "./BtnAutoDownload";
import * as Colors from "../style/Colors";
import { IMultiDownloads } from ".";
import { v4 as uuidv4 } from "uuid";
import Draggable from "react-draggable";
import Portal from "@material-ui/core/Portal";
import { ZINDEX_DRAGGABLED } from "../utils/zIndex";

const dragCls = `multidownload_drag_${uuidv4()}`;
const useStyles = makeStyles({
  multidownloads: {
    position: "absolute" as const,
    "z-index": ZINDEX_DRAGGABLED,
    width: 410,
    bottom: 25,
    right: 25,
    overflow: "hidden",
  },
  toolbar: {
    "background-color": Colors.Gray4,
    padding: "0px 18px",
  },
  toolbarLabel: {
    margin: "0 10px",
    flex: 1,
  },
  toolbarButton: {
    margin: "0 !important",
  },
  list: {
    padding: 0,
    "max-height": 143,
    "overflow-y": "overlay",
  },
  listitem: {
    height: 40,
    padding: "3px 10px 3px 20px",
    overflow: "hidden",
  },
  listContainer: {
    padding: "0 5px 5px 5px",
  },
  listitemLabel: {
    "margin-right": 10,
  },
});

const MultiDownloads = ({
  className,
  style,
  items = [],
  onClose = emptyFn,
  open = false,
}: IMultiDownloads) => {
  const classes = useStyles({});
  const [expanded, setExpanded] = React.useState(true);
  const onCbExpanded = React.useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  if (!open) return null;

  return (
    <Portal>
      <Draggable handle={`.${dragCls}`} bounds="parent">
        <Paper
          style={style}
          className={classnames({
            [classes.multidownloads]: true,
            [className]: !!className,
          })}
          elevation={13}
        >
          <Toolbar className={classnames([dragCls, classes.toolbar])}>
            <Btn
              className={classes.toolbarButton}
              icon={expanded ? "expand_more" : "expand_less"}
              onClick={onCbExpanded}
            />

            <TypographyEllipsis
              className={classes.toolbarLabel}
              variant="body1"
              noWrap
              children="Downloads"
            />

            <Btn
              className={classes.toolbarButton}
              icon="close"
              onClick={onClose}
            />
          </Toolbar>
          <Collapse in={expanded} timeout="auto">
            <Divider />
            <div className={classes.listContainer}>
              <List className={classes.list}>
                {items.map((item) => (
                  <ListItem key={item.id} dense className={classes.listitem}>
                    <TypographyEllipsis
                      className={classes.listitemLabel}
                      variant="subtitle1"
                      style={{ flex: 1 }}
                      noWrap
                      children={item.name}
                      endLength={7}
                    />

                    {item.loading ? (
                      <CircularProgress
                        style={{ padding: "0 10px" }}
                        size={16}
                      />
                    ) : null}

                    {!item.loading && item.onClick ? (
                      <BtnClickDownload
                        url={item.url}
                        name={item.name}
                        onClick={item.onClick}
                      />
                    ) : null}

                    {!item.loading && !item.onClick ? (
                      <BtnAutoDownload url={item.url} name={item.name} />
                    ) : null}
                  </ListItem>
                ))}
              </List>
            </div>
          </Collapse>
        </Paper>
      </Draggable>
    </Portal>
  );
};

export default MultiDownloads;
