import * as React from 'react';
import Btn from '../../Btn';
import Cell from '../Cell';
import CellIcon from './CellIcon';
import CellThumbnails from './CellThumbnails';
import CellString from './CellString';
import ICellContent from './ICellContent';
import isEmpty from 'lodash-es/isEmpty';
import isEqual from 'lodash-es/isEqual';
import { TypeCell } from '../interfaces';
import getValueString from './getValueString';

const CellContent = ({ columnIndex, rowIndex, style, data }: ICellContent) => {
  const {
    value,
    column,
    focused,
    rowThumbnailSize,
    rowContextmenu,
    rowOnClick,
    rowOnContextMenu,
    rowOnDoubleClick,
    rowOnCopyToClipboard,
    renderCell,
    renderPlaceholder,
    selected,
    mapError,
  } = data;

  if (!!renderPlaceholder && data.value == undefined) {
    return renderPlaceholder({
      columnData: column,
      columnIndex,
      rowIndex,
      selected,
      focused,
      style,
      contextmenu: rowContextmenu,
      onClick: rowOnClick,
      onDoubleClick: rowOnDoubleClick,
      onContextMenu: rowOnContextMenu,
      onCopyToClipboard: rowOnCopyToClipboard,
    });
  }

  if (renderCell) {
    const cell = renderCell({
      columnData: column,
      columnIndex,
      rowIndex,
      selected,
      focused,
      style,
      contextmenu: rowContextmenu,
      onClick: rowOnClick,
      onDoubleClick: rowOnDoubleClick,
      onContextMenu: rowOnContextMenu,
      onCopyToClipboard: rowOnCopyToClipboard,
    });
    if (cell) return cell;
  }

  if (new Set(Object.keys(mapError)).has(value)) {
    return (
      <Cell
        rowIndex={rowIndex}
        columnIndex={columnIndex}
        selected={selected}
        focused={focused}
        style={style}
        contextmenu={rowContextmenu}
        onClick={rowOnClick}
        onDoubleClick={rowOnDoubleClick}
        onContextMenu={rowOnContextMenu}
        children={
          <div style={{ width: '-webkit-fill-available' }}>
            <Btn
              variant='bold'
              label='?'
              style={{ margin: 0 }}
              {...mapError[value]}
            />
          </div>
        }
      />
    );
  }

  switch (column.type) {
    case TypeCell.Thumbnail:
    case TypeCell.MultipleThumbnail:
      return (
        <CellThumbnails
          value={isEmpty(value) ? [] : value}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          selected={selected}
          focused={focused}
          style={style}
          thumbnailSize={rowThumbnailSize}
          contextmenu={rowContextmenu}
          onContextMenu={rowOnContextMenu}
          onClick={rowOnClick}
          onDoubleClick={rowOnDoubleClick}
        />
      );
    case TypeCell.Icon:
      return (
        <CellIcon
          value={value}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          selected={selected}
          focused={focused}
          style={style}
          contextmenu={rowContextmenu}
          onContextMenu={rowOnContextMenu}
          onClick={rowOnClick}
          onDoubleClick={rowOnDoubleClick}
        />
      );
    default:
      return (
        <CellString
          value={getValueString(value, column.type)}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          selected={selected}
          focused={focused}
          style={style}
          contextmenu={rowContextmenu}
          onContextMenu={rowOnContextMenu}
          onClick={rowOnClick}
          onDoubleClick={rowOnDoubleClick}
          onCopyToClipboard={rowOnCopyToClipboard}
        />
      );
  }
};

export default React.memo(CellContent, isEqual);
