import * as React from "react";
import MainContext from "./MainContext";
import Alert from "./Alert";
import Snackbar from "./Snackbar";
import MainToolbar from "./MainToolbar";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Divider from "@material-ui/core/Divider";
import isEmpty from "lodash-es/isEmpty";
import loadable from "@loadable/component";
import {
  AREA_PRODUCTS,
  AREA_STAGING,
  AREA_ATTRIBUTES,
  AREA_CATALOGS,
  AREA_USERS,
  AREA_FILES,
  AREA_CATEGORIES,
  TENANT_ID,
  AREA_MY_WORK,
  REFRESH_TOKEN,
  AUTHORIZATION_TOKEN,
  AREA_PERMISSIONS,
} from "../constants";
import {
  openWebSocket,
  registerWebSocketCallback,
  unregisterWebSocketCallback,
} from "./webSocket";
import PanelNotifications from "./PanelNotifications";
import webSocketCallbacks from "./websocketCallbacks";
import { ACTION_MAIN, reducer, reducerInitState } from "./reducer";
import getSections from "./getSections";
import { getNotificationsCount } from "../api/fetchesApi";
import WindowDownloads from "./WindowDownloads";
import McrUploads from "./Uploads/McrUploads";
import { IArea } from "../interfaces";
import ModalUserInfo from "./ModalUserInfo";
import { getUsersAndPermissions } from "../getDataUsers";
import DAUploads from "./Uploads/DAUploads";
import { useHistory } from "react-router-dom";
import {
  fetchCookieJwtWithRefreshToken,
  logOut,
  persistenCookieForRefreshToken,
  requestTokenWithRefreshToken,
  switchTenant,
} from "../api/fetchCookieJwt";
import { BASE_URL } from "../api/endpoints";
import Cookies from "js-cookie";

const WebConference = loadable(() => import("../componentsBase/WebConference"));

const useStyles = makeStyles({
  main: {
    position: "relative",
    flex: 1,
    display: "flex",
    height: "100%",
    width: "100%",
    "flex-direction": "column",
    "align-items": "stretch",
  },
  flexRow: {
    position: "relative",
    flex: 1,
    display: "flex",
    "flex-direction": "row",
    "align-items": "stretch",
    "min-height": 0, // fix sidepanels height
  },
  flex1: {
    flex: 1,
  },
});

interface IMain {
  viewId: string;
}

const AreaProducts = loadable(() => import("./AreaProducts"));
const AreaStaging = loadable(() => import("./AreaStaging"));
const AreaFiles = loadable(() => import("./AreaFiles"));
const AreaAttributes = loadable(() => import("./AreaAttributes"));
const AreaCatalogs = loadable(() => import("./AreaCatalogs"));
const AreaCategories = loadable(() => import("./AreaCategories"));
const AreaUsers = loadable(() => import("./AreaUsers"));
const AreaWorkingArea = loadable(() => import("./AreaMyWorkArea"));
const AreaPermissions = loadable(() => import("./AreaPermissions"));

