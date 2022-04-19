import isEmpty from "lodash-es/isEmpty";
import { INDEX_NAME } from "../constants";
import { IFilter, IColumnSc, IViewConf, IEntityType } from "../interfaces";
import { IElasticResult } from "../utils/elasticsearch";
import { search } from "./fetchesApi";

interface IConfig {
  views: IViewConf[];
  filters: IFilter[];
  columns: IColumnSc[];
  entityTypes: IEntityType[];
}

const getConfigurationFilters = (
  index: string,
  res: IElasticResult<{ items: IFilter[] }>
): IFilter[] => {
  const filters = res.items.find((a) => a.id === `facets_${index}`).data;
  return filters.items;
};

const getConfigurationColumns = (
  index: string,
  res: IElasticResult<{ items: IColumnSc[] }>
): IColumnSc[] => {
  const columns = res.items.find((a) => a.id === `columns_${index}`).data;
  return columns.items;
};

const getConfigurationViews = (res: IElasticResult<{ items: IViewConf[] }>) => {
  const view = res.items.find((a) => a.id === "views").data;
  if (isEmpty(view) || !view.items) return [];
  return (view.items as IViewConf[]).sort((a, b) => {
    // ordino le viste per priorità
    if (a.priority > b.priority) return 1;
    if (a.priority < b.priority) return -1;

    // se le viste non hanno priorità perché non configurata
    // ordino le viste alfabeticamente
    if (a.viewName > b.viewName) return 1;
    if (a.viewName < b.viewName) return -1;

    return 0;
  });
};

const getConfigurationEntityTypes = (
  res: IElasticResult<{
    items: { id: string; entityType: string; level: number }[];
  }>
): IEntityType[] => {
  const data = res.items.find((a) => a.id === "entity_structure").data;
  return data.items
    .sort((a, b) => {
      if (a.level > b.level) return 1;
      if (a.level < b.level) return -1;
      return 0;
    })
    .map((f) => {
      const entityType: IEntityType = {
        id: f.entityType,
        label: f.entityType,
        level: f.level,
        struc: f.id,
      };
      return entityType;
    });
};

const getConfig = async (index: string): Promise<IConfig> => {
  const resConf = await search({ index: INDEX_NAME.CONFIG });
  let views = [];
  let filters = [];
  let columns = [];
  let entityTypes = [];

  if (!isEmpty(resConf.items)) {
    filters = getConfigurationFilters(
      index,
      resConf as IElasticResult<{ items: IFilter[] }>
    );
    columns = getConfigurationColumns(
      index,
      resConf as IElasticResult<{ items: IColumnSc[] }>
    );
    views = getConfigurationViews(
      resConf as IElasticResult<{ items: IViewConf[] }>
    );
    entityTypes = getConfigurationEntityTypes(
      resConf as IElasticResult<{ items }>
    );
  }

  return {
    views,
    filters,
    columns,
    entityTypes,
  };
};

export const getConfigTabular = async (): Promise<IConfig> => {
  const res = await getConfig(INDEX_NAME.TABULAR);
  return res;
};

export const getConfigStagingarea = async (): Promise<IConfig> => {
  const res = await getConfig(INDEX_NAME.STAGINGAREA);
  return res;
};
