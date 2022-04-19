import * as React from "react";
import { ITreeView } from "./interfaces";
import { emptyFn } from "../utils/common";
import getChildren from "./getChildren";
import TreeItem from "./TreeItem";

const TreeView = ({
  style,
  className,
  items,
  expanded = [],
  selected = [],
  selectable = false,
  onClick = emptyFn,
  onCheck = emptyFn,
  onToggle = emptyFn,
}: ITreeView) => (
  <div style={style} className={className}>
    {getChildren(items).map((c) => (
      <TreeItem
        key={c.id}
        {...c}
        items={items}
        selectable={selectable}
        expanded={expanded}
        selected={selected}
        onClick={onClick}
        onCheck={onCheck}
        onToggle={onToggle}
      />
    ))}
  </div>
);

export default TreeView;
