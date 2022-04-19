import { IProduct, IMedia, IMediaInfo } from "../../../../interfaces";

interface ILayout {
  annotationsSelector: string;
  annotationsEnabled: boolean;
  assetData: IProduct;
  imageId: string;
  histories?: IMedia[][];
  historySelected?: IMedia[];
  historyIndex?: number;
  mediaData: IMediaInfo;
  mediaSelected: IMedia;
  mediaIdReady?: string;
  setFullscreen: (b: boolean) => void;
  setImageId: (s: string) => void;
  fullscreen: boolean;
}

export default ILayout;
