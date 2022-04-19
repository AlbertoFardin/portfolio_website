import AssetFolder from "../../../componentsBase/AssetFolder";
import * as React from "react";
import { colorTheme } from "../../../constants";
import ICellItem from "./ICellItem";
import onItemClick from "./onItemClick";
import { ACTION } from "../reducer";
import { getItemActions, MAP_TYPE } from "../actions";

export const getCellHeight = () => 50;
export const getCellHeader = (total) => `Folders (${total})`;

const CellFolder = ({
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
  const { id, name, path } = data;
  const onContextMenu = React.useCallback(() => {
    dispatch({ type: ACTION.ITEMS_CONTEXT, id });
  }, [dispatch, id]);
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
  const onDoubleClick = React.useCallback(() => {
    const folderCurrent = [{ id, label: name }];
    const folderPath = path.map((d) => ({ id: d.id, label: d.name }));
    const value = [].concat(folderPath, folderCurrent);
    dispatch({ type: ACTION.FOLDER_OPEN, value });
  }, [dispatch, id, name, path]);
  const onActionClick = React.useCallback(
    (event, id) => dispatch({ type: MAP_TYPE[id] }),
    [dispatch]
  );

  return (
    <AssetFolder
      id={id}
      style={{
        height: cellHeight - 5,
        width: cellWidth - 5,
        borderColor: focused ? colorTheme : undefined,
      }}
      label={name}
      labelProps={{
        endLength: 7,
      }}
      colorTheme={colorTheme}
      selected={selected}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      contextmenu={getItemActions({
        contextmenu: true,
        detailOpen,
        items,
        itemsIdSelected,
      }).map((a) => ({ ...a, onClick: onActionClick }))}
    />
  );
};

export default CellFolder;
