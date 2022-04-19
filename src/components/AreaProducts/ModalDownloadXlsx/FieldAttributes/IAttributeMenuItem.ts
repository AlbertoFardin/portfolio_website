interface IAttributeMenuItem {
  id: string;
  title?: boolean;
  selected?: boolean;
  icon?: string;
  label: string;
  onClick?: (id: string) => void;
}

export default IAttributeMenuItem;
