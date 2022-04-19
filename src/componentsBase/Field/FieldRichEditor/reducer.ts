import { EditorState, RichUtils } from "draft-js";
import { TUrlData } from "./interfaces";

export enum ACT_FIELD {
  "SET_FOCUS" = "SET_FOCUS",
  "SET_MOUSE_OVER_TOOLBAR" = "SET_MOUSE_OVER_TOOLBAR",
  "SET_INPUT_HOVER" = "SET_INPUT_HOVER",
  "CLOSE_MENU" = "CLOSE_MENU",
  "SET_ON_CHANGE" = "SET_ON_CHANGE",
  "SET_TOOLBAR_DEFAULT_POSITION" = "SET_TOOLBAR_DEFAULT_POSITION",
  "SHOW_TOOLBAR" = "SHOW_TOOLBAR",
  "SET_ACTIVE_BTN_TOOLBAR" = "SET_ACTIVE_BTN_TOOLBAR",
  "SET_ON_BLUR" = "SET_ON_BLUR",
  "SET_UNDO" = "SET_UNDO",
  "SET_REDO" = "SET_REDO",
  "TOGGLE_IN_LINE_STYLE" = "TOGGLE_IN_LINE_STYLE",
  "TOGGLE_BLOCK_TYPE" = "TOGGLE_BLOCK_TYPE",
  "SET_WIDTH" = "SET_WIDTH",
}

export interface IReducerState {
  anchorUrlPopover?: HTMLElement;
  urlKey?: string;
  urlData?: TUrlData;
  urlIsMedia?: boolean;
  focus: boolean;
  searchTerm: string;
  selectedIndex: number;
  focusMediaKey: string;
  mouseOverToolbar: boolean;
  editorState?: EditorState;
  inputHover: boolean;
  tbarDefaultPosition: { left: number; top: number };
  toolbarVisible: boolean;
  activeBtnToolbar: boolean;
  width: number;
}

export const reducerInitState: IReducerState = {
  focus: false,
  searchTerm: "",
  selectedIndex: 0,
  focusMediaKey: "",
  mouseOverToolbar: false,
  editorState: null,
  inputHover: false,
  tbarDefaultPosition: { left: 0, top: 0 },
  toolbarVisible: false,
  activeBtnToolbar: false,
  width: 0,
};

export const reducer = (state: IReducerState, action): IReducerState => {
  switch (action.type) {
    case ACT_FIELD.SET_FOCUS: {
      const { focus, editorState } = action;
      return {
        ...state,
        editorState,
        focus,
      };
    }
    case ACT_FIELD.SET_MOUSE_OVER_TOOLBAR: {
      const { mouseOverToolbar } = action;
      return {
        ...state,
        mouseOverToolbar,
      };
    }
    case ACT_FIELD.SET_INPUT_HOVER: {
      const { inputHover } = action;
      return {
        ...state,
        inputHover,
      };
    }
    case ACT_FIELD.CLOSE_MENU: {
      return {
        ...state,
        inputHover: false,
        focus: false,
      };
    }
    case ACT_FIELD.SET_ON_CHANGE: {
      const { editorState }: { editorState: EditorState } = action;
      return {
        ...state,
        editorState,
      };
    }
    case ACT_FIELD.SET_TOOLBAR_DEFAULT_POSITION: {
      const { tbarDefaultPosition } = action;
      return {
        ...state,
        tbarDefaultPosition,
      };
    }
    case ACT_FIELD.SET_WIDTH: {
      const { width } = action;
      return {
        ...state,
        width,
      };
    }
    case ACT_FIELD.SHOW_TOOLBAR: {
      const { toolbarVisible } = action;
      return {
        ...state,
        toolbarVisible,
      };
    }
    case ACT_FIELD.SET_ACTIVE_BTN_TOOLBAR: {
      const { activeBtnToolbar } = action;
      return {
        ...state,
        activeBtnToolbar,
      };
    }
    case ACT_FIELD.SET_ON_BLUR: {
      return {
        ...state,
        focus: false,
        toolbarVisible: false,
      };
    }
    case ACT_FIELD.SET_UNDO: {
      return {
        ...state,
        editorState: EditorState.undo(state.editorState),
      };
    }
    case ACT_FIELD.SET_REDO: {
      return {
        ...state,
        editorState: EditorState.redo(state.editorState),
      };
    }
    case ACT_FIELD.TOGGLE_IN_LINE_STYLE: {
      return {
        ...state,
        editorState: RichUtils.toggleInlineStyle(
          state.editorState,
          action.style
        ),
      };
    }
    case ACT_FIELD.TOGGLE_BLOCK_TYPE: {
      return {
        ...state,
        editorState: RichUtils.toggleBlockType(state.editorState, action.style),
      };
    }
    default: {
      throw new Error();
    }
  }
};
