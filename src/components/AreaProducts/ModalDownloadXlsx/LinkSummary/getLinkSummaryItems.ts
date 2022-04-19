import { ATT_NO_LANG_LABEL } from "../../PanelDetail/constants";
import { IColumnSc, ICatalog } from "../../../../interfaces";
import { getAttributeId } from "../../getAttributeKey";
import IAttributeMenuItem from "../FieldAttributes/IAttributeMenuItem";

const idGlobal = "global";
interface IMenuItem {
  id: string;
  label: string;
}

const getMenuLabel = (
  label: string,
  catalogId: string,
  languageId: string
): string => {
  if (!catalogId) return label;
  if (!languageId) return label + " -> " + ATT_NO_LANG_LABEL;
  return label + " -> " + languageId.toLocaleUpperCase();
};

const getLinkSummaryItems = (
  columns: IColumnSc[],
  catalogs: ICatalog[],
  attributesSelected: string[],
  onClick?: (id: string) => void
): IAttributeMenuItem[] => {
  const objCatalogItems = attributesSelected.reduce(
    (acc: { [k: string]: IMenuItem[] }, attId) => {
      const { id, catalogId, languageId } = getAttributeId(attId);
      const column = columns.find((c) => c.id === id);
      const groupId = catalogId || idGlobal;

      if (column) {
        if (!acc[groupId]) acc[groupId] = [];
        acc[groupId].push({
          id: attId,
          label: getMenuLabel(column.label, catalogId, languageId),
        });
      }

      return acc;
    },
    {}
  );

  const getMenuItems = (array: IMenuItem[]): IAttributeMenuItem[] => {
    return array
      .sort((a, b) => {
        if (a.id > b.id) return 1;
        if (a.id < b.id) return -1;
        return 0;
      })
      .map((c) => {
        return {
          id: c.id,
          label: c.label,
          icon: !onClick ? " " : "close",
          onClick,
        };
      }, []);
  };

  const attributesMenuItems: IAttributeMenuItem[] = Object.keys(objCatalogItems)
    .filter((catalogId: string) => {
      return catalogId !== idGlobal;
    })
    .reduce((acc: IAttributeMenuItem[], catalogId: string) => {
      const items = getMenuItems(objCatalogItems[catalogId]);
      const catalog = catalogs.find((c) => c.id === catalogId);
      const menuTitle = {
        title: true,
        id: catalogId,
        label: catalog
          ? catalog.displayName
          : `Not found (catalogId: ${catalogId})`,
      };
      return [].concat(acc, [menuTitle], items);
    }, []);

  if (!!objCatalogItems[idGlobal]) {
    // positiono idGlobal come primo gruppo nell'array
    const menuTitle = {
      title: true,
      id: idGlobal,
      label: "Global",
    };
    const menuItems = getMenuItems(objCatalogItems[idGlobal]);
    return [].concat([menuTitle], menuItems, attributesMenuItems);
  }

  return attributesMenuItems;
};

export default getLinkSummaryItems;
