import * as React from "react";
import BtnMediaDownload from "./BtnMediaDownload";
import BtnDeleteMedia from "./BtnDeleteMedia";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Toolbar from "@material-ui/core/Toolbar";
import { IItemEs, IItemStagingArea } from "../../../interfaces";
import Divider from "@material-ui/core/Divider";
import BtnItemsSelected from "./BtnItemsSelected";
import BtnRefresh from "./BtnRefresh";
import GridPagination from "./GridPagination";
import GridSelectItems from "./GridSelectItems";

const useStyles = makeStyles({
  toolbar: {
    position: "relative",
    padding: "0 5px",
  },
  flex1: {
    flex: 1,
  },
  divider: {
    margin: "0 10px",
  },
});

interface IToolbarHeader {
  items: IItemEs<IItemStagingArea>[];
  itemsIdSelected: string[];
  itemsTotal: number;
  loadOnlySelected: boolean;
  searchStatus: string;
  setSearchTime: (n: number) => void;
  paginationSize: number;
  paginationValue: number;
}

const ToolbarHeader = ({
  items,
  itemsIdSelected,
  itemsTotal,
  loadOnlySelected,
  searchStatus,
  setSearchTime,
  paginationSize,
  paginationValue,
}: IToolbarHeader) => {
  const classes = useStyles({});

  return (
    <>
      <Toolbar className={classes.toolbar}>
        <div className={classes.flex1} />
        <BtnDeleteMedia itemsIdSelected={itemsIdSelected} />
        <BtnMediaDownload itemsIdSelected={itemsIdSelected} />
      </Toolbar>
      <Toolbar className={classes.toolbar}>
        <GridSelectItems
          items={items}
          itemsIdSelected={itemsIdSelected}
          itemsTotal={itemsTotal}
        />
        <BtnItemsSelected
          itemsIdSelected={itemsIdSelected}
          loadOnlySelected={loadOnlySelected}
        />
        <div className={classes.flex1} />
        <BtnRefresh setSearchTime={setSearchTime} searchStatus={searchStatus} />
        <GridPagination
          itemsTotal={itemsTotal}
          paginationSize={paginationSize}
          paginationValue={paginationValue}
          loadOnlySelected={loadOnlySelected}
        />
      </Toolbar>
      <Divider className={classes.divider} />
    </>
  );
};

export default ToolbarHeader;
