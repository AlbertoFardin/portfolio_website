import * as React from "react";
import Btn from "../../../componentsBase/Btn";
import { IProduct } from "../../../interfaces";
import ModalViewsConfig from "../ModalViewsConfig";
import { MAX_PRODUCTS_MASSIVE_ACTIONS } from "../../../constants";
import isEmpty from "lodash-es/isEmpty";
import { ContextPermissions } from "../../contexts";
import PERMISSIONS from "../../../permissions";
import permissionsCheck from "../../../utils/permissionsCheck";
import { ContextCategories, ContextColumns } from "../contexts";
import getProducts from "../getProducts";

interface IBtnViewsConfig {
  itemsIdSelected?: string[];
}

const BtnViewsConfig = ({ itemsIdSelected = [] }: IBtnViewsConfig) => {
  const columns = React.useContext(ContextColumns);
  const categories = React.useContext(ContextCategories);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [modalLoading, setModalLoading] = React.useState(false);
  const [itemsSelected, setItemsSelected] = React.useState([] as IProduct[]);
  const cbOnOpen = React.useCallback(() => {
    setModalOpen(true);
  }, []);
  const cbOnClose = React.useCallback(() => {
    setModalOpen(false);
    setItemsSelected([]);
  }, []);
  const permissions = React.useContext(ContextPermissions);
  const canEdit = permissionsCheck({
    keys: [PERMISSIONS.seecommerce_edit_product_view],
    permissions,
  });

  // on modal open, get items selected. they can be on a different page
  React.useEffect(() => {
    if (modalOpen && !modalLoading && isEmpty(itemsSelected)) {
      (async () => {
        setModalLoading(true);
        const items = await getProducts({
          ids: itemsIdSelected,
          columns,
          categories,
        });

        setItemsSelected(items);
        setModalLoading(false);
      })();
    }
  }, [
    categories,
    columns,
    itemsIdSelected,
    itemsSelected,
    modalLoading,
    modalOpen,
  ]);

  if (!canEdit || isEmpty(itemsIdSelected)) return null;

  return (
    <>
      <Btn
        icon="dynamic_feed"
        onClick={cbOnOpen}
        disabled={
          modalLoading || itemsIdSelected.length > MAX_PRODUCTS_MASSIVE_ACTIONS
        }
        tooltip="Edit Product View"
        selected={modalOpen}
      />
      <ModalViewsConfig
        open={!!modalOpen}
        onClose={cbOnClose}
        loading={modalLoading}
        items={itemsSelected}
      />
    </>
  );
};

export default BtnViewsConfig;
