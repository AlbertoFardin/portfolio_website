import * as Colors from "../../componentsBase/style/Colors";
import { IBtn } from "../../componentsBase/Btn";
import { IMedia } from "../../interfaces";

interface IGetBadgeMediaAnnotations {
  media?: IMedia;
  style?: React.CSSProperties;
}

const getBadgeMediaAnnotations = ({
  media,
  style,
}: IGetBadgeMediaAnnotations): IBtn => {
  if (!media || media.annotationsResolved === undefined) return null;

  return {
    color: media.annotationsResolved ? "#ccc" : Colors.Purple,
    tooltip: media.annotationsResolved
      ? "All notes resolved"
      : "Unresolved notes",
    icon: "messenger",
    style,
  };
};

export default getBadgeMediaAnnotations;
