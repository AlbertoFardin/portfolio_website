import { isEmpty } from "lodash-es";
import { KEY_ENTITY_STRUCTURE_ID, KEY_ATTRIBUTE_SETS } from "../../constants";
import { IColumnSc, IProduct } from "../../interfaces";

export default ({
  columns,
  datas,
  datasRoot,
}: {
  columns: IColumnSc[];
  datas: IProduct[];
  datasRoot: IProduct[];
}) =>
  columns.filter((col) => {
    const { attributeSets, entityStructureId } = col;

    ///////////////////////////////////////////////////////////
    // mostro quegli attributi che appartengono
    // all'entityStructureId del prodotto selezionato
    const checkEnStrId: boolean = datas.reduce((acc, c) => {
      if (acc) {
        acc = c[KEY_ENTITY_STRUCTURE_ID] === entityStructureId;
      }
      return acc;
    }, true as boolean);

    ///////////////////////////////////////////////////////////
    // mostro quegli attributi non associati a nessun set
    // oppure se hanno un attribute set, questo deve essere
    // associato al set del root del prodotto selezionato
    const checkAttSets: boolean = datasRoot.reduce((acc, dataRoot) => {
      if (acc) {
        const dataRootAttSets =
          (dataRoot && dataRoot[KEY_ATTRIBUTE_SETS]) || [];
        acc =
          isEmpty(attributeSets) ||
          !!dataRootAttSets.find(
            (setRoot) => !!attributeSets.find((setCol) => setCol === setRoot)
          );
      }
      return acc;
    }, true as boolean);

    return checkEnStrId && checkAttSets;
  });
