export enum ACTION {
  MANAGER_TOGGLE = "MANAGER_TOGGLE",
  PANEL_TOGGLE = "PANEL_TOGGLE",
  SET_POSITION_BUTTON_FILTER = "SET_POSITION_BUTTON_FILTER",
}

interface IReducerState {
  managerOpen: boolean;
  btnFilterPosition: { left: number; top: number };
}

export const reducerInitState = {
  managerOpen: false,
  btnFilterPosition: { left: 0, top: 0 },
};

export const reducer = (state: IReducerState, action): IReducerState => {
  const newState = { ...state };
  switch (action.type) {
    case ACTION.MANAGER_TOGGLE:
      newState.managerOpen = !newState.managerOpen;
      return newState;
    case ACTION.SET_POSITION_BUTTON_FILTER:
      newState.btnFilterPosition = action.btnFilterPosition;
      return newState;
    default:
      return state;
  }
};
