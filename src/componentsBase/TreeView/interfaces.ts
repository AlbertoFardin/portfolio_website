export interface ITreeItem {
  id: string;
  label: string;
  parent: string;
  icon?: string;
  tooltip?: string;
  hasChildren?: boolean;
}

export interface ITreeView {
  style?: React.CSSProperties;
  className?: string;
  items: ITreeItem[];
  selectable?: boolean;
  expanded?: string[];
  selected?: string[];
  onClick?: (id: string) => void;
  onCheck?: (id: string) => void;
  onToggle?: (id: string) => void;
}
