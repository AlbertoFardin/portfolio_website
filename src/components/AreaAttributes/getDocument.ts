import { search } from "../../api/fetchesApi";
import { INDEX_NAME } from "../../constants";
import { IAttribute } from "../../interfaces";
import last from "lodash-es/last";

interface IDocument {
  version: number;
  items: IAttribute[];
}

const getDocument = async (): Promise<IDocument> => {
  try {
    const resConf = await search({ index: INDEX_NAME.CONFIG });
    const docuStruc = resConf.items.find((a) => a.id === "attribute_structure");
    const dataStruc = docuStruc.data as {
      version: number;
      items: IAttribute[];
    };
    return {
      version: dataStruc.version,
      items: dataStruc.items.map((a) => ({
        ...a,
        level: last(a.entityPath),
      })),
    };
  } catch (err) {
    console.log("-->", { err });
    return {
      version: 0,
      items: [],
    };
  }
};

export default getDocument;
