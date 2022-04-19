/* eslint-disable @typescript-eslint/no-explicit-any */
import { IBtn } from "../Btn";
import { PreviewType } from "../Preview";
import { IPaperFold } from "../PaperFold";
import { IActions } from "../ActionsMenu";
import { IRenderer } from "../StickyTable";

export interface ILeftData {
  rowIndex: number;
  rowData;
  selected: boolean;
  focused: boolean;
  contextmenu: IActions[];
  onClick: (p: ICellClick) => void;
  onDoubleClick: (p: ICellClick) => void;
  onContextMenu: (p: ICellClick) => void;
  onCopyToClipboard?: (s: string) => void;
}
export interface IRendererLeft extends IRenderer {
  data: ILeftData;
}

export enum TypeCell {
  Thumbnail = "thumbnail",
  MultipleThumbnail = "multiplethumbnail",
  String = "string",
  MultipleString = "multiplestring",
  SimpleDate = "simpledate",
  Timestamp = "timestamp",
  Icon = "icon",
  Bool = "bool",
  Avatar = "avatar",
  User = "user",
  MultipleAvatar = "multipleavatar",
  DictionaryEntry = "dictionaryEntry",
  DictionaryEntries = "dictionaryEntries",
  Percentage = "percentage",
  Category = "category",
}

export enum ISortOrder {
  ASC = "ASC",
  DESC = "DESC",
  NONE = "NONE",
}

export interface ISortType {
  id: string;
  keyword?: boolean;
  order: ISortOrder;
}

interface IDefaultSorting {
  priority: number;
  sorting: ISortOrder;
}

export interface IColumn {
  type: TypeCell;
  id: string;
  label: string;
  width: number;
  sortable?: boolean;
  keyword?: boolean;
  defaultSorting?: IDefaultSorting;
}

export interface StructColumn {
  id: string;
  width: number;
}

export interface SortColumn {
  id: string;
  order?: ISortOrder;
}

export const actionsbarItemsTypes = {
  SelectField: "SelectField",
  TextareaField: "TextareaField",
  ButtonUpload: "ButtonUpload",
};

export interface SearchColumnInterface {
  onChange: (...key) => void;
  onClose: (...key) => void;
  enabledColumns: {
    columnId: string;
    i18n: {
      "search.placeHolder": string;
    };
    value: string;
  }[];
}

export interface IGetCell {
  selected: boolean;
  cellStyle;
  rowHeight: number;
  column: IColumn;
  rowData;
}

export interface ICellRenderer {
  columnIndex: number;
  rowIndex: number;
  selected: boolean;
  focused: boolean;
  style: React.CSSProperties;
  contextmenu: IActions[];
  onClick: (p: ICellClick) => void;
  onDoubleClick: (p: ICellClick) => void;
  onContextMenu: (p: ICellClick) => void;
  onCopyToClipboard?: (s: string) => void;
}

export interface IRenderCellSidebar extends ICellRenderer {
  rowData;
}
export interface IRenderCellContent extends ICellRenderer {
  columnData: IColumn;
}

export interface IThumbnail {
  id: string;
  badges?: IBtn[];
  label?: string;
  labelStyle?: React.CSSProperties;
  paperFold?: boolean;
  paperFoldProps?: IPaperFold;
  placeholderLabel?: string;
  placeholderLabelStyle?: React.CSSProperties;
  placeholderLabelRequired?: boolean;
  placeholderIcon?: string;
  placeholderIconStyle?: React.CSSProperties;
  srcType?: PreviewType;
  srcUrl: string;
  className?: string;
  classNamePreview?: string;
  style?: React.CSSProperties;
  stylePreview?: React.CSSProperties;
}

export interface ICellClick {
  columnIndex: number;
  rowIndex: number;
  selected: boolean;
  focused: boolean;
  keyCtrlDown: boolean;
  keyShiftDown: boolean;
  thumbId?: string;
}

