export enum ACT_MAINBAR {
  MENU_SECTIONS = "MENU_SECTIONS",
  MENU_USER = "MENU_USER",
  MODAL_LOGOUT = "MODAL_LOGOUT",
  RESET = "RESET",
  NYAN = "NYAN",
}

export interface IReducerState {
  menuSections: boolean;
  menuUser: boolean;
  modalLogout: boolean;
  nyan: boolean;
}

export const reducerInitState = {
  menuSections: false,
  menuUser: false,
  modalLogout: false,
  nyan: false,
};

export const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACT_MAINBAR.MENU_SECTIONS:
      newState.menuSections = !newState.menuSections;
      return newState;
    case ACT_MAINBAR.MENU_USER:
      newState.menuUser = !newState.menuUser;
      return newState;
    case ACT_MAINBAR.MODAL_LOGOUT:
      newState.menuUser = false;
      newState.modalLogout = !newState.modalLogout;
      return newState;
    case ACT_MAINBAR.NYAN:
      newState.nyan = !newState.nyan;
      return newState;
    case ACT_MAINBAR.RESET:
      return reducerInitState;
    default:
      return state;
  }
};
