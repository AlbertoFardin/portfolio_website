import makeStyles from "@material-ui/core/styles/makeStyles";
import * as React from "react";
import ISheetContent from "../ISheetContent";
import AssetPreview from "../../../../componentsBase/AssetPreview";
import { colorTheme } from "../../../../constants";
import getFileIcon from "../../../AreaFiles/getFileIcon";
import { typeVideo } from "../../../../mimeTypes";
import apiUrls from "../../../../api/endpoints";
import { PreviewType } from "../../../../componentsBase/Preview";
import * as Colors from "../../../../componentsBase/style/Colors";
import { ACTION as ACT_V } from "../../reducer";
import MediaInfo from "../MediaInfo";
import { useLocation } from "react-router-dom";
import { SheetLayout } from "../../../../interfaces";

const previewSize = 380;
const useStyles = makeStyles({
  sheetDefault: {
    height: "100%",
    flex: 1,
    "overflow-x": "hidden",
    "overflow-y": "overlay",
    position: "relative",
  },
});

const LayoutDefault = ({ dispatchViewport, assetData }: ISheetContent) => {
  const location = useLocation();
  const classes = useStyles({});
  const { id, documentRepoId, mimeType } = assetData;
  const icon = getFileIcon(mimeType);
  const isVideo = new Set(typeVideo).has(mimeType);
  const rendition = isVideo ? "LQ" : "l";
  const srcUrl = apiUrls.getRenditionPublic.url(
    location.search.replace("?link=", ""),
    documentRepoId,
    rendition
  );
  const srcType = isVideo ? PreviewType.VIDEO : PreviewType.IMAGE;
  const onDoubleClick = React.useCallback(() => {
    dispatchViewport({
      type: ACT_V.SHEET_LAYOUT,
      layout: SheetLayout.FULLSCREEN,
    });
  }, [dispatchViewport]);

  return (
    <div className={classes.sheetDefault}>
      <AssetPreview
        colorTheme={colorTheme}
        id={id}
        srcUrl={srcUrl}
        srcType={srcType}
        placeholderIcon={icon}
        style={{
          width: previewSize,
          height: previewSize,
          margin: "20px auto",
          border: 0,
          backgroundColor: Colors.Gray4,
        }}
        onDoubleClick={onDoubleClick}
      />
      <MediaInfo assetData={assetData} fullscreen={false} />
    </div>
  );
};

export default LayoutDefault;
