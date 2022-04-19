import { KEY_VIEW_DATA } from "../../../../constants";
import { IProduct, ICatalog, IViewData } from "../../../../interfaces";
import IMultiReadyCatalog from "../IMultiReadyCatalog";
import getViewsReady from "./getViewsReady";

/**
 * Function that return catalogs configurations to create checkboxes.
 * It cycles on items, looking at the available catalogs of the tenant,
 * to obtain all the catalogs configurations in which it is possible to set medias in Ready Status
 */
const getMultiReadyCatalogs = (
  items: IProduct[],
  catalogs: ICatalog[]
): IMultiReadyCatalog[] => {
  const tenantSingleCatalog = catalogs.length === 1;
  const setCatalogIds = new Set([]);

  // get all avaible catalog ids from the items
  items.forEach((item: IProduct) => {
    const viewsStatus = item[KEY_VIEW_DATA] || [];
    viewsStatus.forEach(({ catalog }: IViewData) => {
      (catalog || []).forEach((cat: string) => {
        if (!setCatalogIds.has(cat)) setCatalogIds.add(cat);
      });
    });
  }, []);

  const catalogIds = Array.from(setCatalogIds);
  // sort catalogs ids
  catalogIds.sort();

  // get catalog configurations
  const catalogConfs = catalogIds.reduce((acc, catId) => {
    // check if catalog in the items exits in tenants
    const catalogInit = catalogs.find(({ id }: ICatalog) => catId === id);

    // if at least one media is Ready for this catalog, the this checkbox must be selected and disabled
    const viewsReady = getViewsReady(catId, items);

    if (catalogInit) {
      acc.push({
        id: catalogInit.id,
        displayName: catalogInit.displayName,
        languages: catalogInit.languages,
        fallback: catalogInit.fallback,
        viewsReady,
        disabled: !!viewsReady.length,
        selected: tenantSingleCatalog ? true : !!viewsReady.length,
      });
    }
    return acc;
  }, [] as IMultiReadyCatalog[]);

  return catalogConfs;
};

export default getMultiReadyCatalogs;
