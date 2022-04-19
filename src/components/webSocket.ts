import Cookies from "js-cookie";
import { AUTHORIZATION_TOKEN, REFRESH_TOKEN } from "../constants";

interface IWsCallback {
  id: string;
  callback;
  dispatch: React.Dispatch<unknown>;
}

let webSocketInst: WebSocket;
let connectionId: string;
const registeredCallbacks: IWsCallback[] = [];

export const openWebSocket = (url: string) => {
  if (
    Cookies.get(AUTHORIZATION_TOKEN) &&
    Cookies.get(REFRESH_TOKEN) &&
    (!webSocketInst || webSocketInst.readyState === WebSocket.CLOSED)
  ) {
    webSocketInst = new WebSocket(url);

    webSocketInst.onmessage = (e) => {
      if (e.data) {
        const data = JSON.parse(e.data);

        if (data.connectionUUID !== undefined) {
          connectionId = data.connectionUUID;
        }
        if (!data.connectionUUID && !connectionId) {
          webSocketInst.send("GetConnectionUUID");
        }

        if (Array.isArray(data)) {
          registeredCallbacks.forEach((x) => x.callback(data, x.dispatch));
        }
      }
    };

    webSocketInst.onopen = () => {
      console.log("[websocket] ✅ opened");
    };

    webSocketInst.onclose = () => {
      console.log("[websocket] ❌ closed");
      openWebSocket(url);
    };
  }
};

export const closeWebSocket = () => {
  if (!!webSocketInst) webSocketInst.close();
};

export const getWebSocketConnectionId = (): string => {
  const ret = connectionId;
  return ret;
};

export const registerWebSocketCallback = (callback: IWsCallback): boolean => {
  const found =
    registeredCallbacks.find((x) => x.id === callback.id) !== undefined;
  if (found) return false;

  registeredCallbacks.push(callback);
  return true;
};

export const unregisterWebSocketCallback = (callbackId: string): boolean => {
  const foundIndex = registeredCallbacks.findIndex((x) => x.id === callbackId);
  if (foundIndex < 0) return false;

  registeredCallbacks.splice(foundIndex, 1);
  return true;
};
