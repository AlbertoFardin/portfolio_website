export interface IPagination {
  /** Component CSS classes */
  className?: string;
  /** Total count of items to paginate */
  itemsCount: number;
  /** Label render AFTER pagination inputs */
  labelAdornmentEnd?: string;
  /** Label render BEFORE pagination inputs */
  labelAdornmentStart?: string;
  /** Callback fire on input change */
  onChangeCurrent: (curr: number) => void;
  /** Callback fire on select a different page size */
  onChangeSizes?: (sizes: IPageSize[]) => void;
  /** Current page selected */
  pageCurrent: number;
  /** Page size, or, if there are many, array of page size. Each one API:
   *
   * * *label*: string,
   * * *value*: number,
   * * *selected*: boolean,
   */
  pageSizes: IPageSize[] | number;
  /** component CSS style */
  style?: React.CSSProperties;
  /** if true, the component is minimized */
  minimized?: boolean;
}

export interface IPageSize {
  label: string;
  value: number;
  selected: boolean;
}
