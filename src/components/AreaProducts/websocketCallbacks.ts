import { ACT_VPORT } from "./reducer";
import isEmpty from "lodash-es/isEmpty";
import {
  NotificationType,
  IWsNotification,
  IWsCallbackViewport,
  Service,
} from "../../interfaces";
import { AREA_PRODUCTS } from "../../constants";

const filterItemsWs = (
  itemsWs: IWsNotification[]
): Array<{ id: string; version: number }> => {
  return itemsWs
    .filter(
      (x) =>
        !x.isError &&
        x.service === Service.SEECOMMERCE &&
        x.notificationType === NotificationType.PRODUCT
    )
    .map(({ payload }) => ({
      id: String(payload.id),
      version: Number(payload.version),
    }));
};

const wsCallbackItemsUpdate = async (
  itemsWs: IWsNotification[],
  dispatch: React.Dispatch<unknown>
) => {
  const itemsWsFiltered = filterItemsWs(itemsWs);
  if (!isEmpty(itemsWsFiltered)) {
    dispatch({
      type: ACT_VPORT.ITEMS_TO_UPDATE_FROM_ES,
      itemsWs: itemsWsFiltered,
    });
  }
};

const wsCallbacks: IWsCallbackViewport[] = [
  {
    id: `${AREA_PRODUCTS}_update_items`,
    callback: wsCallbackItemsUpdate,
  },
];

export default wsCallbacks;
