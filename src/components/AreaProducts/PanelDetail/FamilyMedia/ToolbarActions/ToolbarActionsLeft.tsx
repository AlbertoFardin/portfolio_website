import * as React from "react";
import Btn from "../../../../../componentsBase/Btn";
import BtnDownload from "../Buttons/BtnDownload";
import BtnPostProduce from "../Buttons/BtnPostProduce";
import BtnDeleteMedia from "../Buttons/BtnDeleteMedia";
import PERMISSIONS from "../../../../../permissions";
import permissionsCheck from "../../../../../utils/permissionsCheck";
import { ContextPermissions } from "../../../../contexts";
import { useHistory, useLocation } from "react-router-dom";
import { KEY_ENTITY_ID } from "../../../../../constants";
import getSearchString from "../../../getSearchString";
import { IMedia, IProduct, SheetLayout } from "../../../../../interfaces";
import { ContextDispatchDetail } from "../../../contexts";
import { ACT_DETAIL } from "../../reducer";

interface IToolbarActionsLeft {
  assetData: IProduct;
  mediaSelected: IMedia;
  setImageId: (s: string) => void;
  fullscreen: boolean;
}

const ToolbarActionsLeft = ({
  assetData,
  mediaSelected,
  setImageId,
  fullscreen,
}: IToolbarActionsLeft) => {
  const history = useHistory();
  const search = useLocation().search;
  const dispatchDetail = React.useContext(ContextDispatchDetail);

  const isMediaExist = !!mediaSelected.filename;
  const cbAnnotationOpen = React.useCallback(() => {
    history.push(
      getSearchString(
        {
          entityId: assetData[KEY_ENTITY_ID],
          detailSheet: SheetLayout.FULLSCREEN,
        },
        search
      )
    );

    dispatchDetail({
      type: ACT_DETAIL.ANNOTATIONS_ENABLE,
      payload: true,
    });
  }, [assetData, dispatchDetail, history, search]);
  const permissions = React.useContext(ContextPermissions);
  const canAnnotation = permissionsCheck({
    keys: [PERMISSIONS.seecommerce_annotation],
    permissions,
  });

  return (
    <>
      <BtnDownload disabled={!isMediaExist} mediaSelected={mediaSelected} />
      {fullscreen || !canAnnotation ? null : (
        <Btn
          disabled={!isMediaExist}
          icon="add_comment"
          iconStyle={{ transform: "scale(-1, 1)" }}
          tooltip="Add annnotations"
          onClick={cbAnnotationOpen}
        />
      )}
      <BtnPostProduce
        disabled={!isMediaExist}
        assetData={assetData}
        mediaSelected={mediaSelected}
      />
      <BtnDeleteMedia
        disabled={!isMediaExist}
        assetData={assetData}
        mediaSelected={mediaSelected}
        setImageId={setImageId}
      />
    </>
  );
};

export default ToolbarActionsLeft;
