import * as React from "react";
import * as Colors from "../../../../../componentsBase/style/Colors";
import isEmpty from "lodash-es/isEmpty";
import makeStyles from "@material-ui/core/styles/makeStyles";
import ButtonBase from "@material-ui/core/ButtonBase";
import Icon from "@material-ui/core/Icon";
import {
  IMedia,
  IProduct,
  IViewConf,
  IViewData,
} from "../../../../../interfaces";
import TypographyEllipsis from "../../../../../componentsBase/TypographyEllipsis";
import { colorTheme, KEY_MEDIA, KEY_VIEW_DATA } from "../../../../../constants";
import mixColors from "../../../../../componentsBase/utils/mixColors";
import Preview from "../../../../../componentsBase/Preview";
import Tooltip from "../../../../../componentsBase/Tooltip";
import { getSrcType, getSrcUrl } from "../../FamilyMedia/getSrc";
import { ContextViews } from "../../../contexts";

const stylePreviewIcon: React.CSSProperties = { fontSize: 20 };
const stylePreview: React.CSSProperties = { width: 50, height: 50 };
const getMedia = (
  confViews: IViewConf[],
  dataViews: IViewData[],
  dataMedia: IMedia[]
): IMedia => {
  if (isEmpty(dataViews)) return undefined;
  if (isEmpty(dataMedia)) return undefined;

  return confViews.reduce((acc: IMedia, { viewName }) => {
    // se ho già trovato un media esco dal ciclo
    if (!!acc) return acc;

    // se il data non possiede la vista in questione esco dal ciclo
    const view = dataViews.find((v) => viewName === v.viewName);
    if (!view) return acc;

    // se il data non possiede media per la vista in questione esco dal ciclo
    const media = dataMedia.find((m) => viewName === m.view);
    if (!media) return acc;

    return media;
  }, undefined);
};
const getTooltip = (views: IViewData[], media: IMedia): string => {
  if (isEmpty(views)) return "No view avaiable";
  if (isEmpty(media)) return "No media avaiable";
  return "";
};
const getIcon = (views: IViewData[]): string => {
  if (isEmpty(views)) return undefined;
  return "image_not_supported";
};

interface IStyles {
  selected: boolean;
}
const useStyles = makeStyles({
  listitem: {
    display: "flex",
    "flex-direction": "row",
    "align-items": "stretch",
    margin: "5px 0",
  },
  media: {
    border: `1px solid ${Colors.Gray3}`,
    "border-radius": 5,
    "margin-right": 5,
  },
  label: {
    flex: 1,
  },
  check: {
    "border-radius": 5,
    color: mixColors(0.5, "#ffffff", colorTheme),
    padding: 5,
    margin: "0 3px",
  },
  checkIcon: {
    color: ({ selected }: IStyles) => (selected ? colorTheme : Colors.Gray2),
    "font-size": "18px !important",
  },
});

interface ILinksListItem {
  data: IProduct;
  selected: boolean;
  readOnly: boolean;
  onClick: (id: string) => void;
}

const LinksListItem = ({
  data,
  selected,
  readOnly,
  onClick,
}: ILinksListItem) => {
  const classes = useStyles({ selected });
  const dataMedia: IMedia[] = (data[KEY_MEDIA] || []).sort((a, b) => {
    if (a.uploaded < b.uploaded) return 1;
    if (a.uploaded > b.uploaded) return -1;
    return 0;
  });
  const dataViews: IViewData[] = data[KEY_VIEW_DATA] || [];
  const confViews = React.useContext(ContextViews);
  const media = getMedia(confViews, dataViews, dataMedia);
  const onCheckClick = React.useCallback(() => {
    onClick(data.id);
  }, [data.id, onClick]);

  return (
    <div className={classes.listitem}>
      {readOnly ? null : (
        <ButtonBase className={classes.check} onClick={onCheckClick}>
          <Icon
            className={classes.checkIcon}
            children={selected ? "check_box" : "check_box_outline_blank"}
          />
        </ButtonBase>
      )}
      <Tooltip title={getTooltip(dataViews, media)}>
        <div>
          <Preview
            className={classes.media}
            srcType={getSrcType(media)}
            srcUrl={getSrcUrl(media, data)}
            placeholderIcon={getIcon(dataViews)}
            placeholderIconStyle={stylePreviewIcon}
            style={stylePreview}
          />
        </div>
      </Tooltip>
      <TypographyEllipsis
        className={classes.label}
        variant="body1"
        children={data.id}
      />
    </div>
  );
};

export default LinksListItem;
