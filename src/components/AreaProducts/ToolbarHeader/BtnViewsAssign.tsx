import * as React from "react";
import Btn from "../../../componentsBase/Btn";
import { IProduct } from "../../../interfaces";
import ModalViewsAssign from "../ModalViewsAssign";
import { ContextPermissions } from "../../contexts";
import PERMISSIONS from "../../../permissions";
import permissionsCheck from "../../../utils/permissionsCheck";
import { MAX_PRODUCTS_MASSIVE_ACTIONS } from "../../../constants";
import { ContextCategories, ContextColumns } from "../contexts";
import getProducts from "../getProducts";
import isEmpty from "lodash-es/isEmpty";

interface IBtnViewsAssign {
  itemsIdSelected?: string[];
}

const BtnViewsAssign = ({ itemsIdSelected = [] }: IBtnViewsAssign) => {
  const columns = React.useContext(ContextColumns);
  const categories = React.useContext(ContextCategories);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalLoading, setModalLoading] = React.useState(false);
  const [itemsSelected, setItemsSelected] = React.useState([] as IProduct[]);
  const cbOnOpen = React.useCallback(() => {
    setModalOpen(true);
    setModalLoading(true);
  }, []);
  const cbOnClose = React.useCallback(() => {
    setModalOpen(false);
    setModalLoading(false);
  }, []);
  const permissions = React.useContext(ContextPermissions);
  const canEdit = permissionsCheck({
    keys: [PERMISSIONS.seecommerce_assign],
    permissions,
  });

  // on modal open, get items selected. they can be on a different page
  React.useEffect(() => {
    if (modalLoading) {
      (async () => {
        const items = await getProducts({
          ids: itemsIdSelected,
          columns,
          categories,
        });

        setItemsSelected(items);
        setModalLoading(false);
      })();
    }
  }, [categories, columns, itemsIdSelected, modalLoading]);

  if (!canEdit || isEmpty(itemsIdSelected)) return null;

  return (
    <>
      <Btn
        icon="how_to_reg"
        onClick={cbOnOpen}
        disabled={
          modalLoading || itemsIdSelected.length > MAX_PRODUCTS_MASSIVE_ACTIONS
        }
        tooltip="Assign views"
        selected={modalOpen}
      />
      <ModalViewsAssign
        open={!!modalOpen}
        onClose={cbOnClose}
        loading={modalLoading}
        items={itemsSelected}
      />
    </>
  );
};

export default BtnViewsAssign;
