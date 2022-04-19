import { IProduct, IColumnSc, MediaType, Category } from "../../../interfaces";

interface ISelectItem {
  id: string;
  label: string;
  selected: boolean;
}

export enum STATUS_DOWNLOAD {
  TO_START = "TO_START",
  STARTED = "STARTED",
  STOPPED = "STOPPED",
}

export enum ACTION {
  START = "START",
  RESET = "RESET",
  SET_VALUES = "SET_VALUES",
  SET_STATUS = "SET_STATUS",
}

export enum FIELD_IDS {
  selectFilesNames = "selectFilesNames",
  selectMediaTypes = "selectMediaTypes",
  selectCategories = "selectCategories",
  checkPostproduct = "checkPostproduct",
  checkLastupload = "checkLastupload",
}

export const initialState = {
  loading: true,
  items: [],
  statusDownload: STATUS_DOWNLOAD.STOPPED,
  [FIELD_IDS.selectFilesNames]: [
    { id: "", label: "Upload name", selected: true },
  ],
  [FIELD_IDS.selectMediaTypes]: [
    {
      id: MediaType.IMAGE_S,
      label: "Shooting",
      selected: false,
    },
    {
      id: MediaType.IMAGE_P,
      label: "Post production",
      selected: false,
    },
    {
      id: MediaType.VIDEO,
      label: "Video",
      selected: false,
    },
  ],
  [FIELD_IDS.selectCategories]: [
    {
      id: Category.DEFAULT,
      label: Category.DEFAULT,
      selected: false,
    },
    {
      id: Category.STILL_LIFE,
      label: Category.STILL_LIFE,
      selected: false,
    },
    {
      id: Category.WORN,
      label: Category.WORN,
      selected: false,
    },
  ],
  [FIELD_IDS.checkPostproduct]: false,
  [FIELD_IDS.checkLastupload]: false,
};

interface IReducerState {
  loading: boolean;
  items: IProduct[];
  statusDownload: STATUS_DOWNLOAD;
  [FIELD_IDS.selectFilesNames]: ISelectItem[];
  [FIELD_IDS.selectMediaTypes]: ISelectItem[];
  [FIELD_IDS.selectCategories]: ISelectItem[];
  [FIELD_IDS.checkPostproduct]: boolean;
  [FIELD_IDS.checkLastupload]: boolean;
}

export const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACTION.START:
      newState.loading = false;
      newState.items = action.items;
      newState[FIELD_IDS.selectFilesNames] = action.mediaNameIds.reduce(
        (acc, id) => {
          const column = action.columns.find(
            (c: IColumnSc) => c.attributeStructureId === id
          );
          acc.push({
            id,
            label: column ? column.label : id,
            selected: false,
          });
          return acc;
        },
        Array.from(newState[FIELD_IDS.selectFilesNames])
      );
      return newState;
    case ACTION.SET_VALUES:
      newState[action.id] = action.value;
      return newState;
    case ACTION.SET_STATUS:
      newState.statusDownload = action.status;
      return newState;
    case ACTION.RESET:
      return initialState;
    default:
      console.warn("ModalMultiDownload", action);
      return newState;
  }
};
