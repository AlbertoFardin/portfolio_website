import * as React from "react";
import useScrollbarSizes from "./useScrollbarSizes";
import useVirtualize from "./useVirtual";
import TableGrid from "./TableGrid";
import TableHeaderRow from "./TableHeaderRow";
import TableHeaderCol from "./TableHeaderCol";
import Corner from "./Corner";
import useStyles from "./useStyles";
import IStickyTable from "./IStickyTable";

const DEFAULT_WIDTH = 100;
const DEFAULT_HEIGHT = 50;

// Basic cell renderer. If someone wants to provide a custom function but only wants to change it slightly from the
// default, they can use a wrapper around this.
export const basicRenderer = ({ data, style, className }) => (
  <div style={style} className={className} children={data} />
);

export const StickyTable = ({
  topData,
  rightData,
  bottomData,
  leftData,
  data,
  width,
  height,
  columnWidth = DEFAULT_WIDTH,
  rowHeight = DEFAULT_HEIGHT,
  topHeight = rowHeight,
  rightWidth = columnWidth,
  bottomHeight = rowHeight,
  leftWidth = columnWidth,
  columnCount,
  rowCount,
  CellRenderer = basicRenderer,
  TopRenderer = basicRenderer,
  RightRenderer = basicRenderer,
  BottomRenderer = basicRenderer,
  LeftRenderer = basicRenderer,
  TopLeftRender = Corner,
  TopRightRender = Corner,
  BottomLeftRender = Corner,
  BottomRightRender = Corner,
  overscan = 10,
  innerElement,
  resetScrollbar = null,
}: IStickyTable) => {
  // This goes on the outermost div. We just use it for the scrollbar hook.
  const classes = useStyles({});
  const containerRef = React.useRef();
  const scrollbarSizes = useScrollbarSizes(containerRef);

  if (!topData) {
    topHeight = 0;
  }
  if (!rightData) {
    rightWidth = 0;
  }
  if (!bottomData) {
    bottomHeight = 0;
  }
  if (!leftData) {
    leftWidth = 0;
  }

  // Size of the actual grid. The grid table will need to have these dimensions. Because we have custom size functions,
  // we have to iterate over the entire data object and aggregate the dimensions. For large data sets this can be
  // expensive. This only needs to be re-computed when the sizes or data change, so memoize!
  const [contentWidth, contentHeight] = React.useMemo(() => {
    let width = 0;
    let height = 0;
    if (typeof columnWidth === "function") {
      for (let i = 0; i < columnCount; ++i) {
        width += columnWidth(i);
      }
    } else {
      width = columnWidth * columnCount;
    }

    if (typeof rowHeight === "function") {
      for (let i = 0; i < rowCount; ++i) {
        height += rowHeight(i);
      }
    } else {
      height = rowHeight * rowCount;
    }
    return [width, height];
  }, [columnWidth, rowHeight, columnCount, rowCount]);

  // Size of the grid plus all the headers. The containing div will need to have these dimensions
  const totalWidth = leftWidth + rightWidth + contentWidth;
  const totalHeight = topHeight + bottomHeight + contentHeight;

  let viewWidth, viewHeight, hasVertScroll, hasHorizScroll;
  // If the size of the interior table is greater than its view, there will be scroll bars. Additionally, the box will
  // be the full size of the view. If the interior is smaller than the view, there are no scroll bars and we want the
  // view to only be as big as the interior. If the interior plus scroll bars is greater than the outside, just include
  // them.
  if (totalWidth + scrollbarSizes.width > width) {
    hasHorizScroll = true;
    viewWidth = width;
  } else {
    hasHorizScroll = false;
    viewWidth = totalWidth;
  }
  if (totalHeight + scrollbarSizes.height > height) {
    hasVertScroll = true;
    viewHeight = height;
  } else {
    hasVertScroll = false;
    viewHeight = totalHeight;
  }

  // The position from the left things like the right table/border/corners will be. This will be the size of the view
  // minus the size of the right header.
  let rightLeftPos = viewWidth - rightWidth;
  let bottomTopPos = viewHeight - bottomHeight;

  // If there are scroll bars, we're going to need to tweak some sizing and positioning.
  if (hasVertScroll || hasHorizScroll) {
    // If there are scroll bars on both sides, we need to move all our headers, corners, and fake borders over the size
    // of the scroll bars. If there is only one scroll bar, the side that doesn't have one is smaller than the box. Thus
    // the view was shrunk to only be the full size of the content. However, that content is now being pushed a little
    // by the scroll bar in the other direction, requiring us to scroll that tiny amount. So expand that width
    if (hasVertScroll && hasHorizScroll) {
      rightLeftPos -= Math.max(scrollbarSizes.width, width - viewWidth);
      bottomTopPos -= scrollbarSizes.height;
    } else if (hasVertScroll) {
      viewWidth += scrollbarSizes.width;
    } else {
      viewHeight += scrollbarSizes.height;
    }
  }

  // Given all relevant data, get virtual information. This includes
  // - Minimum and maximum rows/columns that must be rendered to populate the viewable box (the ranges that, if you're
  //   looking at an element outside that range, you don't have to render it).
  // - Dimensions of elements
  // - Absolute positions of elements
  // In order to get the virtualization (min/max) information, we have to compute the positions, and in order to compute
  // the positions, we need the sizes. Thus, we just handle and return all this information so we don't have to repeat
  // the work. This takes overscanning into account. Since this is the only thing that is hooking into the scroll
  // events on the div, we provide our own setters and keep the state internally.
  const { virtual, setLeft, setTop, scrolledLeft, scrolledTop } = useVirtualize(
    {
      overscan,
      columnCount,
      rowCount,
      columnWidth,
      rowHeight,
      width: viewWidth - leftWidth - rightWidth,
      height: viewHeight - topHeight - bottomHeight,
    }
  );

  const onScrollCb = React.useCallback(
    (e) => {
      setLeft(e.target.scrollLeft as number);
      setTop(e.target.scrollTop as number);
    },
    [setLeft, setTop]
  );

  const scrollbarDivEl = React.useRef(null as HTMLDivElement);

  React.useEffect(() => {
    if (scrollbarDivEl.current) {
      scrollbarDivEl.current.scrollTo(0, 0);
    }
  }, [resetScrollbar]);

  return (
    <div
      ref={containerRef}
      className={classes.stickyTableOuter}
      style={{
        width,
        height,
      }}
    >
      <div
        className={classes.stickyTable}
        ref={scrollbarDivEl}
        style={{
          width,
          height: viewHeight,
        }}
        onScroll={onScrollCb}
      >
        {topData && leftData && (
          <TopLeftRender
            width={leftWidth}
            height={topHeight}
            top={0}
            left={0}
            scrolledTop={scrolledTop}
            scrolledLeft={scrolledLeft}
          />
        )}
        {bottomData && leftData && (
          <BottomLeftRender
            width={leftWidth}
            height={bottomHeight}
            top={bottomTopPos}
            left={0}
            scrolledTop={scrolledTop}
            scrolledLeft={scrolledLeft}
          />
        )}
        {topData && rightData && (
          <TopRightRender
            outerWidth
            width={rightWidth}
            height={topHeight}
            top={0}
            left={rightLeftPos}
            scrolledTop={scrolledTop}
            scrolledLeft={scrolledLeft}
          />
        )}
        {bottomData && rightData && (
          <BottomRightRender
            outerWidth
            width={rightWidth}
            height={bottomHeight}
            top={bottomTopPos}
            left={rightLeftPos}
            scrolledTop={scrolledTop}
            scrolledLeft={scrolledLeft}
          />
        )}
        {topData && (
          <TableHeaderRow
            data={topData}
            className={classes.topHeader}
            leftWidth={leftWidth}
            height={topHeight}
            virtual={virtual}
            renderer={TopRenderer}
            scrolledTop={scrolledTop}
          />
        )}
        {leftData && (
          <TableHeaderCol
            data={leftData}
            className={classes.leftHeader}
            width={leftWidth}
            virtual={virtual}
            renderer={LeftRenderer}
            scrolledLeft={scrolledLeft}
          />
        )}
        {rightData && (
          <TableHeaderCol
            data={rightData}
            className={classes.rightHeader}
            left={rightLeftPos}
            width={rightWidth}
            virtual={virtual}
            renderer={RightRenderer}
            scrolledLeft={scrolledLeft}
          />
        )}
        {bottomData && (
          <TableHeaderRow
            data={bottomData}
            className={classes.bottomHeader}
            top={bottomTopPos}
            leftWidth={leftWidth}
            height={bottomHeight}
            virtual={virtual}
            renderer={BottomRenderer}
            scrolledTop={scrolledTop}
          />
        )}

        <div
          className={classes.innerGrid}
          style={{
            width: contentWidth + rightWidth,
            maxWidth: contentWidth + rightWidth,
            height: contentHeight,
            maxHeight: contentHeight,
            top: -bottomHeight,
            left: leftWidth,
          }}
        >
          {innerElement}
          <TableGrid data={data} virtual={virtual} renderer={CellRenderer} />
        </div>
      </div>
    </div>
  );
};

export default StickyTable;
