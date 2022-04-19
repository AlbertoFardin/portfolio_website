import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import IconCollapse from "../../../../componentsBase/IconCollapse";
import { IProduct, Category } from "../../../../interfaces";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import ButtonBase from "@material-ui/core/ButtonBase";
import TableRow from "./TableRow";
import { colorTheme } from "../../../../constants";
import { IViewDraft, ViewStatus } from "../reducer";

const useStyles = makeStyles(() => ({
  button: {
    color: colorTheme,
    height: 50,
    padding: "0 12px",
    width: "100%",
  },
  list: {
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
    padding: "0 30px",
  },
  flex1: {
    flex: 1,
  },
}));

interface ITableGroup {
  dispatch: React.Dispatch<unknown>;
  items: IProduct[];
  category: Category;
  views: IViewDraft[];
  rows: string[];
}

const TableGroup = ({
  dispatch,
  items,
  category,
  views,
  rows,
}: ITableGroup) => {
  const classes = useStyles({});
  const [open, setOpen] = React.useState(true);
  const toggleOpen = React.useCallback(() => setOpen(!open), [open]);
  return (
    <>
      <ButtonBase className={classes.button} onClick={toggleOpen}>
        <IconCollapse collapse={!open} />
        <Typography variant={"body2"} children={category} />
        <div className={classes.flex1} />
      </ButtonBase>
      <Collapse in={open}>
        <div className={classes.list}>
          {rows.map((viewName) => {
            const viewDraft = views.find((v) => v.id === viewName);
            const viewDraftDefault: IViewDraft = {
              id: viewName,
              status: ViewStatus.NONE,
              data: {},
            };
            return (
              <TableRow
                key={viewName}
                dispatch={dispatch}
                viewDraft={viewDraft || viewDraftDefault}
                items={items}
              />
            );
          })}
        </div>
      </Collapse>
    </>
  );
};

export default TableGroup;
