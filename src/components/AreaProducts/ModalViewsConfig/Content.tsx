import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import { Category, IProduct } from "../../../interfaces";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import { Table, TableHeader } from "./Table";
import { IViewDraft } from "./reducer";
import { ContextViews } from "../contexts";

const useStyles = makeStyles(() => ({
  modalContent: {
    flex: 1,
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
    overflow: "hidden",
  },
  list: {
    "max-height": 460,
    "overflow-y": "overlay",
    "overflow-x": "hidden",
  },
}));

interface IContent {
  dispatch: React.Dispatch<unknown>;
  items: IProduct[];
  views: IViewDraft[];
}

const Content = ({ dispatch, items, views }: IContent) => {
  const classes = useStyles({});
  const tenantViews = React.useContext(ContextViews);
  const tenantViewsGroupped = tenantViews.reduce(
    (acc, { viewName, category }) => {
      if (!acc[category]) acc[category] = [];
      acc[category].push(viewName);
      acc[category] = acc[category].sort();
      return acc;
    },
    {}
  );

  return (
    <div className={classes.modalContent}>
      <TableHeader />
      <Divider />
      <List className={classes.list}>
        {(Object.keys(tenantViewsGroupped) as Category[]).map((category) => (
          <Table
            key={category}
            dispatch={dispatch}
            category={category}
            views={views}
            items={items}
            rows={tenantViewsGroupped[category]}
          />
        ))}
      </List>
      <Divider />
    </div>
  );
};

export default Content;
