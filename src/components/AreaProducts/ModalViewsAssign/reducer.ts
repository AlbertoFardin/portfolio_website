export enum ACTION_CLICKED {
  ASSIGN = "ADD",
  REMOVE = "REMOVE",
  NONE = "NONE",
}

export enum ACTION {
  RESET = "RESET",
  CHANGE_VIEWS = "CHANGE_VIEWS",
  CHANGE_ASSIGNEES = "CHANGE_ASSIGNEES",
  CLICK_ASSIGN = "SAVE_CLICK",
  CLICK_REMOVE = "CLICK_REMOVE",
  SAVING = "SAVING",
  SAVE_STOP = "SAVING_STOP",
}

interface IReducerState {
  selectedAssigneesId: string[];
  selectedViewsId: string[];
  actionClicked: ACTION_CLICKED;
  saving: boolean;
}

export const reducerInitState = {
  selectedAssigneesId: [],
  selectedViewsId: [],
  actionClicked: ACTION_CLICKED.NONE,
  saving: false,
};

const reducer = (state: IReducerState, action) => {
  const newState = { ...state };
  switch (action.type) {
    case ACTION.CHANGE_ASSIGNEES:
      newState.selectedAssigneesId = action.selectedIds;
      return newState;
    case ACTION.CHANGE_VIEWS:
      newState.selectedViewsId = action.selectedIds;
      return newState;
    case ACTION.CLICK_ASSIGN:
      newState.actionClicked = ACTION_CLICKED.ASSIGN;
      return newState;
    case ACTION.CLICK_REMOVE:
      newState.actionClicked = ACTION_CLICKED.REMOVE;
      return newState;
    case ACTION.SAVING:
      newState.saving = true;
      return newState;
    case ACTION.SAVE_STOP:
      newState.actionClicked = ACTION_CLICKED.NONE;
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
