import { IMedia } from "../../interfaces";

const getMediaPlaceholder = (medias: IMedia[], view: string): IMedia => {
  return medias.find((m: IMedia) => {
    return m.view === view && !m.filename;
  });
};

export default getMediaPlaceholder;
