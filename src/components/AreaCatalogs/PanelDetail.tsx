import * as React from "react";
import { ACT_VPORT } from "./reducer";
import DrawerDetail from "../DrawerDetail";
import {
  ICatalog,
  IColumnSc,
  SheetLayout,
  SheetStatus,
} from "../../interfaces";
import last from "lodash-es/last";
import SheetReadOnly from "../SheetReadOnly";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

interface IPanelDetail {
  dispatchViewport: React.Dispatch<unknown>;
  columns: IColumnSc[];
  items: ICatalog[];
  itemsIdSelected: string[];
  detailSheet: SheetLayout;
}

const PanelDetail = ({
  dispatchViewport,
  columns,
  items,
  itemsIdSelected,
  detailSheet,
}: IPanelDetail) => {
  const assetDataId = last(itemsIdSelected);
  const assetData = items.find((item) => item.id === assetDataId);
  const onChange = React.useCallback(
    (layout: SheetLayout) => {
      dispatchViewport({ type: ACT_VPORT.SHEET_LAYOUT, layout });
    },
    [dispatchViewport]
  );
  const onReset = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.ITEMS_DESELECT });
  }, [dispatchViewport]);

  return (
    <DrawerDetail
      layout={detailSheet}
      onChange={onChange}
      onReset={onReset}
      status={!assetDataId ? SheetStatus.PHOLDER : SheetStatus.VISIBLE}
      title={<Typography variant="body2" children="Catalog Detail" />}
      content={
        <>
          <Divider />
          <SheetReadOnly assetData={assetData} columns={columns} />
        </>
      }
    />
  );
};

export default PanelDetail;
