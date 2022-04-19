/* eslint-disable @typescript-eslint/no-explicit-any */

export enum ACTIONS {
  RESET = "RESET",
  SET_TENANT = "SET_TENANT",
  SET_PASSWORD = "SET_PASSWORD",
  SET_USERNAME = "SET_USERNAME",
  SET_LOADING = "SET_LOADING",
  SET_INVALID_CREDENTIAL = "SET_INVALID_CREDENTIAL",
}

export interface IReducerState {
  loading: boolean;
  snackbar: string;
  i18n?: { [k: string]: string };
  username: string;
  password: string;
  tenant: string;
  invalidCredential: boolean;
}

export const reducerInitState: IReducerState = {
  loading: false,
  snackbar: "",
  username: "",
  password: "",
  tenant: "",
  invalidCredential: false,
};

export const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      newState.loading = true;
      return newState;
    case ACTIONS.SET_USERNAME:
      if (newState.username !== action.value) {
        newState.username = action.value;
        newState.invalidCredential = false;
      }
      if (newState.username && action.check) {
        newState.loading = true;
      }
      return newState;
    case ACTIONS.SET_PASSWORD:
      newState.password = action.value;
      newState.invalidCredential = false;
      return newState;
    case ACTIONS.SET_TENANT:
      newState.tenant = action.value;
      newState.invalidCredential = false;
      return newState;
    case ACTIONS.RESET:
      return { ...newState, ...reducerInitState };
    case ACTIONS.SET_INVALID_CREDENTIAL:
      return { ...newState, invalidCredential: true, loading: false };
    default:
      return newState;
  }
};
