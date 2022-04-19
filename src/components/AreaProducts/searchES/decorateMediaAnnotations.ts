import { KEY_MEDIA } from "../../../constants";
import { EsMedia, IMedia } from "../../../interfaces";

const decorateMediaAnnotations = (
  item: EsMedia,
  annotations?: {
    resolved: string[];
    unresolved: string[];
  }
) => {
  const obj = {};
  const medias: IMedia[] = Array.from(item[KEY_MEDIA] || []);
  const annUnresolved = new Set(annotations ? annotations.unresolved : []);
  const annResolved = new Set(annotations ? annotations.resolved : []);

  if (!!medias.length) {
    medias.forEach((media) => {
      const { fileId } = media;
      if (annUnresolved.has(fileId)) {
        media.annotationsResolved = false;
      }
      if (annResolved.has(fileId)) {
        media.annotationsResolved = true;
      }
    });

    obj[KEY_MEDIA] = medias;
  }

  return obj;
};

export default decorateMediaAnnotations;
