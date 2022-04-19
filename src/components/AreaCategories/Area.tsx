import * as React from "react";
import Btn from "../../componentsBase/Btn";
import reducer, { reducerInitState, ACT_VPORT } from "./reducer";
import Content from "./Content";
import Toolbar from "@material-ui/core/Toolbar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import FieldSearch from "../FieldSearch";
import PanelDetail from "./PanelDetail";
import columns from "./columns";
import { searchCategories } from "../../api/fetchesApi";
import SelectLanguage from "./SelectLanguage";

const useStyles = makeStyles({
  viewport: {
    flex: 1,
    position: "relative",
    display: "flex",
    "flex-direction": "column",
  },
  flex1: {
    flex: 1,
  },
  toolbar: {
    padding: "0 15px",
  },
});

const Area = () => {
  const classes = useStyles({});
  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const {
    loading,
    items,
    itemsIdSelected,
    detailSheet,
    searchInput,
    language,
  } = state;
  const onRefresh = React.useCallback(() => {
    dispatch({ type: ACT_VPORT.REFRESH });
  }, []);
  const onSearchInput = React.useCallback((value: string) => {
    dispatch({ type: ACT_VPORT.SEARCH, value });
  }, []);

  // get items
  React.useEffect(() => {
    if (loading) {
      (async () => {
        const { items } = await searchCategories({});
        dispatch({ type: ACT_VPORT.ITEMS_UPDATE, items });
      })();
    }
  }, [loading]);

  return (
    <>
      <div className={classes.viewport}>
        <Toolbar className={classes.toolbar}>
          <FieldSearch
            placeholder="Search categories..."
            value={searchInput}
            onChange={onSearchInput}
          />
          <SelectLanguage
            items={items}
            language={language}
            dispatchViewport={dispatch}
          />
        </Toolbar>
        <Divider />
        <Content
          dispatchViewport={dispatch}
          loading={loading}
          items={items}
          itemsIdSelected={itemsIdSelected}
          columns={columns}
          detailSheet={detailSheet}
          searchInput={searchInput}
          language={language}
        />
        <Divider />
        <Toolbar className={classes.toolbar}>
          <div className={classes.flex1} />
          <Btn
            icon="refresh"
            tooltip="Refresh"
            onClick={onRefresh}
            disabled={loading}
          />
          <Typography
            variant="body1"
            style={{ margin: 10 }}
            children={`${items.length} categories`}
          />
        </Toolbar>
      </div>
      <PanelDetail
        dispatchViewport={dispatch}
        items={items}
        itemsIdSelected={itemsIdSelected}
        detailSheet={detailSheet}
      />
    </>
  );
};

export default Area;
