import { KEY_VIEW_DATA } from "../../../../constants";
import { IProduct, IViewData } from "../../../../interfaces";
import sortByKey from "../../../../utils/sortByKey";
import IMultiReadyView from "../IMultiReadyView";

interface IViewCatalogs {
  viewName: string;
  catalog: string[];
  category: string;
}

/**
 * Function that return views configurations to create checkboxes.
 * It cycles on items' viewsStatus
 */
const getMultiReadyViews = (items: IProduct[]): IMultiReadyView[] => {
  const viewsCatalogs = items.reduce((acc, item) => {
    const viewsSet = new Set(acc.map(({ viewName }) => viewName));
    const viewsData = Array.from(item[KEY_VIEW_DATA] || []) as IViewData[];

    sortByKey(viewsData, "viewName");

    viewsData.forEach((vs: IViewData) => {
      const { catalog, viewName, category } = vs;
      if (!viewsSet.has(vs.viewName)) acc.push({ catalog, viewName, category });
    });

    return acc;
  }, [] as IViewCatalogs[]);

  const views = viewsCatalogs.reduce((acc, vs) => {
    vs.catalog.forEach((catalog) => {
      acc.push({
        id: `${catalog}_${vs.viewName}`,
        view: vs.viewName,
        catalog,
        category: vs.category,
        selected: true,
      });
    });
    return acc;
  }, [] as IMultiReadyView[]);

  sortByKey(views, "catalog");

  return views;
};

export default getMultiReadyViews;
