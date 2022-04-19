import AssetFolder from "../../../componentsBase/AssetFolder";
import * as React from "react";
import { colorTheme } from "../../../constants";
import ICellItem from "./ICellItem";
import { ACT_VPORT } from "../reducer";
import BadgeGetLink from "./BadgeGetLink";
import { MAP_TYPE, getItemActions } from "../actions";
import { useHistory } from "react-router-dom";
import { getUpdatedPath } from "../getUpdatedPath";
import isEmpty from "lodash-es/isEmpty";
import { ContextDispatchViewport } from "../contexts";
import { ContextPermissions } from "../../contexts";

export const getCellHeight = () => 50;
export const getCellHeader = (total) => `Folders (${total})`;

const CellFolder = ({
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
  const history = useHistory();
  const { id, name, sharedWith, publicshares } = data;
  const onClick = React.useCallback(
    (p, { keyCtrlDown, keyShiftDown }) => {
      dispatchViewport({
        type: ACT_VPORT.ITEMS_SELECT,
        itemId: id,
        keyCtrlDown,
        keyShiftDown,
      });
    },
    [dispatchViewport, id]
  );
  const onDoubleClick = React.useCallback(() => {
    history.push(getUpdatedPath(id));
  }, [history, id]);
  const onContextMenu = React.useCallback(() => {
    if (!selected) {
      dispatchViewport({ type: ACT_VPORT.ITEMS_SELECT, itemId: id });
    }
  }, [dispatchViewport, id, selected]);
  const onActionClick = React.useCallback(
    (event, id) => dispatchViewport({ type: MAP_TYPE[id] }),
    [dispatchViewport]
  );
  const disabled = (publicshares || []).find((p) => !p.availability);

  return (
    <AssetFolder
      id={id}
      style={{
        height: cellHeight - 5,
        width: cellWidth - 5,
        borderColor: focused ? colorTheme : undefined,
        opacity: disabled ? 0.25 : 1,
        borderStyle: cuted ? "dashed" : "solid",
      }}
      icon={isEmpty(sharedWith) ? "folder" : "folder_shared"}
      label={name}
      labelProps={{ endLength: 7 }}
      colorTheme={colorTheme}
      selected={selected}
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
      <BadgeGetLink
        data={data}
        style={{ position: "relative", marginRight: 6 }}
      />
    </AssetFolder>
  );
};

export default CellFolder;
