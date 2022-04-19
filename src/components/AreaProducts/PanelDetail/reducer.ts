import { IProduct, ICatalog, IMediaInfo } from "../../../interfaces";
import getAssetdataDirty from "./getAssetdataDirty";
import {
  IDialogCategory,
  IDialogDictionary,
  IAttributeSelector,
} from "./interfaces";
import { intersectionBy } from "lodash-es";
import { PointSelector } from "../../../componentsBase/ImageAnnotation";
import { KEY_CATALOG } from "../../../constants";

export enum ACT_DETAIL {
  RESET = "RESET",
  ASSETDATAS_UPDATED = "UPDATE_ASSETDATAS",
  ASSETDATAS_FETCHED = "ASSETDATAS_FETCHED",
  EDITING_KEY_VALUE = "EDITING_KEY_VALUE",
  EDITING_KEY_CLEAN = "EDITING_KEY_CLEAN",
  EDITING_DISCARDED = "EDITING_DISCARDED",
  EDITING_SAVE_STARTED = "EDITING_SAVE_STARTED",
  EDITING_SAVE_PROCESS = "EDITING_SAVE_PROCESS",
  EDITING_SAVE_STOPPED = "EDITING_SAVE_STOPPED",
  EDITING_MAX_SELECTED = "EDITING_MAX_SELECTED",
  SHOW_DIALOG_UNSAVED = "SHOW_DIALOG_UNSAVED",
  SHOW_DIALOG_CONFLICT = "SHOW_DIALOG_CONFLICT",
  SHOW_DIALOG_DICTIONARY = "SHOW_DIALOG_DICTIONARY",
  SHOW_DIALOG_CATEGORY = "SHOW_DIALOG_CATEGORY",
  SELECT_CATALOG = "SELECT_CATALOG",
  SELECT_LANGUAG = "SELECT_LANGUAG",
  SELECT_LANGUAG_ALL = "SELECT_LANGUAG_ALL",
  SET_VERSION = "SET_VERSION",
  SET_ATTRIBUTE_READY = "SET_ATTRIBUTE_READY",
  SET_ATTRIBUTE_RESET = "SET_ATTRIBUTE_RESET",
  ANNOTATIONS_SELECTOR = "ANNOTATIONS_SELECTOR",
  ANNOTATIONS_ENABLE = "ANNOTATIONS_ENABLE",
  ANNOTATIONS_UPDATE = "ANNOTATIONS_UPDATE",
  MEDIADATA_UPDATED = "MEDIADATA_UPDATED",
  MEDIADATA_RESETED = "MEDIADATA_RESETED",
  MANAGER_OPEN = "MANAGER_OPEN",
  SEARCH_ATTRIBUTE_OPEN = "SEARCH_ATTRIBUTE_OPEN",
  SEARCH_ATTRIBUTE_VALUE = "SEARCH_ATTRIBUTE_VALUE",
}

interface IReducerState {
  assetdataDirty;
  assetDatas: IProduct[];
  assetdataFetching: boolean;
  selectedCatalog: string;
  selectedLanguages: string[];
  editingSaveRequest: boolean;
  editingSaveProcess: boolean;
  editingConflict: boolean;
  editingVersions: { id: string; version: number }[];
  editingProcessed: boolean;
  editingMaxSelected: boolean;
  showDialogUnsaved: boolean;
  showDialogConflict: boolean;
  showDialogDictionary: IDialogDictionary;
  showDialogCategory: IDialogCategory;
  toReadyAttribute: IAttributeSelector;
  toResetAttribute: IAttributeSelector;
  annotationsSelector: PointSelector;
  annotationsEnabled: boolean;
  mediaData: IMediaInfo;
  searchAttributeOpen: boolean;
  searchAttributeValue: string;
  managerAttributesOpen: boolean;
}

