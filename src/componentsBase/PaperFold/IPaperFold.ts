export default interface IPaperFold {
  anchorVertical?: "top" | "bottom";
  anchorHorizontal?: "left" | "right";
  className?: string;
  color?: string;
  open?: boolean;
  style?: React.CSSProperties;
  size?: number;
}
