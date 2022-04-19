import AssetPreview from "../../../componentsBase/AssetPreview";
import * as React from "react";
import { colorTheme } from "../../../constants";
import ICellItem from "./ICellItem";
import apiUrls from "../../../api/endpoints";
import getFileIcon from "../../AreaFiles/getFileIcon";
import { typeVideo } from "../../../mimeTypes";
import { PreviewType } from "../../../componentsBase/Preview";
import onItemClick from "./onItemClick";
import { ACTION } from "../reducer";
import { useLocation } from "react-router-dom";
import { getItemActions, MAP_TYPE } from "../actions";
import { SheetLayout } from "../../../interfaces";
import BadgeOpenMedia from "./BadgeOpenMedia";

export const getCellHeight = () => 180;
export const getCellHeader = (total) => `Files (${total})`;
const getFileExtension = (fileName: string) =>
  /(?:\.([^.]+))?$/.exec(fileName)[1];

const CellFile = ({
  dispatch,
  items,
  itemsIdSelected,
  itemLastSelectedIndex,
  cellHeight,
  cellWidth,
  data,
  selected,
  focused,
  detailOpen,
}: ICellItem) => {
  const location = useLocation();
  const { id, name, documentRepoId, mimeType } = data;
  const fileExtension = getFileExtension(name);
  const onClick = React.useCallback(
    (p, { ctrlDown, shiftKey }) => {
      onItemClick({
        dispatch,
        items,
        itemsIdSelected,
        itemLastSelectedIndex,
        data,
        selected,
        ctrlDown,
        shiftKey,
      });
    },
    [data, dispatch, itemLastSelectedIndex, items, itemsIdSelected, selected]
  );
  const onContextMenu = React.useCallback(() => {
    dispatch({ type: ACTION.ITEMS_CONTEXT, id });
  }, [dispatch, id]);
  const onDoubleClick = React.useCallback(() => {
    dispatch({ type: ACTION.SHEET_LAYOUT, layout: SheetLayout.FULLSCREEN });
  }, [dispatch]);
  const onActionClick = React.useCallback(
    (event, id) => dispatch({ type: MAP_TYPE[id] }),
    [dispatch]
  );
  const icon = getFileIcon(mimeType);
  const isVideo = new Set(typeVideo).has(mimeType);
  const rendition = isVideo ? "LQ" : "s";
  const srcUrl = apiUrls.getRenditionPublic.url(
    location.search.replace("?link=", ""),
    documentRepoId,
    rendition
  );
  const srcType = isVideo ? PreviewType.VIDEO : PreviewType.IMAGE;

  return (
    <AssetPreview
      id={id}
      style={{
        height: cellHeight - 6,
        width: cellWidth - 6,
        borderColor: focused ? colorTheme : undefined,
      }}
      label={name}
      labelProps={{
        endLength: 7,
      }}
      colorTheme={colorTheme}
      selected={selected}
      placeholderIcon={icon}
      placeholderLabel={
        icon || !fileExtension ? "" : fileExtension.toUpperCase()
      }
      srcUrl={srcUrl}
      srcType={srcType}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      contextmenu={getItemActions({
        contextmenu: true,
        detailOpen,
        items,
        itemsIdSelected,
      }).map((a) => ({ ...a, onClick: onActionClick }))}
    >
      <BadgeOpenMedia data={data} style={{ top: 6, left: 6 }} />
    </AssetPreview>
  );
};

export default CellFile;
