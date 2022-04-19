import { KEY_VIEW_DATA } from "../../../constants";
import { IProduct, IViewData, MediaType, ViewType } from "../../../interfaces";
import isEmpty from "lodash-es/isEmpty";
import isEqual from "lodash-es/isEqual";

export enum ACTION {
  START = "START",
  RESET = "RESET",
  FETCHING = "FETCHING",
  CREATE_VIEW = "CREATE_VIEW",
  REMOVE_VIEW = "REMOVE_VIEW",
  MODIFY_VIEW = "MODIFY_VIEW",
  CONFIRM_RESET = "CONFIRM_RESET",
}

export enum ViewStatus {
  NONE = "NONE",
  VALUED = "VALUED",
  MODIFY = "MODIFY",
  CREATE = "CREATE",
  REMOVE = "REMOVE",
}
export enum FetchStatus {
  NONE = "NONE",
  VIEWS_CHANGED = "VIEWS_CHANGED",
  VIEWS_RESETED = "VIEWS_RESETED",
}
export interface IViewDraft {
  id: string;
  status: ViewStatus;
  data: {
    viewType?: ViewType;
    mediaType?: MediaType;
    catalog?: string[];
  };
}

interface IReducerState {
  views: IViewDraft[];
  fetch: FetchStatus;
  confirmReset: boolean;
}

export const reducerInitState: IReducerState = {
  views: [],
  fetch: FetchStatus.NONE,
  confirmReset: false,
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACTION.START: {
      const newViews = action.items.reduce(
        (acc: IViewDraft[], item: IProduct) => {
          const setViews = new Set(acc.map(({ id }) => id));
          const itemViews = item[KEY_VIEW_DATA] || [];
          itemViews.forEach((v: IViewData) => {
            if (!setViews.has(v.viewName))
              acc.push({
                id: v.viewName,
                status: ViewStatus.VALUED,
                data: {},
              });
          });
          return acc;
        },
        []
      );
      newState.views = newViews;
      return newState;
    }
    case ACTION.CREATE_VIEW: {
      const { id } = action;
      const viewDraft = newState.views.find((v) => v.id === id);
      const isCreate = !viewDraft
        ? false
        : viewDraft.status === ViewStatus.CREATE;
      const newViews = Array.from(newState.views);

      if (isCreate) {
        // remove view created
        const i = newViews.findIndex((v) => v.id === id);
        newViews.splice(i, 1);
      } else {
        // create new view
        newViews.push({
          id,
          status: ViewStatus.CREATE,
          data: {},
        });
      }

      newState.views = newViews;
      return newState;
    }
    case ACTION.REMOVE_VIEW: {
      const { id } = action;
      const newViews = Array.from(newState.views);
      const index = newViews.findIndex((v) => v.id === id);
      const viewDraft = newViews[index];
      const { status } = viewDraft;

      newViews.splice(index, 1, {
        id,
        status:
          status === ViewStatus.REMOVE ? ViewStatus.VALUED : ViewStatus.REMOVE,
        data: {},
      });

      newState.views = newViews;
      return newState;
    }
    case ACTION.MODIFY_VIEW: {
      const { viewName, items, editedKey, editedValue } = action;
      const newViews = Array.from(newState.views);
      const index = newViews.findIndex((v) => v.id === viewName);
      const viewDraft = newViews[index];
      const { id, status, data } = viewDraft;
      const newData = {
        ...data,
        [editedKey]: editedValue,
      };
      let newStatus = ViewStatus.MODIFY;

      if (status === ViewStatus.CREATE) {
        newStatus = ViewStatus.CREATE;
      }

      // se ho solo un item controllo il nuovo valore e quello iniziale
      // se sono uguali resetto la bozza per avere corretto il conteggio dei modificati
      if (items.length === 1) {
        const viewDatas = items[0][KEY_VIEW_DATA] || [];
        const viewData = viewDatas.find((v) => v.viewName === viewName);

        if (
          !isEmpty(viewData) &&
          !isEmpty(editedValue) &&
          isEqual(viewData[editedKey], editedValue)
        ) {
          delete newData[editedKey];
          if (isEmpty(newData)) newStatus = ViewStatus.VALUED;
        }
      }

      newViews.splice(index, 1, {
        id,
        status: newStatus,
        data: newData,
      });

      newState.views = newViews;
      return newState;
    }
    case ACTION.FETCHING:
      newState.fetch = action.value;
      return newState;
    case ACTION.CONFIRM_RESET:
      newState.confirmReset = action.value;
      return newState;
    case ACTION.RESET:
      return reducerInitState;
    default:
      console.error(`no action ${action.type}`);
      return state;
  }
};

export default reducer;
