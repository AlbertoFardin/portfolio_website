import { KEY_VIEW_DATA } from "../../../../constants";
import { IProduct, IViewData } from "../../../../interfaces";
import sortByKey from "../../../../utils/sortByKey";
import IView from "./IView";

const getViews = (items: IProduct[]): IView[] => {
  const views = items.reduce((acc, item) => {
    const viewsSet = new Set(acc.map(({ view }) => view));
    const viewsData = Array.from(item[KEY_VIEW_DATA] || []) as IViewData[];

    sortByKey(viewsData, "viewName");

    viewsData.forEach((vs: IViewData) => {
      const { viewName, category } = vs;
      if (!viewsSet.has(vs.viewName)) {
        acc.push({
          id: viewName,
          view: viewName,
          category,
        });
      }
    });

    return acc;
  }, [] as IView[]);

  sortByKey(views, "category");

  return views;
};

export default getViews;
