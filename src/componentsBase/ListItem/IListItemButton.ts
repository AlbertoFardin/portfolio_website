interface IListItemButton {
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  icon?: string;
  emoji?: string;
  label?: string;
  avatar?: string;
  id: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent, parentId: string, id: string) => void;
}

export default IListItemButton;
