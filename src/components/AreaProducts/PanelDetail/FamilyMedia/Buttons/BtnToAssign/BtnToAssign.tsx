import * as React from "react";
import Btn from "../../../../../../componentsBase/Btn";
import { ContextPermissions } from "../../../../../contexts";
import { IProduct, IViewDetail } from "../../../../../../interfaces";
import ModalAssignee from "./ModalAssignee";
import PERMISSIONS from "../../../../../../permissions";
import permissionsCheck from "../../../../../../utils/permissionsCheck";

interface IBtnToAssign {
  assetData: IProduct;
  viewDetail: IViewDetail;
}

const BtnToAssign = ({ assetData, viewDetail }: IBtnToAssign) => {
  const modalRef = React.useRef(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const onMenuOpen = React.useCallback(() => setModalOpen(true), []);
  const onMenuClose = React.useCallback(() => setModalOpen(false), []);
  const permissions = React.useContext(ContextPermissions);
  const canEdit = permissionsCheck({
    keys: [PERMISSIONS.seecommerce_assign],
    permissions,
  });

  if (!canEdit) return null;

  return (
    <>
      <div ref={modalRef}>
        <Btn icon="how_to_reg" onClick={onMenuOpen} tooltip="Assign view" />
      </div>
      <ModalAssignee
        open={modalOpen}
        onClose={onMenuClose}
        anchorEl={modalRef.current}
        assetData={assetData}
        viewName={viewDetail.viewName}
      />
    </>
  );
};

export default BtnToAssign;
