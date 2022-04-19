import * as React from "react";
import BtnReadyCatalogs from "../Buttons/BtnReadyCatalogs";
import BtnReview from "../Buttons/BtnReview";
import BtnPublicUrl from "../Buttons/BtnPublicUrl";
import BtnToAssign from "../Buttons/BtnToAssign";
import BtnViewCheck from "../Buttons/BtnViewCheck";
import getViewDetail from "../../../getViewDetail";
import { IProduct, IMedia } from "../../../../../interfaces";

interface IToolbarActionsRight {
  assetData: IProduct;
  imageId: string;
  historySelected?: IMedia[];
  historyIndex?: number;
  mediaSelected: IMedia;
  mediaIdReady?: string;
}

const ToolbarActionsRight = ({
  assetData,
  imageId,
  historySelected,
  mediaSelected,
  mediaIdReady,
}: IToolbarActionsRight) => {
  const viewDetail = getViewDetail(assetData, mediaSelected.view);
  const isMediaExist = !!mediaSelected.filename;

  return (
    <>
      <BtnPublicUrl assetData={assetData} imageId={mediaIdReady} />
      <BtnViewCheck
        disabled={!isMediaExist}
        viewDetail={viewDetail}
        assetData={assetData}
      />
      <BtnReadyCatalogs
        assetData={assetData}
        imageId={imageId}
        historySelected={historySelected}
        disabled={!isMediaExist}
        viewDetail={viewDetail}
      />
      <BtnReview
        disabled={!isMediaExist}
        viewDetail={viewDetail}
        assetData={assetData}
      />
      <BtnToAssign assetData={assetData} viewDetail={viewDetail} />
    </>
  );
};

export default ToolbarActionsRight;
