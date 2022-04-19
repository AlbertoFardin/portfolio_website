export interface IIMultiDownloadsItem {
  id: string;
  loading?: boolean;
  name: string;
  url: string;
  onClick?: () => void;
}

export interface IMultiDownloads {
  /** Component CSS classes */
  className?: string;
  /** Array di items renderizzati nel componente, composti da:
   *
   * - **id**: identificativo univoco dell'item.
   * - **loading**?: show spinner
   * - **name**: item label
   * - **url**: item url to download
   * - **onClick**?: Callback fire onClick, if not define download start automaticaly
   * */
  items?: IIMultiDownloadsItem[];
  /** Callback fire on click button "X" */
  onClose?: () => void;
  /** Component visibility. If false, the component will not render */
  open?: boolean;
  /** component CSS style */
  style?: React.CSSProperties;
}
