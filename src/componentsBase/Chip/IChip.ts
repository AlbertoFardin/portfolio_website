export interface IChip {
  avatar?: string;
  className?: string;
  classNameLabel?: string;
  label?: string;
  id?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onRemove?: (event: React.MouseEvent<HTMLDivElement>) => void;
  tooltip?: string;
  tooltipAlwaysVisible?: boolean;
  style?: React.CSSProperties;
  styleLabel?: React.CSSProperties;
  selected?: boolean;
}
