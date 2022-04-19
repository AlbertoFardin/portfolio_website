import { IProduct, IMedia } from "../../../../interfaces";
import getViewMedias from "./getViewMedias";

const getMediasGroupped = (assetData: IProduct): IMedia[][] => {
  const medias = getViewMedias(assetData);
  const mediaGroupsByView: { [view: string]: IMedia[] } = medias.reduce(
    (acc, media) => {
      if (!acc[media.view]) acc[media.view] = [];
      acc[media.view].push(media);
      return acc;
    },
    {}
  );

  return Object.keys(mediaGroupsByView)
    .sort()
    .map((view) => {
      return mediaGroupsByView[view]
        .sort((a, b) => {
          if (a.uploaded > b.uploaded) return 1;
          if (a.uploaded < b.uploaded) return -1;
          return 0;
        })
        .reverse();
    });
};

export default getMediasGroupped;
