import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Toolbar from "@material-ui/core/Toolbar";
import BtnViewsConfig from "./BtnViewsConfig";
import BtnReadys from "./BtnReadys";
import BtnViewsAssign from "./BtnViewsAssign";
import BtnDownloads from "./BtnDownloads";
import { IContentSort, IFilter, IProduct } from "../../../interfaces";
import { IColumnsSets } from "../../../componentsBase/StickyGrid";
import BtnPrefSorting from "./BtnPrefSorting";
import Divider from "@material-ui/core/Divider";
import GridPagination from "./GridPagination";
import GridSelectItems from "./GridSelectItems";
import BtnItemsSelected from "./BtnItemsSelected";
import BtnRefresh from "./BtnRefresh";
import SelectCatalog from "./SelectCatalog";
import SelectMedia from "./SelectMedia";

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
  filters: IFilter[];
  items: IProduct[];
  itemsIdSelected: string[];
  itemsTotal: number;
  catalogId: string;
  languageId: string;
  loadOnlySelected: boolean;
  columnsSets: IColumnsSets[];
  sortsContent: IContentSort[];
  paginationSize: number;
  paginationValue: number;
  searchStatus: string;
  setSearchTime: (n: number) => void;
  gridShowMediaReady: boolean;
}

const ToolbarHeader = ({
  filters,
  loadOnlySelected,
  columnsSets,
  items,
  itemsIdSelected,
  itemsTotal,
  catalogId,
  languageId,
  sortsContent,
  paginationSize,
  paginationValue,
  searchStatus,
  setSearchTime,
  gridShowMediaReady,
}: IToolbarHeader) => {
  const classes = useStyles({});

  return (
    <>
      <Toolbar className={classes.toolbar}>
        <SelectCatalog
          catalogId={catalogId}
          languageId={languageId}
          filters={filters}
          sortsContent={sortsContent}
        />
        <SelectMedia gridShowMediaReady={gridShowMediaReady} />
        <div className={classes.flex1} />
        <BtnViewsConfig itemsIdSelected={itemsIdSelected} />
        <BtnReadys itemsIdSelected={itemsIdSelected} />
        <BtnViewsAssign itemsIdSelected={itemsIdSelected} />
        <BtnDownloads
          columnsSets={columnsSets}
          itemsIdSelected={itemsIdSelected}
          catalogId={catalogId}
          languageId={languageId}
        />
      </Toolbar>
      <Toolbar className={classes.toolbar}>
        <GridSelectItems
          items={items}
          itemsIdSelected={itemsIdSelected}
          itemsTotal={itemsTotal}
        />
        <BtnItemsSelected
          loadOnlySelected={loadOnlySelected}
          itemsIdSelected={itemsIdSelected}
        />
        <BtnPrefSorting sortsContent={sortsContent} />
        <div className={classes.flex1} />
        <BtnRefresh searchStatus={searchStatus} setSearchTime={setSearchTime} />
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
