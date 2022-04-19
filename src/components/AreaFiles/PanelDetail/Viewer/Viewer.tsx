import * as React from "react";
import ViewerVideo from "./ViewerVideo";
import ViewerImage from "./ViewerImage";
import ViewerPlaceholder from "./ViewerPlaceholder";
import ViewerDocument from "./ViewerDocument";
import { ContextCurrentUser } from "../../../contexts";
import { typeDocument, typeImage, typeVideo } from "../../../../mimeTypes";
import IViewer from "./IViewer";

const Viewer = ({ assetData }: IViewer) => {
  const { tenantId } = React.useContext(ContextCurrentUser);
  const { mimeType } = assetData;

  if (new Set(typeVideo).has(mimeType)) {
    return <ViewerVideo assetData={assetData} />;
  }

  if (new Set(typeImage).has(mimeType)) {
    return <ViewerImage assetData={assetData} />;
  }

  if (tenantId === "DEMO" && new Set(typeDocument).has(mimeType)) {
    return <ViewerDocument assetData={assetData} />;
  }

  return <ViewerPlaceholder assetData={assetData} />;
};

export default Viewer;
