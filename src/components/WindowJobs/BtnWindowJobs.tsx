import * as React from "react";
import Btn from "../../componentsBase/Btn";
import WindowJobs from "./WindowJobs";
import websocketCallbacks from "./websocketCallbacks";
import {
  registerWebSocketCallback,
  unregisterWebSocketCallback,
} from "../webSocket";
import { deleteJobs, getJobs, getJobId } from "../../api/fetchesApi";
import { reducer, reducerInitState, ACTION } from "./reducer";

const BtnWindowJobs = () => {
  const btnRef = React.useRef(null);

  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const { openWindow, items, fetchingAll, deletingAll, idsToUpdate } = state;

  const onOpen = React.useCallback(() => {
    dispatch({ type: ACTION.WINDOW_OPEN, value: true });
  }, []);

  // add websocket listener
  React.useEffect(() => {
    websocketCallbacks.forEach((x) => {
      registerWebSocketCallback({
        id: x.id,
        callback: x.callback,
        dispatch,
      });
    });

    return () => {
      websocketCallbacks.forEach((x) => {
        unregisterWebSocketCallback(x.id);
      });
    };
  }, []);

  // fetchingAll
  React.useEffect(() => {
    (async () => {
      if (fetchingAll) {
        const value = await getJobs();
        dispatch({ type: ACTION.FETCHED_ALL, value });
      }
    })();
  }, [fetchingAll]);

  // deletingAll
  React.useEffect(() => {
    (async () => {
      if (deletingAll) {
        await deleteJobs();
        dispatch({ type: ACTION.DELETED_ALL });
      }
    })();
  }, [deletingAll]);

  // update single
  React.useEffect(() => {
    (async () => {
      const id = idsToUpdate[0];
      if (!!id) {
        const value = await getJobId(id);
        dispatch({ type: ACTION.FETCHED_SINGLE, id, value });
      }
    })();
  }, [idsToUpdate]);

  return (
    <>
      <div ref={btnRef}>
        <Btn
          label={`${items.length} edit requests`}
          onClick={onOpen}
          selected={openWindow}
        />
      </div>
      <WindowJobs
        dispatch={dispatch}
        open={openWindow}
        anchorEl={btnRef.current}
        items={items}
      />
    </>
  );
};

export default BtnWindowJobs;
