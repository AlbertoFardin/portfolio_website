import Toolbar from "@material-ui/core/Toolbar";
import * as React from "react";
import * as Colors from "../style/Colors";
import { ILabelPositionX, ILabelPositionY } from "../Field";
import FieldSelect from "../Field/FieldSelect";

const colorsMap = {
  Blue: Colors.Blue,
  Green: Colors.Green,
  Purple: Colors.Purple,
  Red: Colors.Red,
  Orange: Colors.Orange,
};

interface IDemoColorToolbar {
  zIndex?: number;
  style?: React.CSSProperties;
  children?: JSX.Element | React.ReactNode;
  onChange: (color: string) => void;
}

const DemoColorToolbar = ({
  zIndex = 0,
  style,
  children,
  onChange,
}: IDemoColorToolbar) => {
  const [color, setColor] = React.useState(Colors.Blue);
  const onCbChange = React.useCallback(
    (a) => {
      const newColor = a.selected ? a : null;
      const newColorId = newColor ? newColor.id : "";
      setColor(newColorId);
      onChange(newColorId);
    },
    [onChange]
  );
  return (
    <Toolbar
      style={{
        zIndex,
        ...style,
      }}
    >
      <FieldSelect
        label={[
          {
            id: "colorTheme",
            label: "colorTheme",
            style: {
              backgroundColor: "#fff",
              top: "-4px",
              padding: "0 5px",
              zIndex: 1,
              lineHeight: 1,
            },
            positionX: ILabelPositionX.left,
            positionY: ILabelPositionY.top,
          },
        ]}
        itemsSelectedMaxLength={1}
        value={Object.keys(colorsMap).map((k: string) => ({
          id: colorsMap[k],
          label: k,
          selected: colorsMap[k] === color,
          styleLabel: { color: colorsMap[k] },
        }))}
        onChange={onCbChange}
      />
      <div style={{ flex: 1 }} />
      {children}
    </Toolbar>
  );
};

export default DemoColorToolbar;
