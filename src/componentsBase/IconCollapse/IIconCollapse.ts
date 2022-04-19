interface IIconCollapse {
  /** Icon's classname */
  className?: string;
  /** If true, icon is rotate of 90° */
  collapse: boolean;
  /** Callback fire on click */
  onClick?: (event: React.MouseEvent) => void;
  /** Icon's classname */
  style?: React.CSSProperties;
}

export default IIconCollapse;
