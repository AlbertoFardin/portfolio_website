import * as React from "react";
import WebViewer from "@pdftron/webviewer";
import IViewer from "./IViewer";
import { BASE_URL } from "../../../../api/endpoints";
import { Service } from "../../../../interfaces";

const ViewerDocument = ({ assetData }: IViewer) => {
  const viewer = React.useRef(null);

  React.useEffect(() => {
    fetch(
      `${BASE_URL}/${Service.DIGITALASSETS}/media-content/${assetData.documentRepoId}?redirect=false`,
      { credentials: "include" }
    )
      .then((res) => {
        return res.json();
      })
      .then((url) => {
        WebViewer(
          {
            path: "/webviewer/lib",
          },
          viewer.current
        ).then((instance) => {
          const documentViewer = instance.Core.documentViewer;
          documentViewer.loadDocument(url, {
            filename: assetData.name,
          });
        });
      });
    /*

    */
  }, [assetData.documentRepoId, assetData.name]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="webviewer" style={{ height: "100%" }} ref={viewer}></div>
    </div>
  );
};

export default ViewerDocument;
