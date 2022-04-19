import * as React from "react";
import Btn from "../../../../../componentsBase/Btn";
import { IProduct, IMedia, Severity } from "../../../../../interfaces";
import { postProduction } from "../../../../../api/fetchesApi";
import { colorTheme } from "../../../../../constants";
import { ContextPermissions, ContextSetSnackbar } from "../../../../contexts";
import PERMISSIONS from "../../../../../permissions";
import permissionsCheck from "../../../../../utils/permissionsCheck";

interface IBtnPostProduce {
  disabled?: boolean;
  assetData: IProduct;
  mediaSelected: IMedia;
}

const BtnPostProduce = ({
  disabled,
  assetData,
  mediaSelected,
}: IBtnPostProduce) => {
  const setSnackbar = React.useContext(ContextSetSnackbar);

  const [clicked, setClicked] = React.useState(false);
  const [updated, setUpdated] = React.useState(true);
  const { id, version } = assetData;
  const { fileId, postProduce } = mediaSelected || {};
  const onClick = React.useCallback(() => {
    setClicked(true);
  }, []);
  const permissions = React.useContext(ContextPermissions);
  const canEdit = permissionsCheck({
    keys: [PERMISSIONS.seecommerce_media_for_post_production],
    permissions,
  });

  React.useEffect(() => {
    if (assetData) setUpdated(true);
  }, [assetData, postProduce]);

  React.useEffect(() => {
    if (clicked && updated) {
      (async () => {
        try {
          const postProduceNew = !postProduce;
          const res = await postProduction({
            productId: id,
            productVersion: version,
            mediaId: fileId,
            mediaPostProduce: postProduceNew,
          });
          if (res.error) throw res.error;

          setSnackbar(
            Severity.SUCCESS,
            postProduceNew
              ? "Post production status applied to media"
              : "Post production status removed from media"
          );
          setUpdated(false);
        } catch (err) {
          setSnackbar(
            Severity.WARNING,
            "Unable to change Post production status, please refresh and retry"
          );
          console.log("BtnPostProduce ->", err);
        }
        setClicked(false);
      })();
    }
  }, [clicked, fileId, id, postProduce, setSnackbar, updated, version]);

  if (!canEdit) return null;

  return (
    <Btn
      disabled={disabled || clicked || !updated}
      color={colorTheme}
      icon="photo_filter"
      tooltip="Request Post production"
      onClick={onClick}
    />
  );
};

export default BtnPostProduce;
