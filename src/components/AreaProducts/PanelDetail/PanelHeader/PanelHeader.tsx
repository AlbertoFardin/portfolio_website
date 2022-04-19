import * as React from "react";
import { IProduct, SheetLayout } from "../../../../interfaces";
import BtnMore from "./BtnMore";
import { BtnToggle } from "../../../DrawerDetail";
import { IItemsSet } from "../../../../componentsBase/ConfigManagement";
import BtnSearchAttribute from "./BtnSearchAttribute";
import Header from "./Header";

interface IPanelHeader {
  assetDatas: IProduct[];
  detailSheet: SheetLayout;
  onSheetChange: (l: SheetLayout) => void;
  fullscreen: boolean;
  managerAttributesSets: IItemsSet[];
  managerAttributesOpen: boolean;
  searchAttributeOpen: boolean;
  searchAttributeValue: string;
  editingProcessed: boolean;
  editingSaveRequest: boolean;
}

const PanelHeader = ({
  assetDatas,
  detailSheet,
  onSheetChange,
  fullscreen,
  managerAttributesSets,
  managerAttributesOpen,
  searchAttributeOpen,
  searchAttributeValue,
  editingProcessed,
  editingSaveRequest,
}: IPanelHeader) => {
  const disabled = editingSaveRequest || editingProcessed;

  return (
    <>
      <Header assetDatas={assetDatas} />
      <div style={{ flex: 1 }} />
      <BtnSearchAttribute
        disabled={disabled}
        fullscreen={fullscreen}
        searchAttributeOpen={searchAttributeOpen}
        searchAttributeValue={searchAttributeValue}
      />
      <BtnToggle layout={detailSheet} onChange={onSheetChange} />
      <BtnMore
        disabled={disabled}
        assetDatas={assetDatas}
        managerAttributesSets={managerAttributesSets}
        managerAttributesOpen={managerAttributesOpen}
      />
    </>
  );
};

export default PanelHeader;
