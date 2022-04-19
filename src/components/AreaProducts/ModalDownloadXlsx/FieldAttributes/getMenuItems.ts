import { ICatalog } from "../../../../interfaces";
import IAttributeMenuItem from "./IAttributeMenuItem";

const getIcon = (s: boolean): string =>
  s ? "check_box" : "check_box_outline_blank";

interface IGetMenuItems {
  id: string;
  idsSelected: string[];
  catalogs: ICatalog[];
  multiCatalog: boolean;
  multiLanguage: boolean;
  scope: string[];
  onClick: (id: string) => void;
}

const getMenuItems = ({
  id,
  idsSelected,
  catalogs,
  multiCatalog,
  multiLanguage,
  scope,
  onClick,
}: IGetMenuItems): IAttributeMenuItem[] => {
  const slc = new Set(idsSelected);

  const catalogInScope = catalogs.filter((c) => {
    if (!scope.length) return true;
    return !!scope.find((catId) => catId === c.id);
  });

  if (multiCatalog && !multiLanguage) {
    return catalogInScope.map((c) => {
      const itemId = id + ".(" + c.id + ")";
      const selected = slc.has(itemId);
      const item: IAttributeMenuItem = {
        id: itemId,
        label: c.displayName,
        icon: getIcon(selected),
        onClick,
        selected,
      };
      return item;
    });
  }

  if (multiCatalog && multiLanguage) {
    return catalogInScope.reduce((acc, c) => {
      const itemCatalog: IAttributeMenuItem = {
        id: id + ".(" + c.id + ")",
        label: c.displayName,
        title: true,
      };
      acc.push(itemCatalog);
      c.languages.forEach((langId) => {
        const itemId = id + ".(" + c.id + ").(" + langId + ")";
        const selected = slc.has(itemId);
        const item: IAttributeMenuItem = {
          id: itemId,
          label: langId.toLocaleUpperCase(),
          icon: getIcon(selected),
          onClick,
          selected,
        };
        acc.push(item);
      });
      return acc;
    }, []);
  }

  return [];
};

export default getMenuItems;
