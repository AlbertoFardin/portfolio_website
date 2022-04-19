import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { ACT_VPORT } from "../reducer";
import DrawerDetail from "../../DrawerDetail";
import {
  SheetLayout,
  IAttribute,
  SheetStatus,
  AttributeType,
} from "../../../interfaces";
import columns from "../columns";
import SheetTitle from "./SheetTitle";
import SheetFooter from "./SheetFooter";
import Divider from "@material-ui/core/Divider";
import ListFields from "./ListFields";
import ListFieldsDict from "./ListFieldsDict";
import FieldAttributeType from "./ListFields/FieldAttributeType";
import { ContextDispatchViewport } from "../contexts";

const useStyles = makeStyles({
  content: {
    position: "relative",
    padding: 10,
    flex: 1,
    "overflow-x": "hidden",
    "overflow-y": "overlay",
  },
});

interface IPanelDetail {
  readOnly: boolean;
  loading: boolean;
  assetData: IAttribute;
  detailSheet: SheetLayout;
}

const PanelDetail = ({
  readOnly,
  loading,
  assetData,
  detailSheet,
}: IPanelDetail) => {
  const classes = useStyles({});
  const dispatchViewport = React.useContext(ContextDispatchViewport);

  const editable =
    !readOnly &&
    !!assetData &&
    !!assetData.id &&
    !!assetData.attributeType &&
    assetData.attributeType !== AttributeType.SYSTEM;

  const onSheetChange = React.useCallback(
    (layout: SheetLayout) => {
      dispatchViewport({ type: ACT_VPORT.SHEET_LAYOUT, layout });
    },
    [dispatchViewport]
  );
  const onSheetReset = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.ITEMS_DESELECT });
  }, [dispatchViewport]);
  const onDelete = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.ITEMS_DELETE });
  }, [dispatchViewport]);

  return (
    <DrawerDetail
      layout={detailSheet}
      onChange={onSheetChange}
      onReset={onSheetReset}
      status={!assetData ? SheetStatus.PHOLDER : SheetStatus.VISIBLE}
      title={<SheetTitle loading={loading} assetData={assetData} />}
      content={
        !assetData ? null : (
          <>
            <Divider />
            <div className={classes.content}>
              <FieldAttributeType
                value={assetData.attributeType}
                readOnly={readOnly}
              />
              <Divider style={{ margin: "20px 0" }} />
              <ListFields
                columns={columns}
                data={assetData}
                readOnly={!editable}
              />
              <ListFieldsDict
                columns={columns}
                data={assetData}
                readOnly={!editable}
              />
            </div>
            {!assetData.isDraft ? null : <SheetFooter onDelete={onDelete} />}
          </>
        )
      }
    />
  );
};

export default PanelDetail;
