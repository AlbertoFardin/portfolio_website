import { ICatalog } from "../../../../../../interfaces";

interface IGetCatalogLabel {
  hover?: boolean;
  catalogsView?: string[];
  catalogsTenant: ICatalog[];
}
const getCatalogLabel = ({
  hover = true,
  catalogsView = [],
  catalogsTenant,
}: IGetCatalogLabel): string => {
  if (
    catalogsTenant.length === 0 ||
    catalogsTenant.length === 1 ||
    catalogsView.length === 0 ||
    catalogsView.length > 1
  ) {
    return "";
  }

  const cat = catalogsTenant.find((c) => c.id === catalogsView[0]);
  return hover ? cat.displayName : "";
};

export default getCatalogLabel;
