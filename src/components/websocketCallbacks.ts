import isEmpty from "lodash-es/isEmpty";
import { ACTION_MAIN } from "./reducer";
import {
  ArchiverStatus,
  NotificationType,
  IWsNotification,
  IWsCallbackViewport,
  Service,
} from "../interfaces";

const wbCallbackDownloads = (
  itemsWs: IWsNotification[],
  dispatch: React.Dispatch<unknown>
) => {
  const items = itemsWs.filter(
    ({ isError, service, notificationType }) =>
      !isError &&
      service === Service.SEECOMMERCE &&
      (notificationType === NotificationType.EXPORT ||
        notificationType === NotificationType.ARCHIVING)
  );

  if (!isEmpty(items)) {
    items.forEach(({ payload }) => {
      if (payload.status === ArchiverStatus.STARTED) {
        dispatch({ type: ACTION_MAIN.DOWNLOADS_UPDATE, payload });
      }

      if (payload.status === ArchiverStatus.COMPLETED) {
        dispatch({ type: ACTION_MAIN.DOWNLOADS_FINISH, payload });
      }
    });
  }
};

const wbCallbackConfiguration = (
  itemsWs: IWsNotification[],
  dispatch: React.Dispatch<unknown>
) => {
  const items = itemsWs.filter(
    ({ isError, service, notificationType }) =>
      !isError &&
      service === Service.SEECOMMERCE &&
      notificationType === NotificationType.CONFIGURATION
  );

  if (!isEmpty(items)) {
    dispatch({ type: ACTION_MAIN.CONFIG_UPDATE });
  }
};

const webSocketCallbacks: IWsCallbackViewport[] = [
  {
    id: "MAIN_DOWNLOADS",
    callback: wbCallbackDownloads,
  },
  {
    id: "MAIN_CONFIGURATION",
    callback: wbCallbackConfiguration,
  },
];

export default webSocketCallbacks;
