import * as React from "react";
import * as Colors from "../../../componentsBase/style/Colors";
import AssetPreview from "../../../componentsBase/AssetPreview";
import { colorTheme } from "../../../constants";
import ICellItem from "./ICellItem";
import apiUrls from "../../../api/endpoints";
import getFileIcon from "../getFileIcon";
import { typeVideo } from "../../../mimeTypes";
import { PreviewType } from "../../../componentsBase/Preview";
import { ACT_VPORT } from "../reducer";
import BadgeOpenMedia from "./BadgeOpenMedia";
import BadgeGetLink from "./BadgeGetLink";
import BadgeSharedWith, { getLabel } from "./BadgeSharedWith";
import BadgeExpirationDate from "./BadgeExpirationDate";
import { MAP_TYPE, getItemActions } from "../actions";
import { Service, IFile, SheetLayout } from "../../../interfaces";
import isEmpty from "lodash-es/isEmpty";
import { ContextDispatchViewport } from "../contexts";
import { ContextPermissions } from "../../contexts";

export const getCellHeight = () => 180;
export const getCellHeader = (total) => `Files (${total})`;
const getFileExtension = (fileName: string) =>
  /(?:\.([^.]+))?$/.exec(fileName)[1];
const isDateExpired = (data: IFile): boolean => {
  const { copyright } = data;
  const expirationDate = (copyright || {}).expirationDate;
  const currentDate = new Date().getTime();
  if (!expirationDate) return false;
  if (currentDate < new Date(expirationDate).getTime()) return false;
  return true;
};

const CellFile = ({
  items,
  itemsIdSelected,
  cellHeight,
  cellWidth,
  data,
  selected,
  focused,
  cuted,
  detailSheet,
  path,
  hideActions,
}: ICellItem) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const permissions = React.useContext(ContextPermissions);

  const { id, name, documentRepoId, mimeType, sharedWith, publicshares } = data;
  const fileExtension = getFileExtension(name);

  const onClick = React.useCallback(
    (event, { keyCtrlDown, keyShiftDown }) => {
      dispatchViewport({
        type: ACT_VPORT.ITEMS_SELECT,
        itemId: id,
        keyCtrlDown,
        keyShiftDown,
      });
    },
    [dispatchViewport, id]
  );
  const onContextMenu = React.useCallback(() => {
    if (!selected) {
      dispatchViewport({ type: ACT_VPORT.ITEMS_SELECT, itemId: id });
    }
  }, [dispatchViewport, id, selected]);
  const onDoubleClick = React.useCallback(() => {
    dispatchViewport({
      type: ACT_VPORT.SHEET_LAYOUT,
      layout: SheetLayout.FULLSCREEN,
    });
  }, [dispatchViewport]);
  const onActionClick = React.useCallback(
    (event, id) => dispatchViewport({ type: MAP_TYPE[id] }),
    [dispatchViewport]
  );
  const onClickBadgeShareWith = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.MODAL_SHARE_PRIVATE, ids: [id] });
  }, [dispatchViewport, id]);

  const icon = getFileIcon(mimeType);
  const isVideo = new Set(typeVideo).has(mimeType);
  const rendition = isVideo ? "LQ" : "s";
  const srcUrl = apiUrls.getRendition.url(
    documentRepoId,
    Service.DIGITALASSETS,
    rendition
  );
  const srcType = isVideo ? PreviewType.VIDEO : PreviewType.IMAGE;
  const disabled = (publicshares || []).find((p) => !p.availability);
  const dateExpired = isDateExpired(data);
  const color = dateExpired ? Colors.Red : colorTheme;

  return (
    <AssetPreview
      id={id}
      style={{
        height: cellHeight - 6,
        width: cellWidth - 6,
        borderColor: focused ? color : undefined,
        opacity: disabled ? 0.25 : 1,
        borderStyle: cuted ? "dashed" : "solid",
      }}
      label={name}
      labelProps={{ endLength: 7 }}
      colorTheme={color}
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
      contextmenu={
        !hideActions
          ? getItemActions({
              permissions,
              contextmenu: true,
              detailSheet,
              path,
              items,
              itemsIdSelected,
              onClick: onActionClick,
            })
          : []
      }
    >
      <BadgeOpenMedia data={data} style={{ top: 6, left: 6 }} />
      <BadgeGetLink data={data} style={{ top: 6, right: 6 }} />
      {!dateExpired ? null : (
        <BadgeExpirationDate style={{ top: 55, left: 6 }} />
      )}
      {isEmpty(sharedWith) ? null : (
        <BadgeSharedWith
          sharedWith={sharedWith}
          tooltip={getLabel(sharedWith)}
          style={{ bottom: 40, left: 6 }}
          onClick={onClickBadgeShareWith}
        />
      )}
    </AssetPreview>
  );
};

export default CellFile;
