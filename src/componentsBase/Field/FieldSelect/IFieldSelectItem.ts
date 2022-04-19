interface IFieldSelectItem {
  id: string;
  selected?: boolean;
  title?: string;
  label: string;
  subLabel?: string;
  avatar?: string;
  className?: string;
  classNameLabel?: string;
  classNameSubLabel?: string;
  style?: React.CSSProperties;
  styleLabel?: React.CSSProperties;
  styleSubLabel?: React.CSSProperties;
  showRemoveIcon?: boolean;
}

export default IFieldSelectItem;
