import { IItemEs, ICategory } from "../../interfaces";

interface IGetCategoryPath {
  categoryId: string;
  languageId: string;
  categories: IItemEs<ICategory>[];
}

const getCategoryPath = (
  { categoryId, languageId, categories }: IGetCategoryPath,
  pathToConcat = ""
): string => {
  const category = categories.find((c) => c.id === categoryId);

  //
  // se non trovo la category significa che l'id passato è sbagliato
  // o la category è stata eliminata, quindi non posso sapere il path
  if (!category) return "";

  const { attributeStructureId, catalog, labels, parent } = category.data;
  const label = labels[languageId];
  if (!label) return undefined;

  const path = label + (!pathToConcat ? "" : " > ") + pathToConcat;

  //
  // se la category non ha parent significa che la category è una root
  // quindi il path costruito è completo
  if (!parent) return path;

  //
  // se la category ha parent significa che bisogna trovare
  // la category padre per concatenarla al path completo
  const categoryParent = categories.find(
    (c) =>
      c.data.attributeStructureId === attributeStructureId &&
      c.data.catalog === catalog &&
      c.data.id === parent
  );

  return getCategoryPath(
    { categoryId: categoryParent.id, languageId, categories },
    path
  );
};

export default getCategoryPath;
