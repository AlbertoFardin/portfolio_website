import { getAttributeId } from "../getAttributeKey";

export enum ACT_MODAL {
  RESET = "RESET",
  DOWNLOAD_WITH_ITEMS = "DOWNLOAD_WITH_ITEMS",
  DOWNLOAD_STOPPED = "DOWNLOAD_STOPPED",
  DOWNLOAD_STARTED = "DOWNLOAD_STARTED",
  FIELD_ACTIVE_ID = "FIELD_ACTIVE_ID",
  ATTRIBUTES_INPUTTED = "ATTRIBUTES_INPUTTED",
  ATTRIBUTES_SELECTED = "ATTRIBUTES_SELECTED",
  ATTRIBUTES_SELECTED_ALL = "ATTRIBUTES_SELECTED_ALL",
  ATTRIBUTES_SAVE_SELECTION = "ATTRIBUTES_SAVE_SELECTION",
  SELECTIONS_UPDATE = "SELECTIONS_UPDATE",
  SELECTIONS_SELECT = "SELECTIONS_SELECT",
  SELECTIONS_REMOVE = "SELECTIONS_REMOVE",
  SELECTIONS_RENAME = "SELECTIONS_RENAME",
}

export interface ISelection {
  id: string;
  label: string;
  items: string[];
}
export enum FIELD_IDS {
  ATTRIBUTES = "ATTRIBUTES",
  SELECTIONS = "SELECTIONS",
}

interface IReducerState {
  downloading: boolean;
  downloadWithItems: boolean;
  fieldActiveId: FIELD_IDS;
  attributesInputted: string;
  attributesSelected: string[];
  attributesSaveSelection: boolean;
  selectionsSave: boolean;
  selectionsHash: string;
  selections: ISelection[];
}

export const reducerInitState: IReducerState = {
  downloading: false,
  downloadWithItems: true,
  fieldActiveId: FIELD_IDS.ATTRIBUTES,
  attributesInputted: "",
  attributesSelected: [],
  attributesSaveSelection: true,
  selectionsSave: false,
  selectionsHash: "",
  selections: [],
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACT_MODAL.ATTRIBUTES_INPUTTED:
      newState.attributesInputted = action.value;
      return newState;
    case ACT_MODAL.ATTRIBUTES_SELECTED_ALL: {
      const { attributesSelected } = newState;
      const { ids } = action;
      const removeAll = !!attributesSelected.find((id) => new Set(ids).has(id));
      const newAtts = Array.from(attributesSelected);
      ids.forEach((id) => {
        if (removeAll) {
          const index = newAtts.findIndex((i) => i === id);
          if (index !== -1) newAtts.splice(index, 1);
        } else {
          newAtts.push(id);
        }
      });
      newState.attributesSelected = newAtts;
      return newState;
    }
    case ACT_MODAL.ATTRIBUTES_SELECTED: {
      const { attributesSelected } = newState;
      const { id } = action;
      const newAtts = Array.from(attributesSelected);
      const indexToRemove = newAtts.findIndex((i) => i === id);
      if (indexToRemove === -1) {
        newAtts.push(id);
      } else {
        newAtts.splice(indexToRemove, 1);
      }
      newState.attributesSelected = newAtts;
      return newState;
    }
    case ACT_MODAL.DOWNLOAD_WITH_ITEMS:
      newState.downloadWithItems = !newState.downloadWithItems;
      return newState;
    case ACT_MODAL.DOWNLOAD_STARTED:
      newState.downloading = true;
      return newState;
    case ACT_MODAL.DOWNLOAD_STOPPED:
      newState.downloading = false;
      return newState;
    case ACT_MODAL.SELECTIONS_UPDATE:
      newState.selectionsSave = reducerInitState.selectionsSave;
      newState.selectionsHash = action.hash;
      newState.selections = action.payload;
      return newState;
    case ACT_MODAL.SELECTIONS_REMOVE: {
      const { id } = action;
      const newSlc = Array.from(newState.selections);
      const index = newSlc.findIndex((s) => s.id === id);

      newSlc.splice(index, 1);

      if (!newSlc.length) newState.fieldActiveId = FIELD_IDS.ATTRIBUTES;
      newState.selectionsSave = true;
      newState.selections = newSlc;
      return newState;
    }
    case ACT_MODAL.SELECTIONS_RENAME: {
      const { id, label } = action;
      const newSlc = Array.from(newState.selections);
      const index = newSlc.findIndex((s) => s.id === id);

      newSlc.splice(index, 1, {
        id,
        label,
        items: newSlc[index].items,
      });

      newState.selectionsSave = true;
      newState.selections = newSlc;
      return newState;
    }
    case ACT_MODAL.ATTRIBUTES_SAVE_SELECTION:
      newState.attributesSaveSelection = !newState.attributesSaveSelection;
      return newState;
    case ACT_MODAL.FIELD_ACTIVE_ID:
      newState.attributesInputted = reducerInitState.attributesInputted;
      newState.fieldActiveId = action.value;
      return newState;
    case ACT_MODAL.SELECTIONS_SELECT:
      newState.fieldActiveId = FIELD_IDS.ATTRIBUTES;
      newState.attributesSaveSelection = false;
      newState.attributesInputted = reducerInitState.attributesInputted;
      newState.attributesSelected = newState.selections
        .find((s) => s.id === action.id)
        .items.filter((a) => {
          return action.columns.find((c) => c.id === getAttributeId(a).id);
        });
      return newState;
    case ACT_MODAL.RESET:
      return reducerInitState;
    default:
      return state;
  }
};

export default reducer;
