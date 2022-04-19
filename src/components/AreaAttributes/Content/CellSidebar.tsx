import { ICellRenderer } from "../../../componentsBase/StickyGrid";
import * as React from "react";
import { IAttribute } from "../../../interfaces";
import LabelStatus from "../LabelStatus";

interface ICellSidebar extends ICellRenderer {
  rowData: IAttribute;
}
const CellSidebar = ({ rowData }: ICellSidebar) => {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "stretch",
        flexDirection: "column",
      }}
    >
      <LabelStatus assetData={rowData} />
    </div>
  );
};

export default CellSidebar;
