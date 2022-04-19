import * as React from "react";
import { FAMILY_CONF } from "../constants";
import PanelFamilyBtn from "./PanelFamilyBtn";
import { AttributeFamily, IProduct } from "../../../../interfaces";
import Drawer from "../../../Drawer";
import { ContextColumns } from "../../contexts";
import getFamilies from "./getFamilies";

interface IPanelFamily {
  detailTabId: string;
  fullscreen: boolean;
  assetdataCount: number;
  assetdataMerge: IProduct;
  searchAttributeOpen: boolean;
}

const PanelFamily = ({
  detailTabId,
  fullscreen,
  assetdataCount,
  assetdataMerge,
  searchAttributeOpen,
}: IPanelFamily) => {
  const columns = React.useContext(ContextColumns);
  const confAll = FAMILY_CONF.find(
    (f) => f.id === AttributeFamily.ALL_ATTRIBUTES
  );

  if (!fullscreen) return null;

  return (
    <Drawer direction="right">
      {searchAttributeOpen ? (
        <PanelFamilyBtn
          selected
          family={confAll.id}
          icon={confAll.icon}
          label={confAll.label}
        />
      ) : (
        getFamilies(
          columns,
          assetdataCount,
          assetdataMerge
        ).map(({ id, icon, label }) => (
          <PanelFamilyBtn
            key={id}
            selected={id === detailTabId}
            family={id}
            icon={icon}
            label={label}
          />
        ))
      )}
    </Drawer>
  );
};

export default PanelFamily;
