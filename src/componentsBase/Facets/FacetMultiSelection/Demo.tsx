import * as React from "react";
import { action } from "@storybook/addon-actions";
import IFacetType from "../IFacetType";
import FieldText from "../../Field/FieldText";
import FacetMultiSelection from "./FacetMultiSelection";
import { IItem } from "./IFacetMultiSelection";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import italy from "../../__stories__/mock/italy";

const optionsInit: IItem[] = italy.map(({ nome }) => ({
  id: nome,
  label: nome,
}));
const size = 5;

const FacetsDemo = () => {
  const [valueMax, setValueMax] = React.useState("50");
  const [options, setOptions] = React.useState([] as IItem[]);
  const [optionsMore, setOptionsMore] = React.useState(0);
  const [value, setValue] = React.useState([] as IItem[]);
  const [searchInput, setSearchInput] = React.useState("");
  const onChange = React.useCallback((v) => {
    setValue(v.value);
    action("onChange")(v);
  }, []);

  React.useEffect(() => {
    let newOptions = [];
    let newOptionsMore = 0;
    if (!!searchInput) {
      newOptions = optionsInit.filter(({ label }) => {
        const labelUp = label.toLocaleUpperCase();
        const inputUp = searchInput.toLocaleUpperCase();
        return labelUp.indexOf(inputUp) !== -1;
      });
      newOptionsMore = 0;
    } else {
      newOptions = optionsInit.slice(0, size);
      newOptionsMore = optionsInit.length - size;
    }

    setOptions(newOptions);
    setOptionsMore(newOptionsMore);
  }, [searchInput]);

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <FacetMultiSelection
        id={"demo"}
        type={IFacetType.MULTISELECTION}
        label="Demo - Regioni Italiane"
        onChange={onChange}
        onSearch={setSearchInput}
        valueMax={Number(valueMax)}
        value={value}
        options={options}
        optionsMore={optionsMore}
        style={{
          border: "1px solid #f00",
          width: 250,
        }}
      />
      <div style={{ flex: 1, padding: 10 }}>
        <Typography variant="subtitle2" children="Value length selectable:" />
        <FieldText
          style={{ marginTop: 0 }}
          value={valueMax}
          onChange={setValueMax}
        />
        <Divider />
        <Typography variant="subtitle2" children="Value selected:" />
        {(value || []).map((v) => (
          <Typography key={v.id} variant="body1" children={`-> ${v.label}`} />
        ))}
      </div>
    </div>
  );
};

export default FacetsDemo;
