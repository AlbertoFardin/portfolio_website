import {
  AREA_PRODUCTS,
  ID_COLUMNS,
  ID_FIELDS_PANEL_DETAILS,
  ID_FILTERS,
  LAYOUT_GRID,
} from "../../../constants";
import getSetsDocId from "../../../utils/getJsonDocId";
import {
  IColumnSc,
  IColumnsOrderedSet,
  IHashColumnsSets,
  IHashItemsSets,
} from "../../../interfaces";
import { IItemsSet } from "../../../componentsBase/ConfigManagement";

import { IAttribute, IData } from "../interfaces";

import { saveJsonConfigsSet } from "../../../api/fetchesApi";

export const saveHashFiltersSets = async ({
  datas,
  filtersSetInEdit,
  hashFiltersSets,
}: {
  datas: IData[];
  filtersSetInEdit: IItemsSet;
  hashFiltersSets: IHashItemsSets;
}): Promise<IHashItemsSets> => {
  const newItems = datas.reduce((acc, d) => {
    return acc.concat(
      d.attributes.filter((a) => a.filter.enabled).map((a) => ({ id: a.id }))
    );
  }, []);
  hashFiltersSets.itemsSets.forEach((i) => {
    if (i.id === filtersSetInEdit.id) {
      i.items = newItems;
    }
  });
  const { hash, saving } = await saveJsonConfigsSet({
    itemsSets: hashFiltersSets.itemsSets,
    hash: hashFiltersSets.hash,
    docId: getSetsDocId(AREA_PRODUCTS, LAYOUT_GRID, ID_FILTERS),
  });

  return {
    hash,
    itemsSets: hashFiltersSets.itemsSets,
    saving,
  };
};

export const saveHashColumnsSets = async ({
  datas,
  columns,
  columnSetInEdit,
  hashColumnsSets,
}: {
  datas: IData[];
  columns: IColumnSc[];
  columnSetInEdit: IColumnsOrderedSet;
  hashColumnsSets: IHashColumnsSets;
}): Promise<IHashColumnsSets> => {
  const newColumns = datas.reduce((acc, d) => {
    return acc.concat(
      d.attributes.filter((a) => a.column.enabled && a.column.dirty)
    );
  }, [] as IAttribute[]);
  const newColumnsWidth = newColumns.map((a) => {
    const widthDefault = columns.find((c) => c.id === a.id).width;
    return { id: a.id, width: widthDefault };
  });

  // aggiungo in coda all'array precedente le colonne già presenti nel column set
  // per
  // a. mantenere il posizione delle colonne prec selezionate,
  // b. aggiugerle in da a newColumns
  const oldColumnWidth = columnSetInEdit.items.reduce((acc, i) => {
    const allAttributes = datas.reduce(
      (acc, a) => acc.concat(a.attributes),
      [] as IAttribute[]
    );
    if (allAttributes.find((a) => a.id === i.id && a.column.enabled)) {
      acc.push(i);
    }
    return acc;
  }, []);

  const newItems = newColumnsWidth.concat(oldColumnWidth);
  hashColumnsSets.columsnSets.forEach((i) => {
    if (i.id === columnSetInEdit.id) {
      i.items = newItems;
    }
  });
  const { hash, saving } = await saveJsonConfigsSet({
    itemsSets: hashColumnsSets.columsnSets,
    hash: hashColumnsSets.hash,
    docId: getSetsDocId(AREA_PRODUCTS, LAYOUT_GRID, ID_COLUMNS),
  });
  return {
    hash,
    columsnSets: hashColumnsSets.columsnSets,
    saving,
  };
};

export const saveHashFieldsPanelDetailsSet = async ({
  datas,
  fieldsPanelDetailsInEdit,
  hashFieldsPanelDetailsSet,
}: {
  datas: IData[];
  fieldsPanelDetailsInEdit: IItemsSet;
  hashFieldsPanelDetailsSet: IHashItemsSets;
}): Promise<IHashItemsSets> => {
  const newItems = datas.reduce((acc, d) => {
    return acc.concat(
      d.attributes
        .filter((a) => a.detailPanel.enabled)
        .map((a) => ({ id: a.id }))
    );
  }, []);
  hashFieldsPanelDetailsSet.itemsSets.forEach((i) => {
    if (i.id === fieldsPanelDetailsInEdit.id) {
      i.items = newItems;
    }
  });
  const { hash, saving } = await saveJsonConfigsSet({
    itemsSets: hashFieldsPanelDetailsSet.itemsSets,
    hash: hashFieldsPanelDetailsSet.hash,
    docId: getSetsDocId(AREA_PRODUCTS, LAYOUT_GRID, ID_FIELDS_PANEL_DETAILS),
  });

  return {
    hash,
    itemsSets: hashFieldsPanelDetailsSet.itemsSets,
    saving,
  };
};
