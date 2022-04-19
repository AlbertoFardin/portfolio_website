import Btn from "../../../../../componentsBase/Btn";
import * as Colors from "../../../../../componentsBase/style/Colors";
import * as React from "react";
import {
  IProduct,
  IViewDetail,
  Severity,
  ViewStatus,
} from "../../../../../interfaces";
import { setViews } from "../../../../../api/fetchesApi";
import { ContextPermissions, ContextSetSnackbar } from "../../../../contexts";
import PERMISSIONS from "../../../../../permissions";
import permissionsCheck from "../../../../../utils/permissionsCheck";

interface IBtnReview {
  assetData: IProduct;
  disabled?: boolean;
  viewDetail: IViewDetail;
}

const BtnReview = ({ assetData, disabled = false, viewDetail }: IBtnReview) => {
  const setSnackbar = React.useContext(ContextSetSnackbar);

  const { viewName, viewId, status } = viewDetail;
  const [clicked, setClicked] = React.useState(false);
  const [updated, setUpdated] = React.useState(true);
  const { id, version } = assetData;
  const onClick = React.useCallback(() => {
    setClicked(true);
  }, []);
  const permissions = React.useContext(ContextPermissions);
  const canEdit = permissionsCheck({
    keys: [PERMISSIONS.seecommerce_review_product_view],
    permissions,
  });

  React.useEffect(() => {
    if (assetData) {
      setUpdated(true);
    }
  }, [assetData, status]);

  React.useEffect(() => {
    if (clicked && updated) {
      const statusNew =
        status === ViewStatus.REVIEW ? ViewStatus.DEFAULT : ViewStatus.REVIEW;
      (async () => {
        setClicked(false);
        try {
          const res = await setViews({
            entityId: id,
            view: viewId,
            status: statusNew,
            version: version,
          });
          if (res.error) throw res.error;

          setSnackbar(
            Severity.SUCCESS,
            `Review Status ${
              statusNew === ViewStatus.REVIEW ? "applied to" : "removed from"
            } view "${viewName}"`
          );

          setUpdated(false);
        } catch (err) {
          setSnackbar(
            Severity.WARNING,
            "Unable to change Review status, please refresh and retry"
          );
        }
      })();
    }
  }, [clicked, id, setSnackbar, status, updated, version, viewId, viewName]);

  if (!canEdit) return null;

  return (
    <Btn
      disabled={disabled || clicked || !updated}
      color={Colors.Orange}
      icon="feedback"
      tooltip={status === ViewStatus.REVIEW ? "Remove review" : "Review"}
      onClick={onClick}
    />
  );
};

export default BtnReview;
