import { KEY_CATALOG, KEY_VIEW_DATA } from "../../../constants";
import {
  IProduct,
  IViewConf,
  IViewToAdd,
  IDataModifiedView,
} from "../../../interfaces";
import { IViewDraft, ViewStatus } from "./reducer";

const composeJsonToSave = (
  items: IProduct[],
  views: IViewDraft[],
  tenantViews: IViewConf[]
): IDataModifiedView[] => {
  const setRemove = new Set([ViewStatus.REMOVE, ViewStatus.MODIFY]);
  const setAdd = new Set([ViewStatus.CREATE, ViewStatus.MODIFY]);

  const remove = views.reduce((acc, viewDraft) => {
    const { id, status } = viewDraft;
    if (setRemove.has(status)) acc.push(id);
    return acc;
  }, []);

  return items.map((item) => {
    const add = views.reduce((acc: IViewToAdd[], viewDraft) => {
      const { id, status, data } = viewDraft;
      const viewConf = tenantViews.find((v) => v.viewName === id);
      const viewData = (item[KEY_VIEW_DATA] || []).find(
        (v) => v.viewName === id
      );

      if (setAdd.has(status)) {
        const setCatalog = new Set(item[KEY_CATALOG] || []);
        acc.push({
          viewName: id,
          category: viewConf.category || viewData.category,
          viewType: data.viewType || viewData.viewType,
          mediaType: data.mediaType || viewData.mediaType,
          catalogs: data.catalog
            ? data.catalog.filter((c) => setCatalog.has(c))
            : viewData.catalog,
        });
      }

      return acc;
    }, []);

    return {
      entityId: item.id,
      add,
      remove,
      version: item.version,
    };
  });
};

export default composeJsonToSave;
