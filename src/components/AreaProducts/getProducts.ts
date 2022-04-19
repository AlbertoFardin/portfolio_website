import { getProduct } from "../../api/fetchesApi";
import { IColumnSc, IItemEs, IProduct, ICategory } from "../../interfaces";
import searchES from "./searchES";

interface IgetProducts {
  ids: string[];
  columns: IColumnSc[];
  categories: IItemEs<ICategory>[];
}

const getProducts = async ({
  ids,
  columns,
  categories,
}: IgetProducts): Promise<IProduct[]> => {
  const { items } = await searchES(
    { query: { terms: { _id: ids } } },
    columns,
    categories
  );

  /*
  if (ids.length === 1) {
    const r = await getProduct(ids[0]);
    console.log({
      dataFromEs: items[0],
      dataFromSc: r,
    });
  }
  */

  return items;
};

export default getProducts;
