import * as React from "react";
import { ACT_VPORT } from "../reducer";
import Btn from "../../../componentsBase/Btn";
import { ContextDispatchViewport } from "../contexts";

const mediaLastId = "last";
const mediaReadyId = "ready";

interface ISelectMedia {
  gridShowMediaReady: boolean;
}

const SelectMedia = ({ gridShowMediaReady }: ISelectMedia) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const onChange = React.useCallback(
    (event, actionId) => {
      dispatchViewport({
        type: ACT_VPORT.GRID_SHOW_MEDIA_READY,
        value: actionId === mediaReadyId,
      });
    },
    [dispatchViewport]
  );
  const menuItems = React.useMemo(
    () => [
      {
        id: mediaLastId,
        label: "Last upload",
        onClick: onChange,
        active: !gridShowMediaReady,
      },
      {
        id: mediaReadyId,
        label: "Media ready",
        onClick: onChange,
        active: gridShowMediaReady,
      },
    ],
    [gridShowMediaReady, onChange]
  );

  return (
    <Btn
      style={{ padding: "0px 5px 0 8px", borderRadius: 5 }}
      icon="image"
      label={menuItems.find(({ active }) => active).label}
      tooltip="Product media preview will be set on media ready"
      menu={{
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
        transformOrigin: {
          vertical: "top",
          horizontal: "left",
        },
        items: menuItems,
      }}
    />
  );
};

export default SelectMedia;
