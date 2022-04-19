import { Category, MediaType } from "../../../interfaces";

const getMostRecentMediaContent = (
  mediaContents: {
    fileId: string;
    customName: string;
    uploaded: number;
    path: string[];
    mediaType: MediaType;
    category: Category;
  }[]
): {
  fileId: string;
  customName: string;
  uploaded: number;
  path: string[];
  mediaType: MediaType;
  category: Category;
}[] => {
  const keyValue: {
    [key: string]: {
      fileId: string;
      customName: string;
      uploaded: number;
      path: string[];
      mediaType: MediaType;
      category: Category;
    }[];
  } = {};
  for (const m of mediaContents) {
    const composedKey = `${m.customName}_${m.mediaType}_${m.category}`;
    if (!keyValue[composedKey]) {
      keyValue[composedKey] = [m];
    } else {
      keyValue[composedKey].push(m);
    }
  }
  const result: {
    fileId: string;
    customName: string;
    uploaded: number;
    path: string[];
    mediaType: MediaType;
    category: Category;
  }[] = [];
  for (const k in keyValue) {
    const medias = keyValue[k];
    medias.sort((a, b) => b.uploaded - a.uploaded);
    result.push(medias[0]);
  }
  return result;
};

export default getMostRecentMediaContent;
