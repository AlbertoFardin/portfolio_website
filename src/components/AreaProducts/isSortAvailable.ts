import searchES from "./searchES";
import { IContentSort, IColumnSc, IItemEs, ICategory } from "../../interfaces";
import { composeSortQuery } from "./useSearchEs/getSort";

interface IIsSortAvailable {
  sort: IContentSort;
  catalogId: string;
  languageId: string;
  columns: IColumnSc[];
  categories: IItemEs<ICategory>[];
}

const isSortAvailable = async ({
  sort,
  catalogId,
  languageId,
  columns,
  categories,
}: IIsSortAvailable): Promise<boolean> => {
  // prima di applicare il sort richiesto alla grid provo a fare un sort per tale attributo
  // se questa chiamata fallisce significa che non è presente in ES nessuna entità
  // che ha tale attributo valorizzato e quindi non è possibile applicare il sort alla Grid
  try {
    await searchES(
      {
        size: 0,
        sort: composeSortQuery({
          sorts: [sort],
          columns,
          catalogId,
          languageId,
        }),
      },
      columns,
      categories
    );
    return true;
  } catch {
    return false;
  }
};

export default isSortAvailable;
