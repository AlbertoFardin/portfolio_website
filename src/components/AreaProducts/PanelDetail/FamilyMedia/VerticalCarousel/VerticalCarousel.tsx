import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import * as React from "react";
import TypographyEllipsis from "../../../../../componentsBase/TypographyEllipsis";
import { IMedia } from "../../../../../interfaces";
import { categoryDefault } from "../../../../../constants";
import VerticalCarouselItem from "./VerticalCarouselItem";
import getViewDetail from "../../../getViewDetail";
import * as Colors from "../../../../../componentsBase/style/Colors";
import IVerticalCarousel from "./IVerticalCarousel";

const useStyles = makeStyles({
  verticalCarousel: {
    "overflow-y": "hidden",
    "overflow-x": "hidden",
    position: "relative",
    display: "flex",
    "flex-direction": "column",
    flex: 1,
  },
  scroll: {
    "overflow-y": "overlay",
    "overflow-x": "hidden",
    display: "flex",
    "flex-direction": "column",
    flex: 1,
  },
  category: {
    margin: "0 6px 6px",
    padding: 8,
    display: "flex",
    "flex-direction": "row",
    "align-items": "center",
    "justify-content": "center",
    "border-radius": 5,
    border: `1px solid ${Colors.Gray2}`,
    "background-color": "#fff",
  },
});

const VerticalCarousel = ({
  className,
  colorTheme,
  assetData,
  medias = [],
  mediaSelected,
  onClick,
}: IVerticalCarousel) => {
  const classes = useStyles({});
  const { category } = getViewDetail(assetData, mediaSelected.view);
  return (
    <div
      className={classnames({
        [classes.verticalCarousel]: true,
        [className]: !!className,
      })}
    >
      <div className={classes.scroll}>
        {medias
          .filter(({ filename }) => !!filename)
          .map((m: IMedia) => (
            <VerticalCarouselItem
              key={m.fileId}
              colorTheme={colorTheme}
              assetData={assetData}
              onClick={onClick}
              mediaSelected={mediaSelected}
              media={m}
            />
          ))}
      </div>
      {category === categoryDefault ? null : (
        <div className={classes.category}>
          <TypographyEllipsis variant="body2" children={category} />
        </div>
      )}
    </div>
  );
};

export default VerticalCarousel;