const Main = ({ viewId }: IMain) => {
  const history = useHistory();
  const classes = useStyles({});
  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const {
    alert,
    downloads,
    uploads,
    uploadsDA,
    snackbar,
    userInfo,
    userPermissions,
    users,
    m2ms,
    usersInitialization,
    conference,
    notificationsLoading,
    notificationsToView,
    notificationsOpen,
    refreshTime,
    loadingUsers,
    userProfile,
    tenantId,
    tenants,
    refreshingToken,
  } = state;

  const cbConferenceOnClose = React.useCallback(
    () => dispatch({ type: ACTION_MAIN.CONFERENCE }),
    []
  );
  const cbConferenceGetUser = React.useCallback(
    (id: string) => {
      return users.find((u) => u.id === id);
    },
    [users]
  );
  const onLogout = React.useCallback(() => {
    logOut(history);
  }, [history]);
  const cbConferenceOnAuthorizationFailed = React.useCallback(
    (err) => {
      if (err.status === 401) onLogout();
    },
    [onLogout]
  );
  const sectionCheck = React.useCallback(
    (sectionId: string, sectionCmp: JSX.Element) => {
      const hasId = viewId === sectionId;
      return hasId ? sectionCmp : null;
    },
    [viewId]
  );
  const sections = getSections(userPermissions);
  const urlWebSocket = `${process.env.WEBSOCKET_URL}/${process.env.PRODUCT_ID}`;

  React.useEffect(() => {
    (async () => {
      if (!loadingUsers && usersInitialization) {
        dispatch({ type: ACTION_MAIN.USERS_LOADING });
        try {
          const {
            userProfile,
            userPermissions,
            usersAndM2ms,
          } = await getUsersAndPermissions();

          dispatch({
            type: ACTION_MAIN.USERS_SET,
            usersAndM2ms,
            userPermissions,
            userProfile,
          });
          persistenCookieForRefreshToken({
            sub: userProfile.sub,
            groupId: userProfile.groupId,
            tenantId: userProfile.tenantId,
          });
        } catch (err) {
          console.log("[error] fetching Users -> logOut()");
          onLogout();
        }
      }
    })();
  }, [history, loadingUsers, onLogout, usersInitialization]);

  // Avvio websocket
  React.useEffect(() => {
    openWebSocket(urlWebSocket);
  }, [urlWebSocket]);

  // add websocket listener
  React.useEffect(() => {
    webSocketCallbacks.forEach((x) => {
      registerWebSocketCallback({
        id: x.id,
        callback: x.callback,
        dispatch,
      });
    });

    return () => {
      webSocketCallbacks.forEach((x) => {
        unregisterWebSocketCallback(x.id);
      });
    };
  }, []);

  // get notification count
  React.useEffect(() => {
    if (notificationsLoading && !isEmpty(users)) {
      (async () => {
        const toView = await getNotificationsCount("to_view");
        dispatch({ type: ACTION_MAIN.NOTIFICATIONS_SIZE, toView });
      })();
    }
  }, [notificationsLoading, users]);

  // check viewId permission
  React.useEffect(() => {
    const mySectionIds = sections.reduce((acc, s) => {
      if (!s.divider && !s.hidden && !s.disabled) acc.push(s.id);
      return acc;
    }, []);
    const viewIdExist = new Set(mySectionIds).has(viewId);
    if (!usersInitialization) {
      if (isEmpty(users)) {
        console.log("[error] no users found");
        onLogout();
        return () => null;
      }
      if (isEmpty(mySectionIds)) {
        console.log("[error] no sections to access");
        onLogout();
        return () => null;
      }
      if (!viewIdExist) {
        history.push(`/${mySectionIds[0]}/`);
        return () => null;
      }
    }
  }, [history, onLogout, sections, users, usersInitialization, viewId]);

  React.useEffect(() => {
    (async () => {
      if (tenantId && userProfile && tenantId !== userProfile.tenantId) {
        await switchTenant(tenantId);
        dispatch({ type: ACTION_MAIN.RESET });
      }
    })();
  }, [tenantId, userProfile]);

  const areaProps: IArea = {
    refreshTime,
  };

  React.useEffect(() => {
    if (refreshingToken) {
      (async () => {
        try {
          await requestTokenWithRefreshToken();
          dispatch({ type: ACTION_MAIN.REFRESH_TOKEN, v: false });
          console.log("[authorizationToken] obtained and saved");
          openWebSocket(urlWebSocket);
        } catch (err) {
          console.log("[authorizationToken] error");
          logOut(history);
        }
      })();
    }
  }, [urlWebSocket, history, refreshingToken]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (
        userProfile &&
        Cookies.get(TENANT_ID) &&
        userProfile.tenantId !== Cookies.get(TENANT_ID) &&
        !refreshingToken
      ) {
        dispatch({ type: ACTION_MAIN.RESET });
      }
      if (
        !refreshingToken &&
        Cookies.get(REFRESH_TOKEN) &&
        !Cookies.get(AUTHORIZATION_TOKEN)
      ) {
        console.log("[authorizationToken] expired");
        dispatch({ type: ACTION_MAIN.REFRESH_TOKEN, v: true });
      }
    }, 250);

    return () => clearInterval(interval);
  }, [refreshingToken, userProfile]);

  return isEmpty(users) ? null : (
    <MainContext
      dispatchMain={dispatch}
      permissions={userPermissions}
      users={users}
      m2ms={m2ms}
      userProfile={userProfile}
    >
      <Alert
        open={alert.open}
        severity={alert.severity}
        message={alert.message}
      />
      <div className={classes.main}>
        <MainToolbar
          userProfile={userProfile}
          tenantId={tenantId}
          tenants={tenants}
          sectionId={viewId}
          sections={sections}
          notificationsToView={notificationsToView}
          notificationsOpen={notificationsOpen}
          conferenceOpen={conference}
        />
        <Divider />
        <div className={classes.flexRow}>
          <PanelNotifications
            open={notificationsOpen}
            countToView={notificationsToView}
          />

          <div
            // this div is needed to wrap EastPanel fullscreen
            className={classes.flexRow}
          >
            {sectionCheck(AREA_PRODUCTS, <AreaProducts {...areaProps} />)}
            {sectionCheck(AREA_STAGING, <AreaStaging {...areaProps} />)}
            {sectionCheck(AREA_FILES, <AreaFiles {...areaProps} />)}
            {sectionCheck(AREA_ATTRIBUTES, <AreaAttributes />)}
            {sectionCheck(AREA_CATALOGS, <AreaCatalogs />)}
            {sectionCheck(AREA_CATEGORIES, <AreaCategories />)}
            {sectionCheck(AREA_USERS, <AreaUsers />)}
            {sectionCheck(AREA_MY_WORK, <AreaWorkingArea />)}
            {sectionCheck(AREA_PERMISSIONS, <AreaPermissions />)}
          </div>
        </div>
      </div>
      <ModalUserInfo open={userInfo} />
      <McrUploads uploads={uploads} />
      <DAUploads uploadsDA={uploadsDA} />
      <WindowDownloads downloads={downloads} />
      <WebConference
        open={conference}
        productId={process.env.PRODUCT_ID}
        onClose={cbConferenceOnClose}
        baseUrl={BASE_URL}
        getUser={cbConferenceGetUser}
        onAuthorizationFailed={cbConferenceOnAuthorizationFailed}
        fetchJwt={fetchCookieJwtWithRefreshToken}
      />
      <Snackbar
        open={snackbar.open}
        severity={snackbar.severity}
        message={snackbar.message}
      />
    </MainContext>
  );
};

export default Main;
