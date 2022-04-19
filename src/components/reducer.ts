import { IIMultiDownloadsItem } from "../componentsBase/MultiDownloads";
import {
  IUserProfile,
  IPermission,
  Severity,
  IM2m,
  ITenant,
} from "../interfaces";
import { v4 as uuidv4 } from "uuid";
import { IAlert } from "./Alert";
import isEmpty from "lodash-es/isEmpty";
import IUploadToAdd from "./Uploads/DAUploads/IUploadsDA";
import getFileId from "./Uploads/utils/getFileId";
import { IUploadFile, IFileStatus } from "./Uploads";
import { closeWebSocket } from "./webSocket";

const defaultAlert = { open: false, severity: Severity.SUCCESS, message: "" };

export enum ACTION_MAIN {
  RESET = "RESET",
  REFRESH_TIME = "REFRESH_TIME",
  CONFIG_UPDATE = "CONFIG_UPDATE",
  CONFERENCE = "CONFERENCE",
  DOWNLOADS__RESET = "DOWNLOADS__RESET",
  DOWNLOADS_TO_ADD = "DOWNLOADS_TO_ADD",
  DOWNLOADS_UPDATE = "DOWNLOADS_UPDATE",
  DOWNLOADS_FINISH = "DOWNLOADS_FINISH",
  UPLOADS_MCR = "UPLOADS_MCR",
  UPLOADS_DA = "UPLOADS_DA",
  SNACKBAR__RESET = "SNACKBAR__RESET",
  SNACKBAR_UPDATE = "SNACKBAR_UPDATE",
  INFO_USER = "INFO_USER",
  USERS_SET = "USERS_SET",
  NOTIFICATIONS_OPEN = "NOTIFICATIONS_OPEN",
  UPDATE_CONFIGURATION = "UPDATE_CONFIGURATION",
  USERS_LOADING = "USERS_LOADING",
  NOTIFICATIONS_SIZE = "NOTIFICATIONS_SIZE",
  NOTIFICATIONS_LOAD = "NOTIFICATIONS_LOAD",
  REFRESH_USERS = "REFRESH_USERS",
  SWITCH_TENANT = "SWITCH_TENANT",
  REFRESH_TOKEN = "REFRESH_TOKEN",
  WS_INITIALIZED = "WS_INITIALIZED",
}

interface IReducer {
  alert: IAlert;
  downloads: IIMultiDownloadsItem[];
  uploads: IUploadFile[];
  uploadsDA: IUploadToAdd;
  conference: boolean;
  snackbar: IAlert;
  userInfo: boolean;
  userPermissions: IPermission[];
  users: IUserProfile[];
  m2ms: IM2m[];
  usersInitialization: boolean;
  notificationsLoading: boolean;
  notificationsToView: number;
  notificationsOpen: boolean;
  refreshTime: number;
  loadingUsers: boolean;
  userProfile: IUserProfile;
  tenantId: string;
  tenants: ITenant[];
  refreshingToken: boolean;
}

export const reducerInitState: IReducer = {
  alert: defaultAlert,
  downloads: [],
  uploads: [],
  uploadsDA: {},
  conference: false,
  snackbar: defaultAlert,
  userInfo: false,
  userPermissions: [],
  users: [],
  m2ms: [],
  usersInitialization: true,
  notificationsLoading: true,
  notificationsToView: 0,
  notificationsOpen: false,
  refreshTime: 0,
  loadingUsers: false,
  userProfile: undefined,
  tenantId: "",
  tenants: [],
  refreshingToken: false,
};

