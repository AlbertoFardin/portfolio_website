import {
  IProduct,
  IColumnSc,
  AttributeFamily,
  AttributeType,
} from "../../interfaces";
import getColumnsFilteredByDataAndDataRoot from "./getColumnsFilteredByDataAndDataRoot";

interface IGetColumns {
  attributeType?: AttributeType[];
  attributeEditable?: boolean;
  attributeFamily?: AttributeFamily;
  columns: IColumnSc[];
  datas: IProduct[];
  datasRoot: IProduct[];
}

const DEFAULT_ATTRIBUTE_TYPE = [
  AttributeType.MASTER,
  AttributeType.SYSTEM,
  AttributeType.USER,
];

export const getAttributesByFamily = ({
  attributeType: type = DEFAULT_ATTRIBUTE_TYPE,
  attributeEditable: editable = false,
  attributeFamily: family,
  columns,
}: {
  attributeType?: AttributeType[];
  attributeEditable?: boolean;
  attributeFamily?: AttributeFamily;
  columns: IColumnSc[];
}) =>
  columns.filter((col) => {
    const { id, attributeFamily, attributeType, editField } = col;

    ///////////////////////////////////////////////////////////
    // non voglio vedere un field "id"
    const checkId: boolean = id !== "id";

    ///////////////////////////////////////////////////////////
    // mostro i field che appartengono alla family indicata
    // oppure se non hanno family li mostro sempre
    const checkAttFamily: boolean =
      family === undefined ? true : family === attributeFamily;

    ///////////////////////////////////////////////////////////
    // mostro i field che appartengono al type indicato
    const checkAttType: boolean = new Set(type).has(attributeType);

    ///////////////////////////////////////////////////////////
    // mostro i field che hanno valorizzato editField
    // oppure tutti quei field a cui l'utente ha associato una family
    // e quindi li vuole vedere nell'eastpanel in read only
    const checkAttEditable: boolean = !editable ? true : !!editField;

    return checkId && checkAttFamily && checkAttEditable && checkAttType;
  });

const getColumnsByFamily = ({
  attributeType = DEFAULT_ATTRIBUTE_TYPE,
  attributeEditable = false,
  attributeFamily,
  columns,
  datas,
  datasRoot,
}: IGetColumns): IColumnSc[] =>
  getColumnsFilteredByDataAndDataRoot({
    columns: getAttributesByFamily({
      attributeType,
      attributeEditable,
      attributeFamily,
      columns,
    }),
    datas,
    datasRoot,
  });

export default getColumnsByFamily;
