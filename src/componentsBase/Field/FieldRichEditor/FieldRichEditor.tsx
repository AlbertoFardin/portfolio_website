import * as React from "react";
import * as Immutable from "immutable";
import {
  Editor,
  EditorState,
  RichUtils,
  DefaultDraftBlockRenderMap,
  DraftEditorCommand,
  DraftHandleValue,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import Blockquote from "./components/Blockquote";
import CodeBlock from "./components/CodeBlock";
import Toolbar from "./components/Toolbar";
import useStyles from "./useStyles";
import { reducer, reducerInitState, ACT_FIELD } from "./reducer";
import { emptyFn } from "../../utils/common";
import { getLabels } from "../Label";
import classnames from "classnames";
import BtnMenu from "../utils/BtnMenu";
import {
  EMPTY_TAG,
  getContentStateFromFragmentHtmlString,
  getHtmlStringFromContentState,
} from "./utils";
import IFieldRichEditor from "./IFieldRichEditor";
import { WIDTH_TOOLBAR } from "./constants";
import "draft-js/dist/Draft.css";
import Btn from "../../Btn";

const blockRenderMap = Immutable.Map({
  blockquote: {
    element: "blockquote",
    wrapper: <Blockquote />,
  },
  "code-block": {
    element: "pre",
    wrapper: <CodeBlock />,
  },
});

function getEditorState({ valueRawMuiEditor }: { valueRawMuiEditor }) {
  return valueRawMuiEditor
    ? EditorState.createWithContent(
        convertFromRaw(JSON.parse(valueRawMuiEditor))
      )
    : EditorState.createEmpty();
}

export const controls = [
  "title",
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "numberList",
  "bulletList",
  "clear",
  "undo",
  "redo",
];

const PADDING_TOOLBAR = 10;

const FieldRichEditor = ({
  value = EMPTY_TAG,
  onChange = emptyFn,
  onBlur = emptyFn,
  onFocus = emptyFn,
  readOnly = false,
  draftEditorProps,
  className,
  style,
  label,
  adornmentIcon,
  adornmentIconTooltip,
  adornmentIconColor,
  adornmentAvatar,
  adornmentAvatarTooltip,
  adornmentElement,
  menuDisabled = false,
  menuOnHover = true,
  menuOnClose = emptyFn,
  menu = [],
  placeholder = "Write...",
  toolbarPosition = "left",
}: IFieldRichEditor) => {
  const ref = React.useRef(null);
  const contentState = React.useMemo(
    () => getContentStateFromFragmentHtmlString(value),
    [value]
  );
  const valueRawMuiEditor = React.useMemo(() => {
    const result = JSON.stringify(convertToRaw(contentState));
    return result;
  }, [contentState]);
  const [state, dispatch] = React.useReducer(reducer, reducerInitState);
  const {
    focus,
    mouseOverToolbar,
    editorState,
    inputHover,
    tbarDefaultPosition,
    toolbarVisible,
    activeBtnToolbar,
    width,
  } = state;

  const hasText = !!editorState && editorState.getCurrentContent().hasText();
  const classes = useStyles({
    width,
    inputHide: !!adornmentElement,
    readOnly,
    hasText,
    hasIcon: !!adornmentIcon,
    hasAvatar: !!adornmentAvatar,
  });

  // contentRef serve per calcolare la posizione iniziale della finestra
  // con la toolbar
  const contentRef = React.useRef(null);

  // focusRef è usata per discriminare se la callback onChange
  // è triggerata o meno (vd onChange ed effetto)
  const focusRef = React.useRef(false);

  const onLeave = React.useCallback(() => {
    dispatch({
      type: ACT_FIELD.SET_INPUT_HOVER,
      inputHover: false,
    });
  }, []);
  const onEnter = React.useCallback(() => {
    dispatch({
      type: ACT_FIELD.SET_INPUT_HOVER,
      inputHover: true,
    });
  }, []);
  const onClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault();
      ref.current.focus();
    },
    []
  );
  const onCloseMenu = React.useCallback(() => {
    dispatch({ type: ACT_FIELD.CLOSE_MENU });
    menuOnClose();
  }, [menuOnClose]);
  const onMouseEnterBtnOpenToolbar = React.useCallback(() => {
    dispatch({
      type: ACT_FIELD.SET_ACTIVE_BTN_TOOLBAR,
      activeBtnToolbar: true,
    });
  }, []);
  const onMouseLeaveBtnOpenToolbar = React.useCallback(() => {
    dispatch({
      type: ACT_FIELD.SET_ACTIVE_BTN_TOOLBAR,
      activeBtnToolbar: false,
    });
  }, []);
  const handleChange = React.useCallback((state: EditorState) => {
    dispatch({
      type: ACT_FIELD.SET_ON_CHANGE,
      editorState: state,
    });
  }, []);
  const handleEditorFocus = React.useCallback(() => {
    if (!readOnly) {
      const nextEditorState = EditorState.forceSelection(
        editorState,
        editorState.getSelection()
      );
      dispatch({
        type: ACT_FIELD.SET_FOCUS,
        focus: true,
        editorState: EditorState.moveFocusToEnd(nextEditorState),
      });
      onFocus();
      focusRef.current = true;
    }
  }, [editorState, onFocus, readOnly]);
  const handleBlur = React.useCallback(() => {
    if (!activeBtnToolbar && !mouseOverToolbar && !readOnly) {
      dispatch({
        type: ACT_FIELD.SET_ON_BLUR,
      });
      onBlur();
      focusRef.current = false;
    }
  }, [activeBtnToolbar, mouseOverToolbar, readOnly, onBlur]);
  const handleKeyCommand = React.useCallback(
    (
      command: DraftEditorCommand | string,
      editorState: EditorState
    ): DraftHandleValue => {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        handleChange(newState);
        return "handled";
      }
      return "not-handled";
    },
    [handleChange]
  );
  const handleToolbarClick = React.useCallback(
    (style: string, type: string) => {
      if (type === "inline") {
        dispatch({ type: ACT_FIELD.TOGGLE_IN_LINE_STYLE, style });
        return;
      }
      if (type === "block") {
        dispatch({ type: ACT_FIELD.TOGGLE_BLOCK_TYPE, style });
        return;
      }

      switch (style) {
        case "UNDO":
          dispatch({ type: ACT_FIELD.SET_UNDO });
          break;
        case "REDO":
          dispatch({ type: ACT_FIELD.SET_REDO });
          break;
        default:
          break;
      }
    },
    []
  );
  const blockRenderer = React.useCallback(() => {
    return null;
  }, []);
  const onMouseEnterInToolbar = React.useCallback(() => {
    dispatch({
      type: ACT_FIELD.SET_MOUSE_OVER_TOOLBAR,
      mouseOverToolbar: true,
    });
  }, []);
  const onMouseLeaveFromToolbar = React.useCallback(() => {
    dispatch({
      type: ACT_FIELD.SET_MOUSE_OVER_TOOLBAR,
      mouseOverToolbar: false,
    });
  }, []);
  const hideToolbar = React.useCallback(() => {
    dispatch({ type: ACT_FIELD.SHOW_TOOLBAR, toolbarVisible: false });
    ref.current.focus();
  }, []);
  const toogleShowToolbar = React.useCallback(
    (event: React.MouseEvent<Element, MouseEvent>) => {
      event.preventDefault();
      event.stopPropagation();
      dispatch({
        type: ACT_FIELD.SHOW_TOOLBAR,
        toolbarVisible: !toolbarVisible,
      });
      ref.current.focus();
    },
    [toolbarVisible]
  );

  // initialize editorstate
  React.useEffect(() => {
    if (editorState === null) {
      dispatch({
        type: ACT_FIELD.SET_ON_CHANGE,
        editorState: getEditorState({ valueRawMuiEditor }),
      });
    }
  }, [editorState, valueRawMuiEditor]);

  // initialize width
  React.useEffect(() => {
    if (editorState && width === 0) {
      dispatch({
        type: ACT_FIELD.SET_WIDTH,
        width: contentRef.current.getBoundingClientRect().width,
      });
    }
  }, [editorState, width]);

  React.useEffect(() => {
    const e = editorState as EditorState;
    if (focusRef.current && !!e) {
      const v = getHtmlStringFromContentState(e.getCurrentContent());
      if (v !== value) {
        onChange(v);
        ref.current.focus();
      }
    }
  }, [editorState, onChange, value]);

  React.useEffect(() => {
    if (!focusRef.current) {
      const editorState = EditorState.createWithContent(
        convertFromRaw(JSON.parse(valueRawMuiEditor))
      );
      handleChange(editorState);
    }
  }, [valueRawMuiEditor, handleChange]);

  // effetto per inizializzare la posizione iniziale della toolbar
  React.useEffect(() => {
    if (contentRef && contentRef.current && toolbarVisible) {
      const { top, width, left } = contentRef.current.getBoundingClientRect();
      //  posizione a sinistra
      let tbarDefaultPosition = { left: 0, top: 0 };
      switch (toolbarPosition) {
        case "left":
          {
            tbarDefaultPosition = {
              left: left - WIDTH_TOOLBAR - PADDING_TOOLBAR,
              top,
            };
          }
          break;
        case "right":
          {
            tbarDefaultPosition = { left: left + width + PADDING_TOOLBAR, top };
          }
          break;
        default:
          throw "Value not handled for toolbarPosition";
      }

      dispatch({
        type: ACT_FIELD.SET_TOOLBAR_DEFAULT_POSITION,
        tbarDefaultPosition,
      });
    }
  }, [toolbarPosition, toolbarVisible]);

  if (!editorState) return null;

  return (
    <div
      className={classnames({
        [classes.field]: true,
        [classes.fieldReadonly]: readOnly,
        [className]: !!className,
      })}
      style={style}
      onMouseOver={onEnter}
      onMouseLeave={onLeave}
      onFocus={emptyFn}
      ref={contentRef}
    >
      {readOnly ? (
        <div
          role="presentation"
          onClick={onClick}
          className={classes.divNotFocus}
        />
      ) : null}
      {getLabels(label, readOnly)}
      {!adornmentIcon ? null : (
        <Btn
          disabled
          className={classes.adornmentIcon}
          icon={adornmentIcon}
          iconStyle={{ color: adornmentIconColor }}
          tooltip={adornmentIconTooltip}
        />
      )}
      {!adornmentAvatar ? null : (
        <Btn
          disabled
          className={classes.adornmentAvatar}
          avatar={adornmentAvatar}
          tooltip={adornmentAvatarTooltip}
        />
      )}
      {!adornmentElement ? null : (
        <div className={classes.adornmentElement} children={adornmentElement} />
      )}

      <div
        role="presentation"
        onClick={onClick}
        className={classes.divMuiRichEditor}
      >
        {toolbarVisible ? (
          <Toolbar
            editorState={editorState}
            onClick={handleToolbarClick}
            controls={controls}
            disabled={readOnly}
            isActive={focus}
            onMouseEnter={onMouseEnterInToolbar}
            onMouseLeave={onMouseLeaveFromToolbar}
            onClose={hideToolbar}
            defaultPosition={tbarDefaultPosition}
          />
        ) : null}
        <div className={classes.container}>
          <Editor
            blockRenderMap={DefaultDraftBlockRenderMap.merge(blockRenderMap)}
            blockRendererFn={blockRenderer}
            editorState={editorState}
            onChange={handleChange}
            onFocus={handleEditorFocus}
            onBlur={handleBlur}
            readOnly={readOnly}
            handleKeyCommand={handleKeyCommand}
            ref={ref}
            placeholder={readOnly && !hasText ? "No value" : placeholder}
            {...draftEditorProps}
          />
        </div>
      </div>
      {!!adornmentElement ? null : (
        <BtnMenu
          onClose={onCloseMenu}
          inputHover={inputHover}
          readOnly={readOnly}
          items={menu}
          disabled={menuDisabled}
          visibleOnHover={menuOnHover}
        />
      )}
      {focus ? (
        <Btn
          className={classes.btnShowToolbar}
          icon="text_fields"
          selected={toolbarVisible}
          onClick={toogleShowToolbar}
          onMouseEnter={onMouseEnterBtnOpenToolbar}
          onMouseLeave={onMouseLeaveBtnOpenToolbar}
        />
      ) : null}
    </div>
  );
};

export default FieldRichEditor;
