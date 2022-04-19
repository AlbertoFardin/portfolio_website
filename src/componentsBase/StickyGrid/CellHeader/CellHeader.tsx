import Zoom from '@material-ui/core/Zoom';
import classnames from 'classnames';
import * as React from 'react';
import ReactResizeDetector from 'react-resize-detector';
import TypographyEllipsis from '../../TypographyEllipsis';
import { v4 as uuidv4 } from 'uuid';
import { ISortOrder } from '../interfaces';
import useStyles from './useStyles';
import IconSort from './IconSort';
import Btn from '../../Btn';
import isEqual from 'lodash-es/isEqual';
import { getIndexSort, labelSortAction, arrowSortAction } from './utils';
import { IRenderer } from '../../StickyTable/IStickyTable';
import { emptyFn } from '../../utils/common';

const dragEventId = `cellheader_drag_${uuidv4()}`;

enum ACTION {
  SET_HOVER_MOUSE = 'SET_HOVER_MOUSE',
  SET_HOVER_DRAG = 'SET_HOVER_DRAG',
  SET_WIDTH = 'SET_WIDTH',
  SET_CELL_DRAG_ID = 'SET_CELL_DRAG_ID',
}

const reducer = (state, action) => {
  switch (action.type) {
    case ACTION.SET_HOVER_MOUSE:
      return { ...state, hoverMouse: action.hoverMouse };
    case ACTION.SET_HOVER_DRAG:
      return {
        ...state,
        hoverDrag: action.hoverDrag,
      };
    case ACTION.SET_CELL_DRAG_ID:
      return {
        ...state,
        cellDragId: action.cellDragId,
      };
    default:
      throw new Error();
  }
};

