import { IReady, ContentType } from "../interfaces";
import sortByKey from "./sortByKey";

interface IGetCatalogsByContentId {
  catalogs: IReady[];
  contentId: string;
  contentType?: ContentType;
}
const getCatalogsByContentId = ({
  catalogs = [],
  contentId = "",
  contentType = ContentType.MEDIA,
}: IGetCatalogsByContentId): IReady[] => {
  let res = Array.from(catalogs);

  // sort catalog label
  res = sortByKey(res, "catalog");

  // filter catalog with id and media
  res = res.filter(
    (c: IReady) => c.contentId === contentId && c.contentType === contentType
  );

  return res;
};

export default getCatalogsByContentId;
