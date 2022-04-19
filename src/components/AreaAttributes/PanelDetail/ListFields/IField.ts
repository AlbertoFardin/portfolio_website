import { AttributeType } from "../../../../interfaces";

interface IField {
  key: string;
  id: string;
  label: string;
  value;
  readOnly: boolean;
  className: string;
  attributeType: AttributeType;
}

export default IField;
