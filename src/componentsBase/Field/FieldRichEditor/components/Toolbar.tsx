import * as React from "react";
import MUIToolbar from "@material-ui/core/Toolbar";
import { EditorState } from "draft-js";
import Draggable from "react-draggable";
import classnames from "classnames";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import Btn from "../../../Btn/Btn";
import { WIDTH_TOOLBAR } from "../constants";
import Divider from "@material-ui/core/Divider";
import Portal from "@material-ui/core/Portal";
import { v4 as uuidv4 } from "uuid";
import ToolbarButton from "./ToolbarButton";
import { ZINDEX_DRAGGABLED } from "../../../utils/zIndex";

export type TToolbarControl =
  | "title"
  | "bold"
  | "italic"
  | "underline"
  | "link"
  | "numberList"
  | "bulletList"
  | "quote"
  | "code"
  | "clear"
  | "save"
  | "media"
  | "strikethrough"
  | "highlight"
  | string;

export type TControlType = "inline" | "block" | "callback" | "atomic";

export type TToolbarButtonSize = "small" | "medium";

export type TToolbarComponentProps = {
  id: string;
  onMouseDown: (e: React.MouseEvent) => void;
  active: boolean;
  disabled: boolean;
};

export type TCustomControl = {
  id?: string;
  name: string;
  icon?: JSX.Element;
  type: TControlType;
  component?: React.FunctionComponent<TToolbarComponentProps>;
  inlineStyle?: React.CSSProperties;
  blockWrapper?: React.ReactElement;
  atomicComponent?: React.FunctionComponent;
  onClick?: (
    editorState: EditorState,
    name: string,
    anchor: HTMLElement | null
  ) => EditorState | void;
};

type TStyleType = {
  id?: string;
  name: TToolbarControl | string;
  label: string;
  style: string;
  icon?: string;
  component?: React.FunctionComponent<TToolbarComponentProps>;
  type: TControlType;
  active?: boolean;
  clickFnName?: string;
};

interface TToolbarProps {
  editorState: EditorState;
  controls?: Array<TToolbarControl>;
  customControls?: TCustomControl[];
  onClick: (
    style: string,
    type: string,
    id: string,
    inlineMode?: boolean
  ) => void;
  inlineMode?: boolean;
  className?: string;
  disabled?: boolean;
  size?: TToolbarButtonSize;
  isActive: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClose?: () => void;
  defaultPosition?: { left: number; top: number };
}

const dragCls = `draftjstoolbar_drag_${uuidv4()}`;

const useStyles = makeStyles({
  draftjstoolbar: {
    position: "fixed" as const,
    "z-index": ZINDEX_DRAGGABLED,
    overflow: "hidden",
  },
  toolbar: {
    padding: "0px 10px",
  },
  toolbarLabel: {
    margin: "0 10px",
    flex: 1,
  },
  toolbarButton: {
    margin: "0 !important",
  },
});

const STYLE_TYPES: TStyleType[] = [
  {
    label: "H2",
    name: "title",
    style: "header-two",
    icon: "title",
    type: "block",
  },
  {
    label: "Bold",
    name: "bold",
    style: "BOLD",
    icon: "format_bold",
    type: "inline",
  },
  {
    label: "Italic",
    name: "italic",
    style: "ITALIC",
    icon: "format_italic",
    type: "inline",
  },
  {
    label: "Underline",
    name: "underline",
    style: "UNDERLINE",
    icon: "format_underlined",
    type: "inline",
  },
  {
    label: "Strikethrough",
    name: "strikethrough",
    style: "STRIKETHROUGH",
    icon: "strikethrough_s",
    type: "inline",
  },
  {
    label: "Highlight",
    name: "highlight",
    style: "HIGHLIGHT",
    icon: "highlight",

    type: "inline",
  },
  {
    label: "Undo",
    name: "undo",
    style: "UNDO",
    icon: "undo",
    type: "callback",
  },
  {
    label: "Redo",
    name: "redo",
    style: "REDO",
    icon: "redo",
    type: "callback",
  },
  {
    label: "Link",
    name: "link",
    style: "LINK",
    icon: "insert_link",
    type: "callback",
    id: "link-control",
  },
  {
    label: "UL",
    name: "bulletList",
    style: "unordered-list-item",
    icon: "format_list_bulleted",
    type: "block",
  },
  {
    label: "OL",
    name: "numberList",
    style: "ordered-list-item",
    icon: "format_list_numbered",
    type: "block",
  },
  {
    label: "Blockquote",
    name: "quote",
    style: "blockquote",
    icon: "format_quote",
    type: "block",
  },
  {
    label: "Code Block",
    name: "code",
    style: "code-block",
    icon: "code",
    type: "block",
  },
  {
    label: "Clear",
    name: "clear",
    style: "clear",
    icon: "format_clear",
    type: "callback",
  },
  {
    label: "Save",
    name: "save",
    style: "save",
    icon: "save",
    type: "callback",
  },
];

const Toolbar: React.FunctionComponent<TToolbarProps> = (props) => {
  const {
    editorState,
    onMouseEnter,
    onMouseLeave,
    onClose,
    defaultPosition,
  } = props;

  const classes = useStyles({});

  if (!props.controls) {
    return;
  }
  const filteredControls: TStyleType[] = [];
  props.controls.forEach((name) => {
    const style = STYLE_TYPES.find((style) => style.name === name);
    if (style) {
      filteredControls.push(style);
    }
  });

  return (
    <Portal>
      <Draggable handle={`.${dragCls}`} bounds="parent">
        <Paper
          className={classes.draftjstoolbar}
          style={{
            width: WIDTH_TOOLBAR,
            left: defaultPosition.left,
            top: defaultPosition.top,
          }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <MUIToolbar className={classnames([dragCls, classes.toolbar])}>
            <Btn className={classes.toolbarButton} icon="drag_indicator" />
            <Typography
              className={classes.toolbarLabel}
              variant="body1"
              noWrap
              children={"Text Style"}
            />
            <Btn
              className={classes.toolbarButton}
              onClick={onClose}
              icon="close"
            />
          </MUIToolbar>
          <Divider variant="middle" />
          {filteredControls.map((style) => {
            if (
              props.inlineMode &&
              style.type !== "inline" &&
              style.name !== "clear"
            ) {
              return null;
            }
            let active = false;
            const action = props.onClick;
            if (!props.isActive) {
              active = false;
            } else if (style.type === "inline") {
              active = editorState.getCurrentInlineStyle().has(style.style);
            } else if (style.type === "block") {
              const selection = editorState.getSelection();
              const block = editorState
                .getCurrentContent()
                .getBlockForKey(selection.getStartKey());
              if (block) {
                active = style.style === block.getType();
              }
            }

            return (
              <ToolbarButton
                id={style.id}
                active={active}
                style={style.style}
                type={style.type}
                key={`key-${style.label}`}
                label={style.label}
                action={action}
                icon={style.icon}
                disabled={props.disabled}
              />
            );
          })}
        </Paper>
      </Draggable>
    </Portal>
  );
};
export default Toolbar;
