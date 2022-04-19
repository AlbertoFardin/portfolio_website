import IListItemButton from "./IListItemButton";

export interface IGetAdditionalChildren {
  id?: string;
  active?: boolean;
  onClick?: (event: React.MouseEvent, id: string) => void;
  onClose?: (event: React.MouseEvent) => void;
}

interface IListItem {
  id: string;
  active?: boolean;
  avatar?: string;
  getAdditionalChildren?: (p: IGetAdditionalChildren) => React.ReactNode;
  buttons?: IListItemButton[];
  buttonsLeft?: IListItemButton[];
  buttonsEverVisible?: boolean;
  buttonsLeftEverVisible?: boolean;
  className?: string;
  classNameLabel?: string;
  classNameSubLabel?: string;
  classNameIcon?: string;
  disabled?: boolean;
  emoji?: string;
  hover?: boolean;
  icon?: string;
  onClose?: (event: React.MouseEvent) => void;
  onClickStopPropagation?: boolean;
  onClick?: (event: React.MouseEvent, id: string, buttonId?: string) => void;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
  style?: React.CSSProperties;
  styleLabel?: React.CSSProperties;
  styleSubLabel?: React.CSSProperties;
  styleIcon?: React.CSSProperties;
  subLabel?: string;
  label: React.ReactNode | string;
  copyToClipboard?: string;
}

export default IListItem;
