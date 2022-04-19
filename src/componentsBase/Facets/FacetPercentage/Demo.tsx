import * as React from "react";
import { action } from "@storybook/addon-actions";
import FacetPercentage from ".";
import Btn from "../../Btn";
import IFacetType from "../IFacetType";

const DemoFacetPercentage = () => {
  const [value, setValue] = React.useState(undefined as number[]);
  const cbOnChange = React.useCallback((v) => {
    setValue(v.value);
    action("onChange")(v);
  }, []);
  const onClick1 = React.useCallback(() => setValue([25, 50]), []);
  const onClick2 = React.useCallback(() => setValue([0, 100]), []);

  return (
    <div>
      <FacetPercentage
        type={IFacetType.PERCENTAGE}
        id={"_id"}
        label={"FacetPercentage"}
        onChange={cbOnChange}
        value={value}
        style={{ width: 350 }}
      />
      <br />
      <br />
      <Btn variant="bold" label={`value: ${JSON.stringify(value)}`} />
      <br />
      <br />
      <Btn
        color="#00f"
        variant="bold"
        icon="edit"
        label={"set [25,50]"}
        onClick={onClick1}
      />
      <br />
      <Btn
        color="#00f"
        variant="bold"
        icon="edit"
        label={"set [0,100]"}
        onClick={onClick2}
      />
    </div>
  );
};

export default DemoFacetPercentage;
