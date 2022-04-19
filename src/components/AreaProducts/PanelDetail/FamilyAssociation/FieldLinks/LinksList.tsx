import * as React from "react";
import * as Colors from "../../../../../componentsBase/style/Colors";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import LinksListItem from "./LinksListItem";
import { IProduct } from "../../../../../interfaces";
import LoadingMask from "../../../../../componentsBase/LoadingMask";
import isEmpty from "lodash-es/isEmpty";
import ListItem from "../../../../../componentsBase/ListItem";

const useStyles = makeStyles({
  listContainer: {
    position: "relative",
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
    overflow: "hidden",
    flex: 1,
  },
  list: {
    flex: 1,
    overflow: "auto",
  },
  listMoreResults: {
    color: Colors.Gray2,
    padding: "5px 35px",
  },
  listSelectAll: {
    padding: "0 8px",
  },
  listSelectAllLabel: {
    "font-weight": "bold",
  },
  placeholder: {
    color: Colors.Gray2,
    margin: "10px auto",
  },
});

interface ILinksList {
  searched: boolean;
  loading: boolean;
  items: IProduct[];
  itemsTotal: number;
  itemsIdSelected: string[];
  readOnly: boolean;
  onClick: (ids: string[]) => void;
}

const LinksList = ({
  searched,
  loading,
  items,
  itemsTotal,
  itemsIdSelected,
  readOnly,
  onClick,
}: ILinksList) => {
  const classes = useStyles({});
  const setSelected = new Set(itemsIdSelected);
  const selectedAll = !items.find((item) => !setSelected.has(item.id));

  const onClickListItem = React.useCallback(
    (id) => {
      onClick([id]);
    },
    [onClick]
  );
  const onclickSelectAll = React.useCallback(() => {
    onClick(items.map(({ id }) => id));
  }, [onClick, items]);

  if (!loading && isEmpty(items)) {
    return (
      <Typography
        className={classes.placeholder}
        variant="body1"
        children={searched ? "No key found" : "No key associated"}
      />
    );
  }

  return (
    <div className={classes.listContainer}>
      <LoadingMask open={loading} />
      <List className={classes.list}>
        {!searched ? null : (
          <ListItem
            id="selectall"
            icon={selectedAll ? "check_box" : "check_box_outline_blank"}
            label={`${selectedAll ? "Deselect" : "Select"} all ${
              items.length
            } match`}
            className={classes.listSelectAll}
            classNameLabel={classes.listSelectAllLabel}
            onClick={onclickSelectAll}
          />
        )}
        {items.map((item) => (
          <LinksListItem
            key={item.id}
            data={item}
            selected={setSelected.has(item.id)}
            readOnly={readOnly}
            onClick={onClickListItem}
          />
        ))}
        {items.length === itemsTotal ? null : (
          <Typography
            className={classes.listMoreResults}
            variant="body1"
            children={`${itemsTotal - items.length} more results...`}
          />
        )}
      </List>
    </div>
  );
};

export default LinksList;
