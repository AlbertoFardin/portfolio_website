import * as React from "react";
import { ACT_VPORT } from "./reducer";
import DrawerDetail from "../DrawerDetail";
import { IItemEs, ICategory, SheetLayout, SheetStatus } from "../../interfaces";
import last from "lodash-es/last";
import SheetReadOnly from "../SheetReadOnly";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import { TypeCell } from "../../componentsBase/StickyGrid";

interface IPanelDetail {
  dispatchViewport: React.Dispatch<unknown>;
  items: IItemEs<ICategory>[];
  itemsIdSelected: string[];
  detailSheet: SheetLayout;
}

const PanelDetail = ({
  dispatchViewport,
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
      title={<Typography variant="body2" children="Category Detail" />}
      content={
        !assetDataId ? null : (
          <>
            <Divider />
            <SheetReadOnly
              assetData={assetData.data}
              columns={Object.keys(assetData.data).map((key) => ({
                id: key,
                label: key,
                type: TypeCell.String,
                sortable: false,
                groupId: "default",
                width: 0,
                scope: [],
              }))}
            />
          </>
        )
      }
    />
  );
};

export default PanelDetail;
