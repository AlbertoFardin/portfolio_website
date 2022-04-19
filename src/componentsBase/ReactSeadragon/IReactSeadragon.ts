import * as OpenSeadragon from "openseadragon";

export default interface IReactSeadragon {
  /** (see [OpenSeadragon.Options](http://openseadragon.github.io/docs/OpenSeadragon.html#.Options)) */
  optionsSeadragon?: OpenSeadragon.Options;
  /** component CSS classes*/
  className?: string;
  /** component CSS style */
  style?: React.CSSProperties;
}
