import {
  ISortOrder,
  SortColumn,
} from "../../componentsBase/StickyGrid/interfaces";
import { DATE_FORMAT } from "../../constants";
import {
  IAdminUserProfile,
  IFilter,
  IRole,
  SheetLayout,
} from "../../interfaces";
import { columns, EMAIL_KEY } from "./constants";
import sortUsers from "./sortUsers";

export enum ACT_VPORT {
  RESET = "RESET",
  SELECTED_ID = "ITEMS_SELECT",
  SHEET_LAYOUT = "SHEET_LAYOUT",
  USERS_LOADING = "USERS_LOADING",
  USERS_SET = "USERS_SET",
  SORT_BY = "SORT_BY",
  FILTERS = "FILTERS",
  USER_CREATING = "USER_CREATING",
  USER_ADDED = "USER_ADDED",
  USER_CHANGE_DATAS = "USER_CHANGE_DATAS",
  USER_CHANGE_ROLES = "USER_CHANGE_ROLES",
  USER_CHANGE_APPLICATIONS = "USER_CHANGE_APPLICATIONS",
  DIALOG_UNSAVED = "DIALOG_UNSAVED",
  DISCARD_CHANGES = "DISCARD_CHANGES",
}

interface IReducerState {
  selectedId: string;
  detailSheet: SheetLayout;
  sortColumns: SortColumn[];
  filters: IFilter[];
  userNewCreating: boolean;
  userNew?: IAdminUserProfile;
  users: IAdminUserProfile[];
  roles: IRole[];
  applications: string[];
  inEdit: boolean;
  dialogUnsaved: boolean;
}

export const reducerInitState: IReducerState = {
  selectedId: "",
  detailSheet: SheetLayout.CLOSED,
  sortColumns: [{ id: EMAIL_KEY, order: ISortOrder.ASC }],
  filters: [],
  userNewCreating: false,
  userNew: undefined,
  users: [],
  roles: [],
  applications: [],
  inEdit: false,
  dialogUnsaved: false,
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACT_VPORT.RESET:
      return reducerInitState;
    case ACT_VPORT.SELECTED_ID:
      newState.selectedId = action.value || reducerInitState.selectedId;
      return newState;
    case ACT_VPORT.SHEET_LAYOUT:
      newState.detailSheet = action.value;
      return newState;
    case ACT_VPORT.USERS_SET:
      newState.users = sortUsers(action.newUsers, newState.sortColumns);
      newState.roles = action.newRoles;
      newState.applications = action.newApplications;
      newState.filters = columns
        .filter((c) => c.filter)
        .map((c) => ({
          id: c.id,
          label: c.label,
          keyword: true,
          type: c.filter,
          showCaseSensitiveSwitch: false,
          dateFormat: DATE_FORMAT,
        }));

      return newState;
    case ACT_VPORT.SORT_BY:
      if (!!action.sorts.length) {
        newState.users = sortUsers(newState.users, action.sorts);
        newState.sortColumns = action.sorts;
      }
      return newState;
    case ACT_VPORT.FILTERS:
      newState.filters = action.filters;
      return newState;
    case ACT_VPORT.DIALOG_UNSAVED:
      newState.dialogUnsaved = !newState.dialogUnsaved;
      return newState;
    case ACT_VPORT.DISCARD_CHANGES:
      newState.dialogUnsaved = reducerInitState.dialogUnsaved;
      newState.inEdit = reducerInitState.inEdit;
      newState.userNew = reducerInitState.userNew;
      newState.dialogUnsaved = reducerInitState.dialogUnsaved;
      newState.dialogUnsaved = reducerInitState.dialogUnsaved;
      return newState;
    case ACT_VPORT.USER_ADDED:
      newState.detailSheet = SheetLayout.OPENED;
      newState.inEdit = true;
      newState.selectedId = "";
      newState.userNew = {
        sub: "",
        userId: "",
        profileData: {
          email: "",
          firstName: "",
          lastName: "",
          isWarda: false,
        },
        tenants: [],
        roles: [],
        applications: newState.applications,
      };
      return newState;
    case ACT_VPORT.USER_CHANGE_DATAS:
      newState.userNew = {
        ...newState.userNew,
        profileData: {
          ...newState.userNew.profileData,
          [action.key]: action.value,
        },
      };
      return newState;
    case ACT_VPORT.USER_CHANGE_ROLES:
      newState.userNew = {
        ...newState.userNew,
        roles: action.value,
      };
      return newState;
    case ACT_VPORT.USER_CHANGE_APPLICATIONS:
      newState.userNew = {
        ...newState.userNew,
        applications: action.value,
      };
      return newState;
    case ACT_VPORT.USER_CREATING:
      newState.userNewCreating = true;
      return newState;
    default:
      console.error("AreaUsers no action", action);
      return state;
  }
};

export default reducer;
