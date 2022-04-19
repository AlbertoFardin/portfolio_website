import * as React from "react";
import Btn from "../../componentsBase/Btn";
import { colorTheme, AREA_ATTRIBUTES } from "../../constants";
import { getJsonDocument, saveJsonDocument } from "../../api/fetchesApi";
import reducer, { reducerInitState, ACT_VPORT } from "./reducer";
import Content from "./Content";
import Toolbar from "@material-ui/core/Toolbar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Divider from "@material-ui/core/Divider";
import FieldSearch from "../FieldSearch";
import { ContextPermissions } from "../contexts";
import columns from "./columns";
import PanelDetail from "./PanelDetail";
import getDocument from "./getDocument";
import permissionsCheck from "../../utils/permissionsCheck";
import PERMISSIONS from "../../permissions";
import { ContextDispatchViewport } from "./contexts";
import isEmpty from "lodash-es/isEmpty";
import last from "lodash-es/last";

const viewId = AREA_ATTRIBUTES;
const useStyles = makeStyles({
  viewport: {
    flex: 1,
    position: "relative",
    display: "flex",
    "flex-direction": "column",
  },
  toolbar: {
    padding: "0 15px",
  },
});

const Area = () => {
  const classes = useStyles({});
  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const {
    updating,
    reseting,
    userHash,
    userVersion,
    confVersion,
    items,
    itemsIdSelected,
    detailSheet,
    searchInput,
  } = state;
  const onSearchInput = React.useCallback((value: string) => {
    dispatch({ type: ACT_VPORT.SEARCH_INPUT, value });
  }, []);
  const onCreateAttribute = React.useCallback(() => {
    dispatch({ type: ACT_VPORT.ITEMS_ADD });
  }, [dispatch]);

  const permissions = React.useContext(ContextPermissions);
  const canEdit =
    process.env.ENV === "prod"
      ? false
      : permissionsCheck({
          keys: [PERMISSIONS.manage_product_attribute],
          permissions,
        });
  const conflicts = confVersion !== userVersion;
  const loading = updating || reseting;

  // get init and user configurations
  React.useEffect(() => {
    if (isEmpty(items)) {
      (async () => {
        const docConf = await getDocument();
        const docJson = await getJsonDocument({
          docId: viewId,
          document: docConf,
        });
        dispatch({
          type: ACT_VPORT.ITEMS_UPDATE,
          docConf,
          docJson,
        });
      })();
    }
  }, [items]);

  // reset current configurations to init
  React.useEffect(() => {
    if (reseting) {
      (async () => {
        const docConf = await getDocument();
        const docJson = await saveJsonDocument({
          docId: viewId,
          hash: userHash,
          document: docConf,
        });
        dispatch({
          type: ACT_VPORT.ITEMS_UPDATE,
          docConf,
          docJson,
        });
      })();
    }
  }, [reseting, userHash]);

  // save new configurations
  React.useEffect(() => {
    if (updating) {
      (async () => {
        const docJson = await saveJsonDocument({
          docId: viewId,
          hash: userHash,
          document: { version: userVersion, items },
        });
        dispatch({ type: ACT_VPORT.ITEMS_SAVE_HASH, docJson });
      })();
    }
  }, [items, updating, userHash, userVersion]);

  return (
    <ContextDispatchViewport.Provider value={dispatch}>
      <div className={classes.viewport}>
        <Toolbar className={classes.toolbar}>
          <FieldSearch
            placeholder="Search attributes..."
            value={searchInput}
            onChange={onSearchInput}
          />
          <div style={{ flex: 1 }} />
          {!canEdit ? null : (
            <Btn
              color={colorTheme}
              variant="bold"
              icon="add"
              label="Create new attribute"
              disabled={loading}
              onClick={onCreateAttribute}
            />
          )}
        </Toolbar>
        <Divider />
        <Content
          conflicts={conflicts}
          loading={loading}
          columns={columns}
          searchInput={searchInput}
          detailSheet={detailSheet}
          items={items}
          itemsIdSelected={itemsIdSelected}
        />
      </div>
      <PanelDetail
        readOnly={!canEdit}
        loading={loading}
        assetData={items.find((item) => item.id === last(itemsIdSelected))}
        detailSheet={detailSheet}
      />
    </ContextDispatchViewport.Provider>
  );
};

export default Area;
