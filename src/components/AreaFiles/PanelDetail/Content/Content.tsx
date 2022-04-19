import * as React from "react";
import Divider from "@material-ui/core/Divider";
import Group from "./Group";
import InfoCopyright from "./InfoCopyright";
import InfoGeneral from "./InfoGeneral";
import InfoShare from "./InfoShare";
import { IFileDetail, IMediaInfo, ICopyright } from "../../../../interfaces";
import { TYPE_FOLDER } from "../../../../constants";
import { ACT_PANEL } from "../reducer";

interface IContent {
  dispatchPanel: React.Dispatch<unknown>;
  assetData: IFileDetail;
  mediaData: IMediaInfo;
  dirtyCopyright: ICopyright;
}

const Content = ({
  dispatchPanel,
  assetData,
  mediaData,
  dirtyCopyright,
}: IContent) => {
  const onChangeTag = React.useCallback(
    (newItems: IFileDetail[]) => {
      dispatchPanel({ type: ACT_PANEL.SET_ASSETDATA, assetData: newItems[0] });
    },
    [dispatchPanel]
  );
  const onChangeCopyright = React.useCallback(
    (id: string, value) => {
      dispatchPanel({ type: ACT_PANEL.UPDATE_COPYRIGHT_DIRTY, id, value });
    },
    [dispatchPanel]
  );

  return (
    <>
      <InfoShare assetData={assetData} />
      <Divider />
      <Group
        title="General Info"
        content={
          <InfoGeneral
            onChangeTag={onChangeTag}
            assetData={assetData}
            mediaData={mediaData}
          />
        }
      />
      {assetData.mimeType === TYPE_FOLDER ? null : (
        <>
          <Divider />
          <Group
            title="Digital Right"
            content={
              <InfoCopyright
                onChange={onChangeCopyright}
                copyrightSaved={assetData.copyright}
                copyrightDirty={dirtyCopyright}
              />
            }
          />
        </>
      )}
    </>
  );
};

export default Content;
