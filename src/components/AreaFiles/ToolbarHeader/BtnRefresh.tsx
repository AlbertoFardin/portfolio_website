import * as React from "react";
import { ACT_VPORT } from "../reducer";
import Btn from "../../../componentsBase/Btn";
import { ContextDispatchViewport } from "../contexts";

const BtnRefresh = () => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const onRefresh = React.useCallback(() => {
    dispatchViewport({ type: ACT_VPORT.REFRESH });
  }, [dispatchViewport]);

  return <Btn icon="refresh" tooltip="Refresh" onClick={onRefresh} />;
};

export default BtnRefresh;
