import { IReady, IMedia } from "../../interfaces";

const getReadyLast = (ready: IReady[]): IReady => {
  const lastOne = ready.reduce((acc, r: IReady) => {
    const instant = acc ? acc.instant : 0;
    if (instant < r.instant) return r;
    return acc;
  }, null);
  return lastOne;
};

const getMediaLastReady = (
  ready: IReady[],
  medias: IMedia[],
  view: string
): IMedia => {
  const lastReadyArray = medias.reduce((acc, m: IMedia) => {
    if (m.view !== view) return acc;
    const thisFileIdReady = ready.filter((r) => r.contentId === m.fileId);
    const lastReady = getReadyLast(thisFileIdReady);
    if (lastReady) acc.push(lastReady);
    return acc;
  }, []);

  const lastReady = getReadyLast(lastReadyArray);
  if (!lastReady) return null;

  // media messo in "ready" più recente
  return medias.find((m) => m.fileId === lastReady.contentId);
};

export default getMediaLastReady;
