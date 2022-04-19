import { FunctionComponent } from "react";
import {
  EditorState,
  DraftHandleValue,
  SelectionState,
  ContentBlock,
  DraftBlockType,
} from "draft-js";

export type TDecorator = {
  component: FunctionComponent;
  regex: RegExp;
};

export type TDraftEditorProps = {
  spellCheck?: boolean;
  stripPastedStyles?: boolean;
  placeholder?: string;
  handleDroppedFiles?: (
    selectionState: SelectionState,
    files: Blob[]
  ) => DraftHandleValue;
};

export type TKeyCommand = {
  key: number;
  name: string;
  callback: (state: EditorState) => EditorState;
};

export type TAlignment = "left" | "center" | "right";

export type TMediaType = "image" | "video";

export type TUrlData = {
  url?: string;
  width?: number;
  height?: number;
  alignment?: TAlignment;
  type?: TMediaType;
};

export type TAsyncAtomicBlockResponse = {
  data;
};

export type TMUIRichTextEditorRef = {
  focus: () => void;
  save: () => void;
  /**
   * @deprecated Use `insertAtomicBlockSync` instead.
   */
  insertAtomicBlock: (name: string, data) => void;
  insertAtomicBlockSync: (name: string, data) => void;
  insertAtomicBlockAsync: (
    name: string,
    promise: Promise<TAsyncAtomicBlockResponse>,
    placeholder?: string
  ) => void;
};

export type TPosition = {
  top: number;
  left: number;
};

export type TSelectionInfo = {
  inlineStyle: Immutable.OrderedSet<string>;
  blockType: DraftBlockType;
  entityType: string;
  linkKey: string;
  block: ContentBlock;
};
