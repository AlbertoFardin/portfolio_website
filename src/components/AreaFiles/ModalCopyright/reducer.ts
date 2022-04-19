import { ICopyright, IFileDetail } from "../../../interfaces";
import isEqual from "lodash-es/isEqual";
import { DIFFERENT_VALUES } from "../constants";

export enum ACT_MODAL {
  RESET = "RESET",
  FETCH_SAVE = "FETCH_SAVE",
  FETCH_DATA = "FETCH_DATA",
  CHANGE_VALUE = "CHANGE_DATA",
}

interface IReducerState {
  copyrightSaved: ICopyright;
  copyrightDirty: ICopyright;
  fetchingData: boolean;
  fetchingSave: boolean;
}

export const reducerInitState: IReducerState = {
  copyrightSaved: null,
  copyrightDirty: {},
  fetchingData: true,
  fetchingSave: false,
};

const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACT_MODAL.CHANGE_VALUE: {
      const { id, value } = action;
      const { copyrightDirty, copyrightSaved } = newState;

      if (isEqual(copyrightDirty[id], copyrightSaved[id])) {
        delete newState.copyrightDirty[id];
      } else {
        newState.copyrightDirty = {
          ...copyrightDirty,
          [id]: value,
        };
      }

      return newState;
    }
    case ACT_MODAL.FETCH_SAVE:
      newState.fetchingSave = true;
      return newState;
    case ACT_MODAL.FETCH_DATA: {
      const datasCopyright: ICopyright[] = (action.value as IFileDetail[]).map(
        (a) => a.copyright
      );

      newState.fetchingData = false;
      newState.copyrightSaved = datasCopyright[0];

      if (datasCopyright.length > 1) {
        datasCopyright.forEach((data) => {
          Object.keys(data).map((key) => {
            const value0 = newState.copyrightSaved[key];
            const value1 = data[key];
            if (!isEqual(value0, value1))
              newState.copyrightSaved[key] = DIFFERENT_VALUES;
          });
        });
      }

      return newState;
    }
    case ACT_MODAL.RESET:
      return reducerInitState;
    default:
      return state;
  }
};

export default reducer;