export const initState: IReducerState = {
  assetdataDirty: {},
  assetDatas: [],
  assetdataFetching: false,
  selectedCatalog: "",
  selectedLanguages: [],
  editingSaveRequest: false,
  editingSaveProcess: false,
  editingConflict: false,
  editingVersions: [],
  editingProcessed: false,
  editingMaxSelected: false,
  showDialogUnsaved: false,
  showDialogConflict: false,
  showDialogDictionary: {
    open: false,
    attributeKey: "",
    attributeId: "",
    label: "",
    catalogId: "",
    multiSelectable: false,
    dictionaryId: "",
    dictionaryType: null,
  },
  showDialogCategory: {
    open: false,
    attributeKey: "",
    attributeId: "",
    label: "",
    catalogId: "",
  },
  toReadyAttribute: null,
  toResetAttribute: null,
  annotationsSelector: PointSelector.TYPE,
  annotationsEnabled: false,
  mediaData: null,
  searchAttributeOpen: false,
  searchAttributeValue: "",
  managerAttributesOpen: false,
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = {
    ...state,
    assetdataDirty: { ...state.assetdataDirty },
  };

  switch (action.type) {
    case ACT_DETAIL.SELECT_LANGUAG: {
      const { languageId } = action;
      const newLangs = Array.from(newState.selectedLanguages);
      const indexToRemove = newLangs.findIndex((i) => i === languageId);
      if (indexToRemove === -1) {
        newLangs.push(languageId);
      } else {
        newLangs.splice(indexToRemove, 1);
      }
      newState.selectedLanguages = newLangs;
      return newState;
    }
    case ACT_DETAIL.SELECT_LANGUAG_ALL:
      newState.selectedLanguages = !!newState.selectedLanguages.length
        ? []
        : action.languages;
      return newState;
    case ACT_DETAIL.SELECT_CATALOG:
      newState.selectedCatalog = action.catalog.id;
      newState.selectedLanguages = action.catalog.languages;
      return newState;
    case ACT_DETAIL.SHOW_DIALOG_CONFLICT:
      newState.showDialogConflict = action.value;
      newState.editingConflict = true;
      newState.editingSaveRequest = false;
      newState.editingSaveProcess = false;
      return newState;
    case ACT_DETAIL.SHOW_DIALOG_UNSAVED:
      newState.showDialogUnsaved = action.value;
      return newState;
    case ACT_DETAIL.SHOW_DIALOG_DICTIONARY:
      newState.showDialogDictionary = {
        ...initState.showDialogDictionary,
        ...action.data,
      };
      return newState;
    case ACT_DETAIL.SHOW_DIALOG_CATEGORY:
      newState.showDialogCategory = {
        ...initState.showDialogCategory,
        ...action.data,
      };
      return newState;
    case ACT_DETAIL.EDITING_SAVE_STARTED:
      newState.editingSaveRequest = true;
      return newState;
    case ACT_DETAIL.EDITING_SAVE_PROCESS:
      newState.editingSaveProcess = true;
      return newState;
    case ACT_DETAIL.EDITING_SAVE_STOPPED:
      newState.assetdataDirty = initState.assetdataDirty;
      newState.editingSaveRequest = false;
      newState.editingSaveProcess = false;
      newState.editingProcessed = newState.assetDatas.length > 1;
      return newState;
    case ACT_DETAIL.ASSETDATAS_FETCHED:
      newState.assetdataFetching = true;
      return newState;
    case ACT_DETAIL.EDITING_MAX_SELECTED:
      newState.assetdataFetching = false;
      newState.editingMaxSelected = true;
      return newState;
    case ACT_DETAIL.ASSETDATAS_UPDATED: {
      const assetDatas: IProduct[] = action.assetDatas;
      const catalogs: ICatalog[] = action.catalogs;
      const sameIds =
        newState.assetDatas.length === assetDatas.length &&
        intersectionBy(newState.assetDatas, assetDatas, (a) => a.id).length ===
          assetDatas.length;

      const notDirty = Object.keys(newState.assetdataDirty).length === 0;
      // il blocco di "if" avviene alla fine della sessione di editing per un dato utente (newState.saveRequest && sameIds)
      // oppure per gli altri utenti che non hanno editato alcun campo (notDirty)
      if ((newState.editingSaveRequest && sameIds) || notDirty) {
        newState.assetDatas = assetDatas;
        newState.assetdataDirty = initState.assetdataDirty;
        newState.editingVersions = initState.editingVersions;
        newState.editingSaveRequest = initState.editingSaveRequest;
        newState.editingSaveProcess = initState.editingSaveProcess;
        newState.searchAttributeOpen = initState.searchAttributeOpen;
        newState.searchAttributeValue = initState.searchAttributeValue;
      } else {
        newState.editingConflict = true;
      }

      if (!sameIds) {
        const catalogsId = assetDatas
          .map((data) => {
            return data[KEY_CATALOG] || [];
          })
          .reduce((acc: string[], newCatalogs: string[]) => {
            const allCatalogs = new Set(acc);
            newCatalogs.forEach((catId) => {
              if (!allCatalogs.has(catId)) acc.push(catId);
            });
            return acc;
          }, [])
          .sort();

        if (!!catalogsId.length) {
          const catalogId = catalogsId[0];
          const catalog = catalogs.find((c) => c.id === catalogId);

          newState.selectedCatalog = catalogId;
          newState.selectedLanguages = catalog.languages;
        } else {
          newState.selectedCatalog = initState.selectedCatalog;
          newState.selectedLanguages = initState.selectedLanguages;
        }

        newState.managerAttributesOpen = false;
      }

      newState.assetdataFetching = false;
      newState.editingMaxSelected = false;

      return newState;
    }
    case ACT_DETAIL.EDITING_DISCARDED:
      newState.showDialogUnsaved = false;
      newState.assetdataDirty = {};
      newState.editingConflict = false;
      newState.editingSaveRequest = false;
      newState.editingSaveProcess = false;
      newState.editingVersions = [];
      return newState;
    case ACT_DETAIL.EDITING_KEY_VALUE:
      newState.assetdataDirty = getAssetdataDirty({
        attributeKey: action.attributeKey,
        attributeValue: action.attributeValue,
        assetDatas: newState.assetDatas,
        assetdataDirty: newState.assetdataDirty,
      });
      newState.showDialogCategory = initState.showDialogCategory;
      newState.showDialogDictionary = initState.showDialogDictionary;
      return newState;
    case ACT_DETAIL.EDITING_KEY_CLEAN:
      newState.assetdataDirty = {
        ...newState.assetdataDirty,
        [action.attributeKey]: undefined,
      };
      newState.showDialogCategory = initState.showDialogCategory;
      newState.showDialogDictionary = initState.showDialogDictionary;
      return newState;
    case ACT_DETAIL.SET_VERSION:
      newState.editingVersions = action.versions;
      return newState;
    case ACT_DETAIL.SET_ATTRIBUTE_READY:
      newState.toReadyAttribute = action.selector || initState.toReadyAttribute;
      return newState;
    case ACT_DETAIL.SET_ATTRIBUTE_RESET:
      newState.toResetAttribute = action.selector || initState.toResetAttribute;
      return newState;
    case ACT_DETAIL.ANNOTATIONS_SELECTOR:
      newState.annotationsSelector = action.payload;
      return newState;
    case ACT_DETAIL.ANNOTATIONS_ENABLE:
      newState.annotationsEnabled = action.payload;
      if (!action.payload) newState.annotationsSelector = PointSelector.TYPE;
      return newState;
    case ACT_DETAIL.ANNOTATIONS_UPDATE:
      const { annotations, fileId, itemId, fileIdResolved } = action;
      const item = newState.assetDatas.find((item) => item.id === itemId);
      const media = item.media.find((m) => m.fileId === fileId);
      media.annotations = annotations;
      media.annotationsResolved = undefined;

      if (fileIdResolved.length) {
        fileIdResolved.forEach(({ fileId, resolved }) => {
          const mediaAnnotated = item.media.find((m) => m.fileId === fileId);
          if (mediaAnnotated) mediaAnnotated.annotationsResolved = resolved;
        });
      }
      return newState;
    case ACT_DETAIL.MEDIADATA_UPDATED:
      newState.mediaData = action.payload;
      return newState;
    case ACT_DETAIL.MEDIADATA_RESETED:
      newState.mediaData = initState.mediaData;
      return newState;
    case ACT_DETAIL.MANAGER_OPEN:
      newState.managerAttributesOpen = action.value;
      return newState;
    case ACT_DETAIL.SEARCH_ATTRIBUTE_OPEN:
      newState.searchAttributeOpen = action.value;
      if (action.value === false) {
        newState.searchAttributeValue = initState.searchAttributeValue;
      }
      return newState;
    case ACT_DETAIL.SEARCH_ATTRIBUTE_VALUE:
      newState.searchAttributeValue = action.value;
      return newState;
    case ACT_DETAIL.RESET:
      return initState;
    default: {
      console.error(`action ${action.type} not handled`);
      return state;
    }
  }
};

export default reducer;
