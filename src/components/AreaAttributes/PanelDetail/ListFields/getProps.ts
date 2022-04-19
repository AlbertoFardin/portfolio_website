import {
  ILabel,
  ILabelPositionX,
  ILabelPositionY,
} from "../../../../componentsBase/Field";
import { AttributeType } from "../../../../interfaces";
import { requiredMap } from "../../hasRequired";

interface IGetProps {
  id: string;
  label: string;
  readOnly: boolean;
  attributeType?: AttributeType;
}

interface IReturn {
  label: ILabel[];
  readOnly: boolean;
  placeholder: string;
}

const getProps = ({
  id,
  label,
  readOnly,
  attributeType,
}: IGetProps): IReturn => ({
  label: [
    {
      id: "label",
      label,
      positionX: ILabelPositionX.left,
      positionY: ILabelPositionY.top,
      required:
        !readOnly &&
        (!attributeType || new Set(requiredMap[attributeType]).has(id)),
    },
  ],
  readOnly,
  placeholder: "Input value...",
});

export default getProps;
