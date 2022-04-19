import getMultiReadyCatalogs from "./utils/getMultiReadyCatalogs";
import IMultiReadyCatalog from "./IMultiReadyCatalog";
import getMultiReadyViews from "./utils/getMultiReadyViews";
import IMultiReadyView from "./IMultiReadyView";
import checkCatalogsDisabled from "./utils/checkCatalogsDisabled";

export enum ACTION {
  RESET = "RESET",
  INIT = "INIT",
  CHANGE_CATALOGS = "CHANGE_CATALOGS",
  CHANGE_VIEWS = "CHANGE_VIEWS",
  SAVE_CLICK = "SAVE_CLICK",
  SAVING = "SAVING",
  SAVE_STOP = "SAVING_STOP",
  TOGGLE_SKIP_REVIEW = "TOGGLE_SKIP_REVIEW",
  TOGGLE_SKIP_READY = "TOGGLE_SKIP_READY",
  TOGGLE_SKIP_CHECKED = "TOGGLE_SKIP_CHECKED",
}

interface IReducerState {
  catalogs: IMultiReadyCatalog[];
  views: IMultiReadyView[];
  saveClicked: boolean;
  saving: boolean;
  skipItemsReview: boolean;
  skipItemsReady: boolean;
  onlyItemsChecked: boolean;
}

export const reducerInitState = {
  catalogs: [],
  views: [],
  saveClicked: false,
  saving: false,
  skipItemsReview: false,
  skipItemsReady: false,
  onlyItemsChecked: true,
};

const reducer = (state: IReducerState, action) => {
  const newState = { ...state };
  switch (action.type) {
    case ACTION.INIT: {
      newState.catalogs = getMultiReadyCatalogs(
        action.items,
        action.tenantCatalogs
      );
      newState.views = getMultiReadyViews(action.items);
      return newState;
    }
    case ACTION.CHANGE_CATALOGS: {
      const changedCatalogs = action.changedItems;

      const changedSelectedCatalogsIdSet = new Set(
        changedCatalogs.reduce((acc, c: IMultiReadyCatalog) => {
          if (c.selected) acc.push(c.id);
          return acc;
        }, [] as string[])
      );
      const newViews = newState.views.map((v: IMultiReadyView) => {
        if (!changedSelectedCatalogsIdSet.has(v.catalog)) return v;
        return {
          ...v,
          selected: true,
        };
      });
      const newCatalogs = action.newItems;
      newState.views = newViews;
      newState.catalogs = checkCatalogsDisabled(newCatalogs, newViews);
      return newState;
    }
    case ACTION.CHANGE_VIEWS: {
      const newViews = action.newItems;
      newState.views = newViews;
      newState.catalogs = checkCatalogsDisabled(newState.catalogs, newViews);
      return newState;
    }
    case ACTION.TOGGLE_SKIP_REVIEW:
      newState.skipItemsReview = !state.skipItemsReview;
      return newState;
    case ACTION.TOGGLE_SKIP_READY:
      newState.skipItemsReady = !state.skipItemsReady;
      return newState;
    case ACTION.TOGGLE_SKIP_CHECKED:
      newState.onlyItemsChecked = !state.onlyItemsChecked;
      return newState;
    case ACTION.SAVE_CLICK:
      newState.saveClicked = true;
      return newState;
    case ACTION.SAVING:
      newState.saving = true;
      return newState;
    case ACTION.SAVE_STOP:
      newState.saveClicked = false;
      newState.saving = false;
      return newState;
    case ACTION.RESET:
      return reducerInitState;
    default:
      console.error(`no action ${action.type}`);
      return state;
  }
};

export default reducer;
