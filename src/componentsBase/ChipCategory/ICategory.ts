interface ICategory {
  id: string;
  label: string;
  tooltip?: string;
  color?: string;
  onClick?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export default ICategory;
