import * as React from "react";
import Btn from "../../../../componentsBase/Btn";
import * as Colors from "../../../../componentsBase/style/Colors";
import { IProduct } from "../../../../interfaces";
import ModalMediasReady from "../../ModalMediasReady";
import { ContextPermissions } from "../../../contexts";
import PERMISSIONS from "../../../../permissions";
import permissionsCheck from "../../../../utils/permissionsCheck";
import reducer, { reducerInitState, ACTION } from "./reducer";
import { IActions } from "../../../../componentsBase/ActionsMenu";
import isEmpty from "lodash-es/isEmpty";
import ModalAttributesReady from "../../ModalAttributesReady";
import {
  KEY_ROOT_ID,
  MAX_PRODUCTS_MASSIVE_ACTIONS,
} from "../../../../constants";
import { ContextCategories, ContextColumns } from "../../contexts";
import getProducts from "../../getProducts";

const idMedias = "idMedia";
const idAttribute = "idAttribute";
interface IBtnReadys {
  itemsIdSelected?: string[];
}

const BtnReadys = ({ itemsIdSelected }: IBtnReadys) => {
  const permissions = React.useContext(ContextPermissions);
  const columns = React.useContext(ContextColumns);
  const categories = React.useContext(ContextCategories);

  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const {
    items,
    itemsRoot,
    loading,
    modalMediasReady,
    modalAttributesReady,
  } = state;
  const onReset = React.useCallback(() => {
    dispatch({ type: ACTION.RESET });
  }, []);
  const onModalMediasOpen = React.useCallback(() => {
    dispatch({ type: ACTION.OPEN_MODAL_MEDIA });
  }, []);
  const onModalAttributesOpen = React.useCallback(() => {
    dispatch({ type: ACTION.OPEN_MODAL_ATTRIBUTE });
  }, []);
  const menuItems: IActions[] = React.useMemo(() => {
    const actions: IActions[] = [];

    if (
      permissionsCheck({
        keys: [PERMISSIONS.seecommerce_manage_media_ready],
        permissions,
      })
    ) {
      actions.push({
        id: idMedias,
        icon: "dynamic_feed",
        label: "Product View",
        onClick: onModalMediasOpen,
      });
    }

    if (
      permissionsCheck({
        keys: [PERMISSIONS.seecommerce_manage_attribute_ready],
        permissions,
      })
    ) {
      actions.push({
        id: idAttribute,
        icon: "text_fields",
        label: "Product Attributes (All)",
        onClick: onModalAttributesOpen,
      });
    }

    return actions;
  }, [onModalAttributesOpen, onModalMediasOpen, permissions]);

  // on modal open, get items selected. they can be on a different page
  React.useEffect(() => {
    if (loading) {
      (async () => {
        const items = await getProducts({
          ids: itemsIdSelected,
          columns,
          categories,
        });

        let itemsRoot = [];
        const itemsRootIds = items.reduce((acc, item: IProduct) => {
          const a = item[KEY_ROOT_ID];
          if (a) acc.push(a);
          return acc;
        }, []);
        if (!isEmpty(itemsRootIds)) {
          itemsRoot = await getProducts({
            ids: itemsRootIds,
            columns,
            categories,
          });
        }
        dispatch({ type: ACTION.SET_ITEMS, items, itemsRoot });
      })();
    }
  }, [categories, columns, itemsIdSelected, loading]);

  if (isEmpty(menuItems) || isEmpty(itemsIdSelected)) return null;

  return (
    <>
      <Btn
        color={Colors.Cyan}
        icon="public"
        disabled={itemsIdSelected.length > MAX_PRODUCTS_MASSIVE_ACTIONS}
        tooltip="Set Ready"
        menu={{
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
          transformOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          title: "Set Ready",
          items: menuItems,
        }}
      />
      <ModalMediasReady
        open={modalMediasReady}
        onClose={onReset}
        loading={loading}
        items={items}
      />
      <ModalAttributesReady
        open={modalAttributesReady}
        onClose={onReset}
        loading={loading}
        items={items}
        itemsRoot={itemsRoot}
      />
    </>
  );
};

export default BtnReadys;
