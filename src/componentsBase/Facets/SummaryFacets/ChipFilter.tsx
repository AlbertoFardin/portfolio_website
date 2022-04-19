import * as React from "react";
import Chip from "../../Chip";
import { emptyFn } from "../../utils/common";
import IFacet from "../IFacet";
import IChipProps from "./IChipProps";

interface IChipFilter extends IChipProps {
  onClick?: (id: string, value, filter: IFacet) => void;
  onRender?: (id: string, width: number, height: number) => void;
}
const ChipFilter = ({
  id,
  value,
  label,
  filter,
  onClick = emptyFn,
  onRender = emptyFn,
}: IChipFilter) => {
  const rootRef = React.useRef(null);
  const [ready, setReady] = React.useState(false);
  const [render, setRender] = React.useState(false);
  const cbOnClick = React.useCallback(() => {
    onClick(id, value, filter);
  }, [filter, id, onClick, value]);

  React.useEffect(() => {
    setReady(true);
    if (ready && !render) {
      setRender(true);
      onRender(id, rootRef.current.clientWidth, rootRef.current.clientHeight);
    }
  }, [ready, render, onRender, id]);

  return (
    <div ref={rootRef} style={{ display: "inline-flex", alignItems: "center" }}>
      <Chip
        tooltip={`${filter.label}: ${label}`}
        tooltipAlwaysVisible
        label={label}
        onClick={cbOnClick}
        onRemove={cbOnClick}
        style={{
          marginLeft: 2,
          marginRight: 2,
          maxWidth: 145,
        }}
      />
    </div>
  );
};

export default ChipFilter;