const CellHeader = ({
  style,
  className,
  columnIndex,
  scrolledTop,
  data: {
    id,
    label,
    sortable,
    defaultSorting,
    backgroundColor,
    enableResize,
    enableMove,
    enableMultiSort,
    enableRemove,
    sort,
    onClick,
    onMoveColumn,
    onRemove,
    onResizeEnd,
  },
}: IRenderer) => {
  const [state, dispatch] = React.useReducer(reducer, {
    hoverMouse: false,
    hoverDrag: false,
    cellDragId: '',
  });
  const { hoverMouse, hoverDrag, cellDragId } = state;
  const classes = useStyles({
    height: style.height,
    width: style.width,
    hoverMouse,
    isDefaultSorting: !!defaultSorting,
    backgroundColor,
    dragging: cellDragId === id,
  });
  const foundSort = getIndexSort(id, sort);
  const iconSortHide =
    !!cellDragId || (!foundSort.sorted && !(hoverMouse && sortable));
  const showSortOrderBadge = foundSort.sorted && sort.length > 1;
  const cbOnResize = React.useCallback(
    (w: number) => {
      onResizeEnd(w, columnIndex);
    },
    [columnIndex, onResizeEnd],
  );
  const cbOnClickLabel = React.useCallback(() => {
    const ret = labelSortAction(id, sort, sortable, enableMultiSort);
    if (ret !== undefined) {
      onClick(ret);
    }
  }, [enableMultiSort, id, onClick, sort, sortable]);
  const cbOnSortAsc = React.useCallback(() => {
    const ret = arrowSortAction(
      ISortOrder.ASC,
      id,
      sort,
      sortable,
      enableMultiSort,
    );
    if (ret !== undefined) {
      onClick(ret);
    }
  }, [enableMultiSort, id, onClick, sort, sortable]);
  const cbOnSortDesc = React.useCallback(() => {
    const ret = arrowSortAction(
      ISortOrder.DESC,
      id,
      sort,
      sortable,
      enableMultiSort,
    );
    if (ret !== undefined) {
      onClick(ret);
    }
  }, [enableMultiSort, id, onClick, sort, sortable]);
  const cbOnMouseEnter = React.useCallback((event) => {
    event.stopPropagation();
    event.preventDefault();
    dispatch({ type: ACTION.SET_HOVER_MOUSE, hoverMouse: true });
  }, []);
  const cbOnMouseLeave = React.useCallback((event) => {
    event.stopPropagation();
    event.preventDefault();
    dispatch({ type: ACTION.SET_HOVER_MOUSE, hoverMouse: false });
  }, []);
  const cbOnDragStart = React.useCallback(
    (event) => {
      dispatch({ type: ACTION.SET_CELL_DRAG_ID, cellDragId: id });
      event.dataTransfer.setData(dragEventId, id);
    },
    [id],
  );
  const cbOnDragOver = React.useCallback((event) => {
    event.stopPropagation();
    event.preventDefault();
    dispatch({ type: ACTION.SET_HOVER_DRAG, hoverDrag: true });
  }, []);
  const cbOnDragLeave = React.useCallback((event) => {
    event.stopPropagation();
    event.preventDefault();
    dispatch({ type: ACTION.SET_HOVER_DRAG, hoverDrag: false });
  }, []);
  const cbOnDragEnd = React.useCallback((event) => {
    event.stopPropagation();
    event.preventDefault();
    dispatch({ type: ACTION.SET_CELL_DRAG_ID, cellDragId: '' });
  }, []);
  const cbOnDrop = React.useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();
      const dragColId = event.dataTransfer.getData(dragEventId);
      const dropColId = id;
      if (dragColId !== dropColId) onMoveColumn(dragColId, dropColId);
      dispatch({ type: ACTION.SET_HOVER_DRAG, hoverDrag: false });
    },
    [id, onMoveColumn],
  );
  const cbOnRemove = React.useCallback(() => {
    onRemove(id);
  }, [id, onRemove]);
  const cbOnClick = React.useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  return (
    <div
      role='presentation'
      style={style}
      className={classnames({
        [classes.cell]: true,
        [classes.cellDragging]: cellDragId === id,
        [classes.cellResizable]: enableResize,
        [classes.shadowHeader]: scrolledTop,
        [className]: !!className,
      })}
      onFocus={emptyFn}
      onMouseOver={cbOnMouseEnter}
      onMouseEnter={cbOnMouseEnter}
      onMouseLeave={cbOnMouseLeave}
      draggable={enableMove}
      onDragStart={cbOnDragStart}
      onDragOver={cbOnDragOver}
      onDragLeave={cbOnDragLeave}
      onDragEnd={cbOnDragEnd}
      onDrop={cbOnDrop}
      onClick={cbOnClick}
    >
      {!hoverDrag ? null : <div className={classes.dropIndicator} />}
      {showSortOrderBadge && !hoverMouse ? (
        <Btn
          className={classes.badge}
          labelClassName={classes.badgeLabel}
          label={String(foundSort.index + 1)}
        />
      ) : null}
      <Zoom in={hoverMouse && !cellDragId && enableRemove}>
        <Btn
          className={classes.badge}
          tooltip='Remove Column'
          icon='close'
          onClick={cbOnRemove}
        />
      </Zoom>

      <IconSort
        classes={classes}
        selected={
          foundSort.sorted && sort[foundSort.index].order === ISortOrder.ASC
        }
        hidden={iconSortHide}
        icon='arrow_drop_up'
        onClick={cbOnSortAsc}
      />
      <TypographyEllipsis
        variant='body1'
        className={classes.label}
        onClick={cbOnClickLabel}
        children={label}
      />
      <IconSort
        classes={classes}
        selected={
          foundSort.sorted && sort[foundSort.index].order === ISortOrder.DESC
        }
        hidden={iconSortHide}
        icon='arrow_drop_down'
        onClick={cbOnSortDesc}
      />
      {cellDragId ? null : (
        <ReactResizeDetector
          handleWidth
          handleHeight={false}
          skipOnMount
          onResize={cbOnResize}
        />
      )}
    </div>
  );
};

export default React.memo(CellHeader, isEqual);
