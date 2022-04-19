import { KEY_READY, KEY_MEDIA } from "../../../../constants";
import { IProduct, IReady, ContentType, IMedia } from "../../../../interfaces";

/**
 * Function that return an array of view in which that catalog is in ready
 */
const getViewsReady = (catalogId: string, items: IProduct[]): string[] => {
  const viewsReady = items.reduce((acc, item: IProduct) => {
    const set = new Set(acc);
    const ready = (item[KEY_READY] || []) as IReady[];
    const media = (item[KEY_MEDIA] || []) as IMedia[];

    ready.forEach((r: IReady) => {
      const { catalog, contentId, contentType } = r;
      const isCatalog = catalog === catalogId;
      const isMedia = contentType === ContentType.MEDIA;
      const mediaReady = media.find((m) => m.fileId === contentId);
      if (isCatalog && isMedia && !!mediaReady && !set.has(mediaReady.view)) {
        acc.push(mediaReady.view);
      }
    });

    return acc;
  }, [] as string[]);

  viewsReady.sort();

  return viewsReady;
};

export default getViewsReady;
