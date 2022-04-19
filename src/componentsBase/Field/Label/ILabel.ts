import { ILabelPositionX, ILabelPositionY } from "./ILabelPosition";

interface ILabel {
  id: string;
  className?: string;
  label: string | React.ReactNode;
  required?: boolean;
  positionX: ILabelPositionX;
  positionY: ILabelPositionY;
  readOnly?: boolean;
  style?: React.CSSProperties;
}

export default ILabel;
