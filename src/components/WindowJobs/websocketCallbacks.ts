import {
  IWsCallbackViewport,
  IWsNotification,
  NotificationType,
  Service,
} from "../../interfaces";
import { ACTION } from "./reducer";

const websocketUpdateJobs = async (
  itemsWs: IWsNotification[],
  dispatch: React.Dispatch<unknown>
) => {
  const ids = itemsWs
    .filter(
      ({ isError, service, notificationType }) =>
        !isError &&
        service === Service.NOTIFIER &&
        notificationType === NotificationType.MULTI_PRODUCT_EDITING
    )
    .map((x) => x.payload.key);

  if (!!ids.length) {
    dispatch({ type: ACTION.IDS_TO_UPDATE, ids });
  }
};

const webSocketCallbacks: IWsCallbackViewport[] = [
  {
    id: "windowjobs",
    callback: websocketUpdateJobs,
  },
];

export default webSocketCallbacks;
