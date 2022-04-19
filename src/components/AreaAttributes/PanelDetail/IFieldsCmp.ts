import { IAttribute, IColumnSc } from "../../../interfaces";

interface IFieldsCmp {
  columns: IColumnSc[];
  data: IAttribute;
  readOnly: boolean;
}

export default IFieldsCmp;
