import { action } from "@storybook/addon-actions";
import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Btn from "../Btn";
import Pagination, { IPageSize } from ".";

const pageSizesDefault = [
  {
    label: "1 Rows",
    value: 1,
    selected: false,
  },
  {
    label: "2 Rows",
    value: 2,
    selected: false,
  },
  {
    label: "20 Rows",
    value: 20,
    selected: false,
  },
  {
    label: "50 Rows",
    value: 50,
    selected: true,
  },
  {
    label: "150 Rows",
    value: 150,
    selected: false,
  },
  {
    label: "1000 Rows",
    value: 1000,
    selected: false,
  },
  {
    label: "10000 Rows",
    value: 10000,
    selected: false,
  },
];

const PaginationDemo = () => {
  const itemsCount = 15000;
  const [value, setValue] = React.useState(1);
  const [sizes, setSizes] = React.useState(pageSizesDefault as IPageSize[]);
  const sizeSelValue = sizes.find(({ selected }) => selected).value;
  const onCbChangeCurrent = React.useCallback((cur: number) => {
    setValue(cur);
    console.log("onChangeCurrent", cur);
    action("onChangeCurrent")(cur);
  }, []);
  const onCbChangeSizes = React.useCallback((newSizes: IPageSize[]) => {
    setSizes(newSizes);
    console.log("onChangeSizes", newSizes);
    action("onChangeSizes")(newSizes);
  }, []);
  const onCbBtnClick = React.useCallback(() => {
    onCbChangeCurrent(1);
  }, [onCbChangeCurrent]);
  return (
    <div>
      <Typography variant="body1" children={`ES size ${sizeSelValue}`} />
      <Typography
        variant="body1"
        children={`ES from ${sizeSelValue * (value - 1)}`}
      />
      <Btn color="#f00" label="SetPage1" onClick={onCbBtnClick} />

      <Pagination
        pageCurrent={value}
        pageSizes={sizes}
        onChangeCurrent={onCbChangeCurrent}
        onChangeSizes={onCbChangeSizes}
        labelAdornmentEnd={`of ${itemsCount} items`}
        itemsCount={itemsCount}
      />
    </div>
  );
};

export default PaginationDemo;
