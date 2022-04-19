import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import { colorTheme } from "../../../constants";

interface IListTitle {
  title: string;
  selectedIds?: string[];
}

const ListTitle = ({ title, selectedIds = [] }: IListTitle) => (
  <Toolbar
    style={{
      height: 40,
      minHeight: 0,
      padding: "0 10px",
    }}
  >
    <Typography variant="body2" children={title} />
    <div style={{ flex: 1 }} />
    <Typography
      style={{ color: colorTheme }}
      variant="body1"
      children={!selectedIds.length ? "" : `${selectedIds.length} selected`}
    />
  </Toolbar>
);

export default ListTitle;
