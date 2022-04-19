import { ACT_VPORT } from "./reducer";
import {
  IWsCallbackViewport,
  IWsNotification,
  Service,
} from "../../interfaces";

const getItemWsIds = (itemsWs: IWsNotification[]): string[] => {
  return itemsWs
    .filter((x) => x.service === Service.DIGITALASSETS && !x.isError)
    .map((x) => x.payload.id);
};

const websocketFilesUpdateCallback = async (
  itemsWs: IWsNotification[],
  dispatch: React.Dispatch<unknown>
) => {
  const ids = getItemWsIds(itemsWs);
  if (!!ids.length) dispatch({ type: ACT_VPORT.WB_IDS_TO_UPDATE, ids });
};

const webSocketCallbacks: IWsCallbackViewport[] = [
  {
    id: Service.DIGITALASSETS,
    callback: websocketFilesUpdateCallback,
  },
];

export default webSocketCallbacks;
