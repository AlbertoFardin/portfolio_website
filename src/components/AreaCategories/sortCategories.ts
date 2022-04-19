import { IItemEs, ICategory } from "../../interfaces";

interface IItemEsNodeCategory extends IItemEs<ICategory> {
  children: IItemEsNodeCategory[];
}

interface ICatalog {
  id: string;
  categories: IItemEsNodeCategory[];
}

interface IAttributeStructureId {
  id: string;
  catalogs: ICatalog[];
}

const buildTreeINodeCategory = (
  iCategoryByAttributeIdByCatalogByRoot: IItemEs<ICategory>[]
): IItemEsNodeCategory => {
  const idMapping = iCategoryByAttributeIdByCatalogByRoot.reduce(
    (acc, el, i) => {
      acc[el.data.id] = i;
      return acc;
    },
    {}
  );

  const iItemEsNodeCategory: IItemEsNodeCategory[] = iCategoryByAttributeIdByCatalogByRoot.map(
    (o) => ({ ...o, children: [] })
  );

  let root: IItemEsNodeCategory;
  iItemEsNodeCategory.forEach((el) => {
    // Handle the root element
    if (el.data.parent === null) {
      root = el;
      return;
    }
    // Use our mapping to locate the parent element in our data array
    const parentEl = iItemEsNodeCategory[idMapping[el.data.parent]];
    // Add our current el to its parent's `children` array
    parentEl.children = [...(parentEl.children || []), el].sort((a, b) => {
      if (a.data.displayOrder < b.data.displayOrder) return -1;
      if (a.data.displayOrder > b.data.displayOrder) return +1;
      if (a.data.displayOrder === b.data.displayOrder) {
        return a.data.id < b.data.id ? -1 : +1;
      }
    });
  });
  return root;
};

const buildINodeCategories = (
  data: IItemEs<ICategory>[]
): IItemEsNodeCategory[] => {
  const categories: IItemEsNodeCategory[] = [];
  // ogni category ha i nodi con lo stesso root
  const arrayUniqueRootCategory = Array.from(
    new Set(data.map((o) => o.data.root))
  );

  for (let j = 0; j < arrayUniqueRootCategory.length; j++) {
    const iCategoryByAttributeIdByCatalogByRoot = data.filter(
      (o) => o.data.root === arrayUniqueRootCategory[j]
    );
    const category = buildTreeINodeCategory(
      iCategoryByAttributeIdByCatalogByRoot
    );
    categories.push(category);
  }
  return categories;
};

const buildTreeAttributeStructure = (
  array: IItemEs<ICategory>[]
): IAttributeStructureId[] => {
  const result: IAttributeStructureId[] = [];
  const arrayUniqueAttributeSet = Array.from(
    new Set(array.map((o) => o.data.attributeStructureId))
  );

  for (let i = 0; i < arrayUniqueAttributeSet.length; i++) {
    const catalogs: ICatalog[] = [];
    const iCategoryByAttributeId = array.filter(
      (o) => o.data.attributeStructureId === arrayUniqueAttributeSet[i]
    );
    const arrayUniqueCatalogs = Array.from(
      new Set(array.map((o) => o.data.catalog))
    ).sort((a, b) => (a < b ? -1 : 1));

    for (let j = 0; j < arrayUniqueCatalogs.length; j++) {
      const idCatalog = arrayUniqueCatalogs[j];
      const iCategoryByAttributeIdByCatalog = iCategoryByAttributeId.filter(
        (o) => o.data.catalog === idCatalog
      );
      const iCatalog = {
        id: idCatalog,
        categories: buildINodeCategories(iCategoryByAttributeIdByCatalog),
      };
      catalogs.push(iCatalog);
    }
    result.push({ id: arrayUniqueAttributeSet[i], catalogs });
  }
  return result;
};

const depthFirstSearch = (
  item: IItemEsNodeCategory,
  result: IItemEs<ICategory>[],
  depth = 1
) => {
  result.push({ id: item.id, data: { ...item.data, depth } });

  const nDepth = depth + 1;
  for (let i = 0; i < item.children.length; i++) {
    depthFirstSearch(item.children[i], result, nDepth);
  }
};

const sortCategories = (array: IItemEs<ICategory>[]): IItemEs<ICategory>[] => {
  const r = buildTreeAttributeStructure(array);

  const result: IItemEs<ICategory>[] = [];
  for (let i = 0; i < r.length; i++) {
    const iAttributeStructureId = r[i];
    for (let j = 0; j < iAttributeStructureId.catalogs.length; j++) {
      const iCatalog = iAttributeStructureId.catalogs[j];
      for (let k = 0; k < iCatalog.categories.length; k++) {
        depthFirstSearch(iCatalog.categories[k], result);
      }
    }
  }
  return result;
};

export default sortCategories;
