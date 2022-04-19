import isEmpty from "lodash-es/isEmpty";
import IMultiReadyCatalog from "../IMultiReadyCatalog";
import IMultiReadyView from "../IMultiReadyView";

/**
 * Function that return a new array of catalogs configurations disabled/enabled.
 * a catalog will be enabled if there aren't selected view in ready for that catalog.
 */
const checkCatalogsDisabled = (
  catalogs: IMultiReadyCatalog[],
  views: IMultiReadyView[]
): IMultiReadyCatalog[] => {
  return catalogs.map((c: IMultiReadyCatalog) => {
    const { id, selected, viewsReady } = c;

    // if there aren't ready for this catalog -> nothing changed return catalog
    if (!selected || isEmpty(viewsReady)) return c;

    const viewsReadySet = new Set(viewsReady);

    // if all view in Ready of this catalog are deselected -> return catalog enabled
    const viewsReadySelected = views.filter((v: IMultiReadyView) => {
      return id === v.catalog && v.selected && viewsReadySet.has(v.view);
    });

    return {
      ...c,
      disabled: !isEmpty(viewsReadySelected),
    };
  });
};

export default checkCatalogsDisabled;
