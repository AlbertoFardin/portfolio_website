import Btn from "../../../../../componentsBase/Btn";
import * as React from "react";
import {
  IProduct,
  IViewDetail,
  Severity,
  ViewCheck,
} from "../../../../../interfaces";
import { setViewCheck } from "../../../../../api/fetchesApi";
import { ContextPermissions, ContextSetSnackbar } from "../../../../contexts";
import PERMISSIONS from "../../../../../permissions";
import permissionsCheck from "../../../../../utils/permissionsCheck";
import { emptyFn } from "../../../../../componentsBase/utils/common";

interface IGetMenuItem {
  label: string;
  active: boolean;
  onClick: () => void;
}
const getMenuItem = ({ label, active, onClick }: IGetMenuItem) => ({
  id: label,
  label,
  icon: active ? "check_circle" : "radio_button_unchecked",
  active: active,
  onClick: active ? emptyFn : onClick,
});

interface IBtnViewCheck {
  assetData: IProduct;
  disabled?: boolean;
  viewDetail: IViewDetail;
}

const BtnViewCheck = ({
  assetData,
  disabled = false,
  viewDetail,
}: IBtnViewCheck) => {
  const setSnackbar = React.useContext(ContextSetSnackbar);

  const { viewName, status, check } = viewDetail;
  const [newCheck, setNewCheck] = React.useState(null as ViewCheck);
  const [updated, setUpdated] = React.useState(true);
  const { id, version } = assetData;
  const onCheck = React.useCallback(() => {
    setNewCheck(ViewCheck.CHECK);
  }, []);
  const onUncheck = React.useCallback(() => {
    setNewCheck(ViewCheck.NO_CHECK);
  }, []);
  const permissions = React.useContext(ContextPermissions);
  const canEdit = permissionsCheck({
    keys: [PERMISSIONS.seecommerce_check_view],
    permissions,
  });

  React.useEffect(() => {
    if (assetData) setUpdated(true);
  }, [assetData, status]);

  React.useEffect(() => {
    if (!!newCheck && updated) {
      (async () => {
        try {
          const res = await setViewCheck({
            entityId: id,
            viewName,
            check: newCheck,
            version: version,
          });
          if (res.error) throw res.error;

          setSnackbar(
            Severity.SUCCESS,
            `View "${viewName}" was ${
              newCheck === ViewCheck.CHECK ? "checked" : "unchecked"
            }`
          );
          setUpdated(false);
        } catch (err) {
          setSnackbar(
            Severity.WARNING,
            "Unable to change view check, please refresh and retry"
          );
        }
        setNewCheck(null);
      })();
    }
  }, [id, newCheck, setSnackbar, updated, version, viewName]);

  if (!canEdit) return null;

  return (
    <Btn
      disabled={disabled || !!newCheck || !updated}
      icon="domain_verification"
      tooltip={"Check / Un-check view"}
      menu={{
        anchorOrigin: {
          vertical: "top",
          horizontal: "right",
        },
        transformOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        items: [
          getMenuItem({
            label: "Check view",
            active: check === ViewCheck.CHECK,
            onClick: onCheck,
          }),
          getMenuItem({
            label: "Un-check view",
            active: check === ViewCheck.NO_CHECK,
            onClick: onUncheck,
          }),
        ],
      }}
    />
  );
};

export default BtnViewCheck;
