import * as React from "react";
import { IItem } from "./interfaces";
import Chip from "../Chip";
import Tooltip from "../Tooltip";

interface IChip extends IItem {
  selected: boolean;
  onClick: (id: string) => void;
}

const ChipCustom = ({ id, label, tooltip, selected, onClick }: IChip) => {
  const cbOnClick = React.useCallback(() => {
    onClick(id);
  }, [id, onClick]);

  return (
    <Tooltip title={tooltip}>
      <div style={{ display: "inline-flex" }}>
        <Chip key={id} label={label} selected={selected} onClick={cbOnClick} />
      </div>
    </Tooltip>
  );
};

export default ChipCustom;
