import isEmpty from "lodash-es/isEmpty";

export const cellHeightDefault = 50;
export const cellTypePlaceholder = "cellTypePlaceholder";
export const cellTypeHeader = "cellTypeHeader";

export const getItemSelectedIndex = (props: {
  itemsSelectedId: (string | number)[];
  items: { id: string | number }[];
}) => {
  const { itemsSelectedId, items } = props;
  if (!itemsSelectedId) {
    return 0;
  }
  const lastId = itemsSelectedId[itemsSelectedId.length - 1];
  return items.findIndex((item) => lastId === (item && item.id));
};

export const getRowSelectedIndex = (props: {
  itemsSelectedId: (string | number)[];
  items: { id: string | number }[];
  columnCount: number;
}) => {
  const { itemsSelectedId, items, columnCount } = props;
  const itemSelectedIndex = getItemSelectedIndex({ itemsSelectedId, items });
  const selectedProduct = Math.trunc(itemSelectedIndex / columnCount);
  return Math.max(selectedProduct, 0);
};

export const getRowCount = (props: {
  itemsCount: number;
  columnCount: number;
}) => {
  const { itemsCount, columnCount } = props;
  const resto = itemsCount % columnCount;
  const total = itemsCount ? Math.trunc(itemsCount / columnCount) : 0;
  return resto ? total + 1 : total;
};

export const isRowLoaded = (props: {
  index: number;
  itemsCount: number;
  items: { id: string | number }[];
  columnCount: number;
}) => {
  const { index, itemsCount, items, columnCount } = props;
  let res = true;
  for (
    let i = index * columnCount;
    i < index * columnCount + columnCount;
    i + 1
  ) {
    if (i < itemsCount) {
      res = res && !!items[i];
    }
  }
  return res;
};

export const itemCountInRow = (props: {
  listWidth: number;
  cellWidth: number;
}) => {
  const { listWidth, cellWidth } = props;
  const columns = listWidth / cellWidth;
  return Math.max(1, Math.trunc(columns));
};

export const placeholderCountInRow = (props: {
  itemsCount: number;
  columns: number;
}) => {
  const { itemsCount, columns } = props;
  const rowsInt = Math.trunc(itemsCount / columns);
  const itemsOdd = itemsCount - rowsInt * columns;
  const placeholderToAdd = columns - itemsOdd;
  if (
    !itemsCount ||
    !columns ||
    placeholderToAdd === columns ||
    placeholderToAdd < 0
  )
    return 0;
  return placeholderToAdd;
};

export const prepareItems = (props: {
  items: { id: string | number; cellType?: string }[];
  columnCount: number;
  headers?: (cellType: string) => string;
}) => {
  const { items, columnCount, headers } = props;
  const cellTypeSplitted = items.reduce((acc, cur) => {
    if (!acc[cur.cellType]) {
      acc[cur.cellType] = items.filter(
        (item) => item.cellType === cur.cellType
      );
    }
    return acc;
  }, {});
  return Object.keys(cellTypeSplitted).reduce((acc, cur) => {
    const itemsGroup = cellTypeSplitted[cur];

    const placeholdersCount = placeholderCountInRow({
      itemsCount: itemsGroup.length,
      columns: columnCount,
    });
    let placeholdersGroup = [];
    if (placeholdersCount) {
      // prepare placeholder to wrap item in new row
      placeholdersGroup = new Array(placeholdersCount);
      placeholdersGroup.fill({ cellType: cellTypePlaceholder });
    }

    let headersGroup = [];
    if (headers) {
      // prepare header oh group
      const label = headers(cur) || cur;
      headersGroup = new Array(columnCount);
      headersGroup.fill({ cellType: cellTypeHeader });
      headersGroup.fill({ cellType: cellTypeHeader, label }, 0, 1);
    }

    // eslint-disable-next-line no-param-reassign
    acc = acc.concat(headersGroup, itemsGroup, placeholdersGroup);
    return acc;
  }, []);
};

export interface ICellViewItem {
  id: string | number;
  cellType?: string;
}

/** *
 * getkeyRender
 * genero un chiave univoca che serve al componente per sapere quando ridisegnarsi
 * tale chiave è composta dagli ID del primo ed ultimo array di item ed il numero di questi.
 *
 * @param array, array di item
 */
export const getkeyRender = (array: ICellViewItem[]) =>
  isEmpty(array)
    ? ""
    : `${array[0].id}_${array.length}_${array[array.length - 1].id}`;
