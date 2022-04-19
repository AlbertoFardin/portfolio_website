import { IMedia } from "../../interfaces";

const getMediaLastUploaded = (medias: IMedia[], view: string): IMedia => {
  const lastOne = medias.reduce((acc, m: IMedia) => {
    const uploaded = acc ? acc.uploaded : 0;
    if (m.view === view && uploaded < m.uploaded) return m;
    return acc;
  }, null);
  return lastOne;
};

export default getMediaLastUploaded;
