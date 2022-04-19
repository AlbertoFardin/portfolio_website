import { ContentState, EditorState } from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import htmlToDraft from "html-to-draftjs";
import { TSelectionInfo } from "./interfaces";

export const EMPTY_TAG = "<p></p>";

export const getContentStateFromFragmentHtmlString = (
  fragmentHtml: string
): ContentState => {
  if (fragmentHtml || fragmentHtml === null) {
    // NOTE: htmlToDraft() è usata al posto di convertFromHTML() di draftjs
    // perché quest'ultima elimina i caratteri <br>
    const blocksFromHTML = htmlToDraft(
      fragmentHtml !== null ? fragmentHtml : EMPTY_TAG
    );
    return ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
  } else {
    return ContentState.createFromText(fragmentHtml);
  }
};

export const getHtmlStringFromContentState = (
  contentState: ContentState
): string => {
  const s = stateToHTML(contentState).replace("\n", "");
  return s === "<p><br></p>" ? EMPTY_TAG : s;
};

/**
 * Get the current selection details
 */
export const getSelectionInfo = (editorState: EditorState): TSelectionInfo => {
  const selection = editorState.getSelection();
  const startOffset = selection.getStartOffset();
  const currentContent = editorState.getCurrentContent();
  const contentBlock = currentContent.getBlockForKey(selection.getStartKey());
  const currentStyle = editorState.getCurrentInlineStyle();
  const linkKey = contentBlock.getEntityAt(startOffset);
  let entityType = "";
  if (linkKey) {
    const linkInstance = currentContent.getEntity(linkKey);
    entityType = linkInstance.getType();
  }
  return {
    inlineStyle: currentStyle,
    blockType: contentBlock.getType(),
    entityType: entityType,
    linkKey: linkKey,
    block: contentBlock,
  };
};