export const reducer = (state: IReducer, action): IReducer => {
  const newState = { ...state };
  switch (action.type) {
    case ACTION_MAIN.RESET:
      console.log("[mainReducer] reset");
      closeWebSocket();
      return reducerInitState;
    case ACTION_MAIN.DOWNLOADS_TO_ADD: {
      const oldDownloads = newState.downloads;
      const newDownloads = newState.downloads.map((item) => ({ ...item }));
      if (
        oldDownloads.find(({ id }) => id === action.payload.correlationId) ===
        undefined
      ) {
        newDownloads.push({
          id: action.payload.correlationId,
          loading: true,
          name: action.payload.filename,
          url: "",
        });
        newState.downloads = newDownloads;
      } else {
        console.warn(
          `Archiver multiple download START for ID: ${action.payload.correlationId}`
        );
      }
      return newState;
    }
    case ACTION_MAIN.DOWNLOADS_UPDATE: {
      const newDownloads = Array.from(newState.downloads);
      const itemToUpdate = newDownloads.find(
        ({ id }) => id === action.payload.correlationId
      );

      // nothing to update - return state to avoid rerender
      if (isEmpty(itemToUpdate)) return state;

      const itemIndex = newDownloads.indexOf(itemToUpdate);
      newDownloads[itemIndex] = {
        ...itemToUpdate,
        name: action.payload.filename,
        url: action.payload.message,
      };
      newState.downloads = newDownloads;

      return newState;
    }
    case ACTION_MAIN.DOWNLOADS_FINISH: {
      const newDownloads = Array.from(newState.downloads);
      const itemToUpdate = newDownloads.find(
        ({ id }) => id === action.payload.correlationId
      );

      // nothing to update - return state to avoid rerender
      if (isEmpty(itemToUpdate)) return state;

      const itemIndex = newDownloads.indexOf(itemToUpdate);
      newDownloads[itemIndex] = {
        ...itemToUpdate,
        loading: false,
        url: action.payload.message,
      };
      newState.downloads = newDownloads;

      return newState;
    }
    case ACTION_MAIN.DOWNLOADS__RESET:
      newState.downloads = reducerInitState.downloads;
      return newState;
    case ACTION_MAIN.UPLOADS_MCR: {
      const sessionUploadId = uuidv4();
      const { files, mediaType, importXls } = action;
      newState.uploads = files.map((f) => ({
        id: getFileId(f),
        sessionUploadId,
        status: IFileStatus.Waiting,
        file: f,
        metadata: {
          importXls,
          mediaType,
        },
      }));
      return newState;
    }
    case ACTION_MAIN.UPLOADS_DA: {
      const sessionUploadId = uuidv4();
      const { files, folderId } = action;
      newState.uploadsDA = {
        folderId,
        ifiles: files.map((f) => ({
          id: getFileId(f),
          sessionUploadId,
          status: IFileStatus.Waiting,
          file: f,
        })),
      };
      return newState;
    }
    case ACTION_MAIN.CONFERENCE:
      newState.conference = !newState.conference;
      return newState;
    case ACTION_MAIN.SNACKBAR_UPDATE:
      newState.snackbar = {
        open: true,
        severity: action.severity,
        message: action.message,
      };
      return newState;
    case ACTION_MAIN.SNACKBAR__RESET:
      newState.snackbar = reducerInitState.snackbar;
      return newState;
    case ACTION_MAIN.REFRESH_TIME:
      newState.refreshTime = action.time;
      newState.snackbar = reducerInitState.snackbar;
      return newState;
    case ACTION_MAIN.USERS_LOADING: {
      newState.loadingUsers = true;
      return newState;
    }
    case ACTION_MAIN.USERS_SET: {
      const { usersAndM2ms, userPermissions, userProfile } = action;

      newState.users = usersAndM2ms.users;
      newState.m2ms = usersAndM2ms.m2ms;
      newState.userPermissions = userPermissions;
      newState.userProfile = userProfile;
      newState.tenantId = userProfile.tenantId;
      if (userProfile.tenants.length > 1) {
        newState.tenants = userProfile.tenants.map((t) => ({
          id: t.tenantId,
          label: t.label,
          active: t.tenantId === userProfile.tenantId,
        }));
      }

      newState.usersInitialization = false;
      newState.loadingUsers = false;
      return newState;
    }
    case ACTION_MAIN.REFRESH_USERS: {
      newState.usersInitialization = true;
      return newState;
    }
    case ACTION_MAIN.NOTIFICATIONS_OPEN:
      newState.notificationsOpen = !newState.notificationsOpen;
      return newState;
    case ACTION_MAIN.NOTIFICATIONS_SIZE:
      newState.notificationsLoading = false;
      newState.notificationsToView = action.toView;
      return newState;
    case ACTION_MAIN.NOTIFICATIONS_LOAD:
      newState.notificationsLoading = true;
      return newState;
    case ACTION_MAIN.CONFIG_UPDATE:
      newState.alert = {
        open: true,
        severity: Severity.WARNING,
        message:
          "CONFIGURATION UPDATE - You may not have access to some features, please refresh the page",
      };
      return newState;
    case ACTION_MAIN.INFO_USER:
      newState.userInfo = !newState.userInfo;
      return newState;
    case ACTION_MAIN.SWITCH_TENANT:
      newState.tenantId = action.id;
      return newState;
    case ACTION_MAIN.REFRESH_TOKEN:
      newState.refreshingToken = action.v;
      return newState;
    default:
      return newState;
  }
};
