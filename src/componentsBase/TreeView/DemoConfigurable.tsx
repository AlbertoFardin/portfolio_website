import * as React from "react";
import { ITreeItem } from "./interfaces";
import TreeView from "./TreeView";
import mockItems from "./_mockItems.json";
import { makeStyles } from "@material-ui/core/styles";
import Btn from "../Btn";
import FieldText from "../Field/FieldText";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { action } from "@storybook/addon-actions";

const useStyles = makeStyles({
  demo: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    width: "100%",
    overflow: "hidden",
  },
  panelWithTreeView: {
    overflowX: "hidden",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    width: 350,
  },
  panelWithConfig: {
    overflowX: "hidden",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    padding: 20,
    margin: 20,
    "background-color": "#f9f9fc",
  },
  confField: {
    margin: "40px 5px 10px",
    "background-color": "#fff",
  },
  confButton: {
    margin: "10px 0 0",
    "text-align": "left",
  },
});

const TreeViewDemo = () => {
  const classes = useStyles({});

  const [selectable, setSelectable] = React.useState(true);
  const [expanded, setExpanded] = React.useState([] as string[]);
  const [selected, setSelected] = React.useState([] as string[]);
  const [items, setItems] = React.useState(mockItems as ITreeItem[]);

  const onTreeViewClick = React.useCallback((id: string) => {
    action("onClick")(id);
  }, []);
  const onTreeViewCheck = React.useCallback(
    (id: string) => {
      action("onCheck")(id);
      const ids = Array.from(selected);
      const index = ids.findIndex((i) => i === id);
      if (index === -1) {
        ids.push(id);
      } else {
        ids.splice(index, 1);
      }
      setSelected(ids);
    },
    [selected]
  );
  const onTreeViewToggle = React.useCallback(
    (id: string) => {
      action("onToggle")(id);
      const ids = Array.from(expanded);
      const index = ids.findIndex((i) => i === id);
      if (index === -1) {
        ids.push(id);
      } else {
        ids.splice(index, 1);
      }
      setExpanded(ids);
    },
    [expanded]
  );
  const onChangeItems = React.useCallback((s: string) => {
    try {
      setItems(JSON.parse(s));
    } catch {
      console.warn("onChangeItems");
    }
  }, []);
  const onChangeExpanded = React.useCallback((s: string) => {
    setExpanded(s.split(", "));
  }, []);
  const onChangeSelected = React.useCallback((s: string) => {
    setSelected(s.split(", "));
  }, []);
  const onExpandAll = React.useCallback(() => {
    setExpanded(expanded.length ? [] : items.map((c) => c.id));
  }, [expanded.length, items]);
  const onSelectAll = React.useCallback(() => {
    setSelected(selected.length ? [] : items.map((c) => c.id));
  }, [items, selected.length]);
  const onSelectable = React.useCallback(() => {
    setSelectable(!selectable);
  }, [selectable]);

  return (
    <div className={classes.demo}>
      <div className={classes.panelWithTreeView}>
        <TreeView
          style={{ margin: 15 }}
          items={items}
          selectable={selectable}
          expanded={expanded}
          selected={selected}
          onClick={onTreeViewClick}
          onCheck={onTreeViewCheck}
          onToggle={onTreeViewToggle}
        />
      </div>
      <Paper className={classes.panelWithConfig}>
        <Typography
          style={{ textAlign: "right" }}
          variant="subtitle2"
          children="Configurations"
        />
        <Btn
          variant="bold"
          label={expanded.length ? "COLLAPSE ALL" : "EXPAND ALL"}
          icon="edit"
          onClick={onExpandAll}
          className={classes.confButton}
        />
        <Btn
          variant="bold"
          label={selected.length ? "DESELECT ALL" : "SELECT ALL"}
          icon="edit"
          onClick={onSelectAll}
          className={classes.confButton}
        />
        <Btn
          variant="bold"
          label="selectable"
          icon={selectable ? "check_box" : "check_box_outline_blank"}
          onClick={onSelectable}
          className={classes.confButton}
        />
        <FieldText
          label="items JSON"
          value={JSON.stringify(items, null, "\t")}
          multiline
          onChange={onChangeItems}
          className={classes.confField}
        />
        <FieldText
          label="expanded ids"
          value={expanded.join(", ")}
          multiline
          onChange={onChangeExpanded}
          className={classes.confField}
        />
        <FieldText
          label="selected ids"
          value={selected.join(", ")}
          multiline
          onChange={onChangeSelected}
          className={classes.confField}
        />
      </Paper>
    </div>
  );
};

export default TreeViewDemo;
