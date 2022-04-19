import { IProduct, IMedia } from "../../../../../interfaces";

interface IVerticalCarousel {
  className?: string;
  colorTheme: string;
  medias?: IMedia[];
  mediaSelected: IMedia;
  assetData: IProduct;
  onClick: (a: IMedia) => void;
}

export default IVerticalCarousel;
