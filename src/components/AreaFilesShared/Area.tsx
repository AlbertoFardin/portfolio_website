import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Divider from "@material-ui/core/Divider";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { ApolloProvider } from "@apollo/client";
import { client } from "../../api/graphqlAPI";
import Content from "./Content";
import reducer, { reducerInitState, ACTION } from "./reducer";
import Btn from "../../componentsBase/Btn";
import * as Colors from "../../componentsBase/style/Colors";
import useSearchEs from "./useSearchEs";
import { useLocation } from "react-router-dom";
import PlaceholderNoLink from "./PlaceholderNoLink";
import Breadcrumb from "../Breadcrumb";
import { getItemActions, MAP_TYPE } from "./actions";
import BtnAction from "./BtnAction";
import DrawerDetail, { BtnToggle } from "../DrawerDetail";
import SheetContent from "./SheetContent";
import TypographyEllipsis from "../../componentsBase/TypographyEllipsis";
import { SheetLayout, SheetStatus } from "../../interfaces";

const useStyles = makeStyles({
  main: {
    position: "relative",
    flex: 1,
    display: "flex",
    height: "100%",
    width: "100%",
    "flex-direction": "column",
    "align-items": "stretch",
  },
  toolbarMain: {
    "background-color": Colors.Gray4,
  },
  flexRow: {
    position: "relative",
    flex: 1,
    display: "flex",
    "flex-direction": "row",
    "align-items": "stretch",
    "min-height": 0, // fix sidepanels height
  },
  viewport: {
    flex: 1,
    position: "relative",
    display: "flex",
    "flex-direction": "column",
  },
  flex1: {
    flex: 1,
  },
});

const Area = () => {
  const classes = useStyles({});
  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const {
    keyboardDown,
    initializing,
    items,
    itemsIdSelected,
    itemsTotal,
    itemLastSelectedIndex,
    folders,
    sort,
    paginationSize,
    paginationValue,
    error,
    detailSheet,
    assetDataId,
  } = state;
  const assetData = items.find((item) => item.id === assetDataId);
  const location = useLocation();
  const { setSearchTime, searchRes } = useSearchEs({
    folders,
    sort,
    paginationValue,
    paginationSize,
    link: location.search.replace("?link=", ""),
  });
  const onBreadcrumbClick = React.useCallback((id: string) => {
    dispatch({ type: ACTION.BREADCRUMB, id });
  }, []);
  const onRefresh = React.useCallback(() => {
    setSearchTime(new Date().getTime());
  }, [setSearchTime]);
  const onActionClick = React.useCallback((event, id) => {
    const type = MAP_TYPE[id];
    if (type) dispatch({ type });
  }, []);
  const onSheetChange = React.useCallback((layout: SheetLayout) => {
    dispatch({ type: ACTION.SHEET_LAYOUT, layout });
  }, []);
  const onSheetReset = React.useCallback(() => {
    dispatch({ type: ACTION.ITEMS_DESELECT });
  }, []);
  const loading = searchRes.status === "loading";
  const detailOpen = detailSheet === SheetLayout.OPENED;

  // get items after change filters
  React.useEffect(() => {
    if (paginationValue || paginationSize || sort || folders) {
      setSearchTime(new Date().getTime());
    }
  }, [paginationSize, paginationValue, setSearchTime, sort, folders]);

  // get items on first initialization
  React.useEffect(() => {
    if (initializing) setSearchTime(new Date().getTime());
  }, [initializing, setSearchTime]);

  // save new items in reducer after fetch
  React.useEffect(() => {
    if (searchRes.result) dispatch({ type: ACTION.SET, ...searchRes.result });
  }, [searchRes.result]);

  if (error) {
    console.log("-> Error:", error);
    return <PlaceholderNoLink />;
  }

  return (
    <div className={classes.main}>
      <Toolbar className={classes.toolbarMain}>
        <Typography variant="h3" children="SeeCommerce" />
      </Toolbar>
      <Divider />
      <div className={classes.flexRow}>
        <ApolloProvider client={client}>
          <div className={classes.viewport}>
            <Toolbar>
              <Breadcrumb
                path={folders.map((f) => ({
                  id: f.id,
                  name: f.label,
                  owner: "",
                }))}
                onClick={onBreadcrumbClick}
              />
              {getItemActions({
                contextmenu: false,
                detailOpen,
                items,
                itemsIdSelected,
              }).map((a) => (
                <BtnAction key={a.id} {...a} onClick={onActionClick} />
              ))}
            </Toolbar>
            <Divider />
            <Content
              dispatch={dispatch}
              items={items}
              itemsTotal={itemsTotal}
              itemsIdSelected={itemsIdSelected}
              itemLastSelectedIndex={itemLastSelectedIndex}
              sort={sort}
              searchStatus={searchRes.status}
              assetDataId={assetDataId}
              detailOpen={detailOpen}
              keyboardDown={keyboardDown}
            />
            <Divider />
            <Toolbar>
              <div className={classes.flex1} />
              <Btn
                icon="refresh"
                tooltip="Refresh"
                disabled={loading}
                onClick={onRefresh}
              />
            </Toolbar>
          </div>
          <DrawerDetail
            layout={detailSheet}
            onChange={onSheetChange}
            onReset={onSheetReset}
            status={!assetDataId ? SheetStatus.PHOLDER : SheetStatus.VISIBLE}
            title={
              <>
                <TypographyEllipsis
                  variant="body2"
                  children={assetData && assetData.name}
                />
                <div style={{ flex: 1 }} />
                <BtnToggle layout={detailSheet} onChange={onSheetChange} />
              </>
            }
            content={
              <SheetContent
                dispatchViewport={dispatch}
                fullscreen={detailSheet === SheetLayout.FULLSCREEN}
                assetData={assetData}
              />
            }
          />
        </ApolloProvider>
      </div>
    </div>
  );
};

export default Area;
