import * as React from "react";
import {
  INotification,
  IWsNotification,
  NotificationType,
  Service,
} from "../../interfaces";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Divider from "@material-ui/core/Divider";
import LoadingMask from "../../componentsBase/LoadingMask";
import Placeholder from "../../componentsBase/Placeholder";
import Pagination from "../../componentsBase/Pagination";
import isEmpty from "lodash-es/isEmpty";
import Card from "./Card";
import { PANEL_FILTER_WIDTH } from "../../constants";
import Toolbar from "@material-ui/core/Toolbar";
import Btn from "../../componentsBase/Btn";
import * as Colors from "../../componentsBase/style/Colors";
import { reducer, reducerInitState, ACTION } from "./reducer";
import {
  getNotifications,
  getNotificationsCount,
  markAllNotificationRead,
  markAllNotificationView,
  deleteAllNotifications,
} from "../../api/fetchesApi";
import { ACTION_MAIN } from "../reducer";
import {
  registerWebSocketCallback,
  unregisterWebSocketCallback,
} from "../webSocket";
import { ContextDispatchMain } from "../contexts";

const width = PANEL_FILTER_WIDTH;
interface IStyles {
  open: boolean;
}
const useStyles = makeStyles({
  panelNotifications: {
    position: "relative",
    width: ({ open }: IStyles) => (open ? width : 0),
    "min-width": ({ open }: IStyles) => (open ? width : 0),
    transition: "all 250ms",
    "border-right": "1px solid #e5e5e5",
    overflow: "hidden",
    "background-color": Colors.Gray4,
  },
  content: {
    position: "relative",
    height: "100%",
    width: width,
    "min-width": width,
    display: "flex",
    "flex-direction": "column",
  },
  toolbar: {
    padding: "0 10px",
    "z-index": 2,
  },
  flex1: {
    flex: 1,
  },
  list: {
    flex: 1,
    "overflow-y": "overlay",
  },
});

interface IPanelNotifications {
  open: boolean;
  countToView: number;
}

const PanelNotifications = ({ open, countToView }: IPanelNotifications) => {
  const classes = useStyles({ open });
  const dispatchMain = React.useContext(ContextDispatchMain);

  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const {
    items,
    itemsTotal,
    loading,
    paginationSize,
    paginationFrom,
    allMarkingRead,
    allDeleting,
    newItemsToView,
  } = state;
  const onDeleteAll = React.useCallback(() => {
    dispatch({ type: ACTION.DELETE_ALL, value: true });
  }, []);
  const onMarkAllRead = React.useCallback(() => {
    dispatch({ type: ACTION.MARK_READ_ALL, value: true });
  }, []);
  const onPaginationChange = React.useCallback((value: number) => {
    dispatch({ type: ACTION.PAGINATION, value: value - 1 });
  }, []);
  const onNewNotification = React.useCallback(
    (itemsWs: IWsNotification[], dispatch: React.Dispatch<unknown>) => {
      const ids = itemsWs
        .filter(({ isError, service, notificationType }) => {
          return (
            !isError &&
            service === Service.NOTIFIER &&
            notificationType !== NotificationType.MULTI_PRODUCT_EDITING
          );
        })
        .map((i) => i.payload.uuid);

      if (isEmpty(ids)) return null;

      if (open) dispatch({ type: ACTION.NEW_ITEMS });

      dispatchMain({ type: ACTION_MAIN.NOTIFICATIONS_LOAD });
    },
    [dispatchMain, open]
  );

  // on open get notifications, on close reset state
  React.useEffect(() => {
    (async () => {
      if (open) {
        const newItems = await getNotifications({
          size: paginationSize,
          from: paginationFrom * paginationSize,
        });
        const newItemTotal = await getNotificationsCount();
        dispatch({ type: ACTION.INITIALIZE, newItems, newItemTotal });
      } else {
        dispatch({ type: ACTION.RESET });
      }
    })();
  }, [open, paginationFrom, paginationSize]);

  // delete all at click button
  React.useEffect(() => {
    (async () => {
      if (allDeleting) {
        await deleteAllNotifications();
        dispatch({ type: ACTION.DELETE_ALL, value: false });
      }
    })();
  }, [allDeleting]);

  // mark all as read at click button
  React.useEffect(() => {
    (async () => {
      if (allMarkingRead) {
        await markAllNotificationRead();
        dispatch({ type: ACTION.MARK_READ_ALL, value: false });
      }
    })();
  }, [allMarkingRead]);

  // mark all as viewed at opening panel
  React.useEffect(() => {
    (async () => {
      if (open && countToView !== 0 && paginationFrom === 0) {
        await markAllNotificationView();
        dispatchMain({ type: ACTION_MAIN.NOTIFICATIONS_LOAD });
      }
    })();
  }, [countToView, dispatchMain, open, paginationFrom]);

  // register WS NOTIFIER
  React.useEffect(() => {
    registerWebSocketCallback({
      id: Service.NOTIFIER,
      callback: onNewNotification,
      dispatch,
    });
    return () => {
      unregisterWebSocketCallback(Service.NOTIFIER);
    };
  }, [onNewNotification]);

  // after WS notifications, show new cards
  React.useEffect(() => {
    (async () => {
      if (open && newItemsToView && paginationFrom === 0) {
        const newItems = await getNotifications({
          size: paginationSize,
          from: paginationFrom,
          filter: "to_view",
        });
        dispatch({ type: ACTION.ITEM_CREATE, newItems });
      }
    })();
  }, [newItemsToView, open, paginationFrom, paginationSize]);

  return (
    <div className={classes.panelNotifications}>
      <div className={classes.content}>
        <LoadingMask open={loading} spinner={true} />
        {loading || !isEmpty(items) ? null : (
          <Placeholder icon="notifications_none" label="no notification" />
        )}
        <div className={classes.list}>
          <Toolbar className={classes.toolbar}>
            <Btn label="Notifications" />
            <div className={classes.flex1} />
            {isEmpty(items) ? null : (
              <Btn
                icon="more_vert"
                style={{ margin: 0 }}
                menu={{
                  items: [
                    {
                      id: "read_all",
                      icon: "drafts",
                      label: "Mark all as read",
                      onClick: onMarkAllRead,
                    },
                    {
                      id: "delete_all",
                      icon: "delete",
                      label: "Clear all",
                      onClick: onDeleteAll,
                    },
                  ],
                  anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "right",
                  },
                  transformOrigin: {
                    vertical: "top",
                    horizontal: "right",
                  },
                }}
              />
            )}
          </Toolbar>
          {items.map((n: INotification) => (
            <Card key={n.id} dispatch={dispatch} notification={n} />
          ))}
        </div>
        <Divider />
        {itemsTotal <= paginationSize ? null : (
          <Toolbar className={classes.toolbar}>
            <div className={classes.flex1} />
            <Pagination
              itemsCount={itemsTotal}
              onChangeCurrent={onPaginationChange}
              pageCurrent={paginationFrom + 1}
              pageSizes={paginationSize}
            />
          </Toolbar>
        )}
      </div>
    </div>
  );
};

export default PanelNotifications;