export interface IGridRow {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: { [k: string]: any };
  id: string;
  selected?: boolean;
  focused?: boolean;
}
interface ICommonPropGrid {
  /** 
    The number of items (rows or columns) to render outside of the visible area. This property can be important for two reasons:
    * Overscanning by one row or column allows the tab key to focus on the next (not yet visible) item.
    * Overscanning slightly can reduce or prevent a flash of empty space when a user first starts scrolling.
    Note that overscanning too much can negatively impact performance
  */
  overscan?: number;
  /** Function to override cell content render, return a cell component to render */
  renderCellContent?: (p: IRenderCellContent) => JSX.Element;
  /** Function to override cell content placeholder, return a cell component to render */
  renderCellPlaceholder?: (p: IRenderCellContent) => JSX.Element;
  /** Function to override cell render of column sticky, return a cell component to render */
  renderCellSidebar?: (p: IRenderCellSidebar) => JSX.Element;
  //
  //
  //
  //
  /** If true, enable resize columns */
  enabledColumnsResize?: boolean;
  /** If true, enable move columns */
  enabledColumnsMove?: boolean;
  /** If true, enable multi sort columns */
  enabledColumnsMultiSort?: boolean;
  /** If true, enable remove columns */
  enabledColumnsRemove?: boolean;
  /** Columns' sort array */
  columnsSort?: SortColumn[];
  //
  //
  //
  //
  /** Width for Sidebar.*/
  sidebarWidth?: number;
  //
  /** Header's height */
  headerHeight?: number;
  /** Header's background color */
  headerBackgroundColor?: string;
  /** Callback fired on header click or sort */
  onHeaderClick?: (sort: SortColumn[]) => void;
  //
  //
  //
  //
  /** Array of items, any item render a row */
  rows: IGridRow[];
  //
  //
  //
  //
  /** If true, render a loading mask */
  rootLoading?: boolean;
  /** Component's CSS classname */
  rootClassName?: string;
  /** Callback fired on component click. ex: click on empty content or click on header (also to resize) */
  onRootClick?: (event: React.MouseEvent) => void;
  /** Component's contextmenu's items */
  rootContextmenu?: IActions[];
  //
  //
  //
  //
  /** Row's contextmenu's items */
  rowContextmenu?: IActions[];
  /** Function that return the row's height */
  rowHeight?: (index: number) => number;
  /** Callback fired on row click */
  onRowClick?: (p: ICellClick) => void;
  /** Callback fired on row double click */
  onRowDoubleClick?: (p: ICellClick) => void;
  /** Callback fired on row contextmenu */
  onRowContextMenu?: (p: ICellClick) => void;
  /** Callback fired on click icon "copy to clipboard" */
  onRowCopyToClipboard?: (s: string) => void;
  /** Forced thumbnail size (squared) in Cellthumbnails cell */
  rowThumbnailSize?: number;
  /** Set a new number to reset scollbar (top and loft set to 0)*/
  resetScrollbar?: number;
  /** Function that return cell's value */
  getCellValue?: (rowData, colum: IColumn) => any;
  /** If a cell's value is equal to a key of this map, the cell show a Btn */
  mapError?: { [keyError: string]: IBtn };
}

export interface IColumnWithGroupId extends IColumn {
  groupId: string;
}

export interface IAdvancedGrid extends ICommonPropGrid {
  /** Disable config managment when ,for i.e., when you are saving new set configs*/
  disableConfigManagment?: boolean;
  /** All columns usable in the different ColumnSets */
  columns: IColumnWithGroupId[];
  /** Sets of items */
  columnsSets?: IColumnsSets[];
  /** Callback fired when columnsSet was changed */
  onColumnsSetsChange: (newColumnSets: IColumnsSets[]) => void;
}

export interface IGrid extends ICommonPropGrid {
  /** Function to override cell canton render, return a cell component to render */
  renderCanton?: () => JSX.Element;
  /** Columns' array config */
  defaultColumns: IColumn[];
  /** Callback fired on columns changed */
  onColumnsChange?: (structColumns: IColumn[]) => void;
}

export interface IUserColumn {
  id: string;
  width?: number;
}

export interface IColumnsSets {
  id: string;
  label?: string;
  active?: boolean;
  default?: boolean;
  items: IUserColumn[];
}
