import { ICatalog } from "../interfaces";

interface ICountRes {
  countCatalogs: number;
  countLanguages: number;
  allCatalogs: string[];
  allLanguages: string[];
}

const getCatalogsCount = (catalogs: ICatalog[]): ICountRes => {
  const allCatalogs = [];
  const allLanguages = [];
  let countCatalogs = 0;
  let countLanguages = 0;

  // conto i cataloghi e le lingue presenti
  catalogs.forEach(({ id, languages }: ICatalog) => {
    allCatalogs.push(id);
    countCatalogs += 1;
    (languages || []).forEach((lang: string) => {
      if (!new Set(allLanguages).has(lang)) {
        allLanguages.push(lang);
        countLanguages += 1;
      }
    });
  });

  return {
    countCatalogs,
    countLanguages,
    allCatalogs,
    allLanguages,
  };
};

export default getCatalogsCount;
