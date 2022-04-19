import { IColumnSc, IColumnExportTmp } from "../../../interfaces";
import { getAttributeId } from "../getAttributeKey";

const getColumnsTemplate = (
  columns: IColumnSc[],
  selectedIds: string[]
): IColumnExportTmp[] => {
  const columnsId = Array.from(
    new Set(selectedIds.map((s) => getAttributeId(s).id))
  );

  return columnsId.map((columnId) => {
    const column = columns.find((c) => c.id === columnId);
    const {
      label,
      attributeStructureId,
      attributeType,
      multiCatalog,
      multiLanguage,
    } = column;
    const columnTmp: IColumnExportTmp = {
      attributeStructureId,
      label,
      attributeType,
    };

    if (multiCatalog || multiLanguage) {
      columnTmp.catalogsAndLanguages = selectedIds.reduce((acc, selectedId) => {
        const { id, catalogId, languageId } = getAttributeId(selectedId);

        if (id !== columnId) return acc;

        if (!catalogId) return acc;
        if (!acc[catalogId]) acc[catalogId] = [];

        if (!languageId) return acc;
        acc[catalogId].push(languageId);

        return acc;
      }, {});
    }

    return columnTmp;
  });
};

export default getColumnsTemplate;
