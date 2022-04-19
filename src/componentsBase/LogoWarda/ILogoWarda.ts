import { Weight } from "./Weight";

export default interface ILogoWarda {
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  height?: number;
  onClick?: (event: React.MouseEvent) => void;
  weight?: Weight;
  width?: number;
}
