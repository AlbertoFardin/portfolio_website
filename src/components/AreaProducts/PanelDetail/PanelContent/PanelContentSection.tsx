import * as React from "react";
import { IProduct, AttributeFamily, IMediaInfo } from "../../../../interfaces";
import FamilyMedia from "../FamilyMedia";
import FamilyAssociation from "../FamilyAssociation";
import FamilyAttribute from "../FamilyAttribute";
import FamilyCategory from "../FamilyCategory";
import { PointSelector } from "../../../../componentsBase/ImageAnnotation";
import Placeholder from "../../../../componentsBase/Placeholder";
import { IAssetdataDiffs } from "../interfaces";
import getVisibleFamilies from "./getVisibleFamilies";
import { PANEL_DETAIL_WIDTH } from "../../../../constants";
import { ContextColumns } from "../../contexts";
import { IItemsSet } from "../../../../componentsBase/ConfigManagement";
import { useHistory, useLocation } from "react-router-dom";
import getSearchString from "../../getSearchString";
import getFamilies from "../SelectFamily/getFamilies";

interface IPanelContentSection {
  assetdataDirty;
  assetdataMerge: IProduct;
  assetdataDiffs: IAssetdataDiffs;
  assetdataCount: number;
  detailTabId: string;
  detailImgId: string;
  fullscreen: boolean;
  mediaData: IMediaInfo;
  annotationsSelector: PointSelector;
  annotationsEnabled: boolean;
  attributesIdVisible: string[];
  selectedCatalog: string;
  selectedLanguages: string[];
  searchAttributeOpen: boolean;
  searchAttributeValue: string;
  managerAttributesSets: IItemsSet[];
}

const PanelContentSection = ({
  assetdataDirty,
  assetdataMerge,
  assetdataDiffs,
  assetdataCount,
  detailTabId,
  detailImgId,
  fullscreen,
  mediaData,
  annotationsSelector,
  annotationsEnabled,
  attributesIdVisible,
  selectedCatalog,
  selectedLanguages,
  searchAttributeOpen,
  searchAttributeValue,
  managerAttributesSets,
}: IPanelContentSection) => {
  const columns = React.useContext(ContextColumns);
  const history = useHistory();
  const searchString = useLocation().search;

  // check if exist family else return to ALL_ATTRIBUTES
  React.useEffect(() => {
    const familiesSelectable = getFamilies(
      columns,
      assetdataCount,
      assetdataMerge
    ).map((f) => f.id);

    if (!new Set(familiesSelectable).has(detailTabId as AttributeFamily)) {
      history.push(
        getSearchString(
          { detailTabId: AttributeFamily.ALL_ATTRIBUTES },
          searchString
        )
      );
    }
  }, [
    assetdataCount,
    assetdataMerge,
    columns,
    detailTabId,
    history,
    searchString,
  ]);

  if (searchAttributeOpen) {
    return (
      <FamilyAttribute
        assetdataDirty={assetdataDirty}
        assetdataMerge={assetdataMerge}
        assetdataDiffs={assetdataDiffs}
        assetdataCount={assetdataCount}
        visibleAttributes={attributesIdVisible}
        visibleFamilies={getVisibleFamilies(
          AttributeFamily.ALL_ATTRIBUTES,
          columns,
          assetdataCount,
          assetdataMerge
        )}
        selectedCatalog={selectedCatalog}
        selectedLanguages={selectedLanguages}
        searchAttributeValue={searchAttributeValue}
        managerAttributesSets={managerAttributesSets}
      />
    );
  }

  switch (detailTabId) {
    case AttributeFamily.ALL_ATTRIBUTES:
    case AttributeFamily.MASTER:
    case AttributeFamily.PLANNING:
    case AttributeFamily.EDITORIAL:
    case AttributeFamily.MONITORING:
    case AttributeFamily.OTHERS:
      return (
        <FamilyAttribute
          assetdataDirty={assetdataDirty}
          assetdataMerge={assetdataMerge}
          assetdataDiffs={assetdataDiffs}
          assetdataCount={assetdataCount}
          selectedCatalog={selectedCatalog}
          selectedLanguages={selectedLanguages}
          searchAttributeValue={searchAttributeValue}
          visibleAttributes={attributesIdVisible}
          visibleFamilies={getVisibleFamilies(
            detailTabId,
            columns,
            assetdataCount,
            assetdataMerge
          )}
          managerAttributesSets={managerAttributesSets}
        />
      );
    case AttributeFamily.ASSOCIATION:
      return (
        <FamilyAssociation
          assetdataDirty={assetdataDirty}
          assetdataMerge={assetdataMerge}
          assetdataDiffs={assetdataDiffs}
          assetdataCount={assetdataCount}
          selectedCatalog={selectedCatalog}
          selectedLanguages={selectedLanguages}
        />
      );
    case AttributeFamily.CATEGORIES:
      return (
        <FamilyCategory
          assetdataDirty={assetdataDirty}
          assetdataMerge={assetdataMerge}
          assetdataDiffs={assetdataDiffs}
          assetdataCount={assetdataCount}
        />
      );
    case AttributeFamily.MEDIA:
      return (
        <FamilyMedia
          fullscreen={fullscreen}
          detailImgId={detailImgId}
          assetData={assetdataMerge}
          mediaData={mediaData}
          annotationsSelector={annotationsSelector}
          annotationsEnabled={annotationsEnabled}
        />
      );
    default:
      return (
        <div style={{ position: "relative", width: PANEL_DETAIL_WIDTH }}>
          <Placeholder
            icon="help_center"
            label="Please select a valid detail's section"
          />
        </div>
      );
  }
};

export default PanelContentSection;
