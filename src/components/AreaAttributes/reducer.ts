import { v4 as uuidv4 } from "uuid";
import {
  ATypeColumn,
  AttributeType,
  IAttribute,
  SheetLayout,
} from "../../interfaces";
import last from "lodash-es/last";

export const typeDict = new Set([
  ATypeColumn.dictionaryEntry,
  ATypeColumn.dictionaryEntries,
]);

export enum ACT_VPORT {
  ITEMS_SAVE_HASH = "ITEMS_SAVE_HASH",
  ITEMS_UPDATE = "ITEMS_UPDATE",
  ITEMS_SELECT = "ITEMS_SELECT",
  ITEMS_DESELECT = "ITEMS_DESELECT",
  ITEMS_RESET = "ITEMS_RESET",
  ITEMS_ADD = "ITEMS_ADD",
  ITEMS_DELETE = "ITEMS_DELETE",
  SHEET_LAYOUT = "SHEET_LAYOUT",
  DETAIL_EDIT_KEYS = "DETAIL_EDIT_KEYS",
  DETAIL_EDIT_TYPE = "DETAIL_EDIT_TYPE",
  SEARCH_INPUT = "SEARCH_INPUT",
}

interface IReducerState {
  reseting: boolean;
  updating: boolean;
  userHash: string;
  userVersion: number;
  confVersion: number;
  confItems: IAttribute[];
  items: IAttribute[];
  itemsIdSelected: string[];
  detailSheet: SheetLayout;
  searchInput: string;
}

export const reducerInitState: IReducerState = {
  reseting: false,
  updating: false,
  userHash: "",
  userVersion: 0,
  confVersion: 0,
  confItems: [],
  items: [],
  itemsIdSelected: [],
  detailSheet: SheetLayout.CLOSED,
  searchInput: "",
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACT_VPORT.ITEMS_SAVE_HASH:
      newState.updating = false;
      newState.userHash = action.docJson.hash;
      return newState;
    case ACT_VPORT.ITEMS_UPDATE: {
      const confVersion = action.docConf.version;
      newState.confVersion = confVersion;
      const confItems = action.docConf.items;
      newState.confItems = confItems;
      //
      const userVersion = action.docJson.payload.version;
      newState.userVersion = userVersion;
      const userHash = action.docJson.hash;
      newState.userHash = userHash;
      //
      const userItems = action.docJson.payload.items;
      const edited = !!userItems.find(
        ({ isDraft, isEdited }) => isDraft || isEdited
      );
      newState.items = edited ? userItems : confItems;
      //
      newState.itemsIdSelected = reducerInitState.itemsIdSelected;
      newState.updating = reducerInitState.updating;
      newState.reseting =
        userVersion !== confVersion && !edited && !newState.reseting;
      return newState;
    }
    case ACT_VPORT.ITEMS_SELECT:
      newState.itemsIdSelected = [action.payload];
      return newState;
    case ACT_VPORT.ITEMS_DESELECT:
      if (newState.detailSheet === SheetLayout.FULLSCREEN) {
        newState.detailSheet = SheetLayout.OPENED;
      }
      newState.itemsIdSelected = [];
      return newState;
    case ACT_VPORT.ITEMS_RESET:
      newState.reseting = true;
      return newState;
    case ACT_VPORT.ITEMS_ADD: {
      const newItem = {
        id: uuidv4(),
        isDraft: true,
      };
      newState.detailSheet = SheetLayout.OPENED;
      newState.items = [].concat(newState.items, newItem);
      newState.itemsIdSelected = [newItem.id];
      newState.updating = true;
      return newState;
    }
    case ACT_VPORT.SHEET_LAYOUT:
      newState.detailSheet = action.layout;
      return newState;
    case ACT_VPORT.ITEMS_DELETE: {
      const itemId = last(newState.itemsIdSelected);
      const itemIndex = newState.items.findIndex(({ id }) => id === itemId);
      const item = newState.items[itemIndex];
      const { isDraft } = item;

      if (!isDraft) console.error("delete to development!");

      const newItems = Array.from(newState.items);
      const newItemId =
        newItems[
          newItems.length - 1 > itemIndex ? itemIndex + 1 : itemIndex - 1
        ].id;
      newItems.splice(itemIndex, 1);

      newState.updating = true;
      newState.items = newItems;
      newState.itemsIdSelected = [newItemId];
      return newState;
    }
    case ACT_VPORT.DETAIL_EDIT_TYPE: {
      const { value } = action;
      const { items, itemsIdSelected } = newState;
      const itemId = last(itemsIdSelected);

      const newItems = Array.from(items);
      const index = items.findIndex(({ id }) => id === itemId);
      const atypeUser = value === AttributeType.USER;
      const newItem: IAttribute = {
        id: itemId,
        attributeType: value,
        isDraft: true,
        isEdited: true,
        groupId: "Product",
        editable: atypeUser,
        carryOver: atypeUser ? undefined : false,
      };

      newItems.splice(index, 1, newItem);
      newState.items = newItems;
      newState.updating = true;
      return newState;
    }
    case ACT_VPORT.DETAIL_EDIT_KEYS: {
      const { items, itemsIdSelected } = newState;
      const { payload } = action;

      const itemId = last(itemsIdSelected);
      const index = items.findIndex(({ id }) => id === itemId);
      const item = items[index];

      const newItems = Array.from(newState.items);
      const newItem: IAttribute = {
        ...item,
        isEdited: true,
      };

      payload.forEach(({ key, value }) => {
        newItem[key] = value;
      });

      newItems.splice(index, 1, newItem);
      newState.items = newItems;
      newState.updating = true;
      return newState;
    }
    case ACT_VPORT.SEARCH_INPUT:
      newState.searchInput = action.value;
      return newState;
    default:
      console.error(`no action ${action.type}`);
      return state;
  }
};

export default reducer;
