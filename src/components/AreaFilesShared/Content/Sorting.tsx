import Btn from "../../../componentsBase/Btn";
import * as React from "react";
import { ISort } from "../../../interfaces";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import { ACTION, SORTS } from "../reducer";
import { ISortOrder } from "../../../componentsBase/StickyGrid";

const useStyles = makeStyles({
  sorting: {
    position: "absolute",
    top: 7,
    right: 15,
    "z-index": 2,
    padding: 5,
  },
});

interface ISorting {
  dispatch: React.Dispatch<unknown>;
  sort: ISort;
}

const Sorting = ({ dispatch, sort }: ISorting) => {
  const classes = useStyles({});
  const onSortOrderChange = React.useCallback(() => {
    dispatch({ type: ACTION.SORT_ORDER });
  }, [dispatch]);
  const onSortIdChange = React.useCallback(
    (event, id) => {
      dispatch({ type: ACTION.SORT_ID, id });
    },
    [dispatch]
  );

  return (
    <Paper className={classes.sorting} elevation={2}>
      <Btn
        label={sort.label}
        menu={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          items: SORTS.map(({ id, label }) => ({
            id,
            label,
            onClick: onSortIdChange,
          })),
        }}
      />
      <Btn
        icon={sort.order === ISortOrder.ASC ? "arrow_upward" : "arrow_downward"}
        onClick={onSortOrderChange}
      />
    </Paper>
  );
};

export default Sorting;
