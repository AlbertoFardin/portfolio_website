import Btn from "../../../componentsBase/Btn";
import * as React from "react";
import { ISort } from "../../../interfaces";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import { ACT_VPORT } from "../reducer";
import { ISortOrder } from "../../../componentsBase/StickyGrid";
import { SORTS } from "../constants";
import { ContextDispatchViewport } from "../contexts";

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
  sort: ISort;
}

const Sorting = ({ sort }: ISorting) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const classes = useStyles({});
  const onSortOrderChange = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.SORT_ORDER });
  }, [dispatchViewport]);
  const onSortIdChange = React.useCallback(
    (event, id) => {
      dispatchViewport({ type: ACT_VPORT.SORT_ID, id });
    },
    [dispatchViewport]
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
            active: sort.id === id,
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
