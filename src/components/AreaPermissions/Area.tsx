import * as React from "react";
import reducer, { reducerInitState, ACT_VPORT } from "./reducer";
import PanelDetail from "./PanelDetail";
import Content from "./Content";
import { SheetLayout } from "../../interfaces";
import AreaContext from "./AreaContext";
import { getAdminPermissions } from "../../api/fetchesApi";

const Area = () => {
  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const { selectedId, items, itemsRefresh, detailSheet, searchInput } = state;

  const onChangeLayout = React.useCallback((layout: SheetLayout) => {
    dispatch({ type: ACT_VPORT.SHEET_LAYOUT, value: layout });
  }, []);
  const onResetLayout = React.useCallback(() => {
    dispatch({ type: ACT_VPORT.ITEMS_SELECT });
  }, []);

  React.useEffect(() => {
    (async () => {
      if (itemsRefresh) {
        const items = await getAdminPermissions();
        dispatch({ type: ACT_VPORT.ITEMS_SET, items });
      }
    })();
  }, [itemsRefresh]);

  return (
    <AreaContext dispatchViewport={dispatch}>
      <Content
        items={items}
        itemsRefresh={itemsRefresh}
        selectedId={selectedId}
        searchInput={searchInput}
      />
      <PanelDetail
        onResetLayout={onResetLayout}
        onChangeLayout={onChangeLayout}
        detailSheet={detailSheet}
        data={items.find(({ id }) => id === selectedId)}
      />
    </AreaContext>
  );
};

export default Area;
