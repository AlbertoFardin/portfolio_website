import { ACT_VPORT } from "./reducer";
import isEmpty from "lodash-es/isEmpty";
import {
  NotificationType,
  IWsNotification,
  IWsCallbackViewport,
  Service,
} from "../../interfaces";
import { AREA_STAGING } from "../../constants";

const getItemsIdToUpdate = (itemsWs: IWsNotification[]): string[] => {
  return itemsWs
    .filter(
      (x) =>
        !x.isError &&
        x.service === Service.SEECOMMERCE &&
        x.notificationType === NotificationType.STAGING_AREA
    )
    .map((x) => x.payload.id);
};

const wsCallbackItemsUpdate = async (
  itemsWs: IWsNotification[],
  dispatch: React.Dispatch<unknown>
) => {
  const ids = getItemsIdToUpdate(itemsWs);
  if (!isEmpty(ids)) {
    dispatch({
      type: ACT_VPORT.SNACKBAR_TO_UPDATE,
      value: true,
    });
  }
};

const wsCallbacks: IWsCallbackViewport[] = [
  {
    id: `${AREA_STAGING}_update_items`,
    callback: wsCallbackItemsUpdate,
  },
];

export default wsCallbacks;
