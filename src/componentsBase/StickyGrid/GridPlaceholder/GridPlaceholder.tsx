import isEmpty from "lodash-es/isEmpty";
import * as React from "react";
import LoadingMask from "../../LoadingMask";
import { IColumn } from "../interfaces";
import Placeholder from "./Placeholder";

interface IGridPlaceholder {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  columns: IColumn[];
  rootLoading: boolean;
}

const GridPlaceholder = ({ items, columns, rootLoading }: IGridPlaceholder) => {
  return (
    <>
      <LoadingMask open={rootLoading} />
      <Placeholder
        open={!rootLoading && isEmpty(columns)}
        icon="view_column"
        label1="No column selected"
        label2="Please select at least one column"
      />
      <Placeholder
        open={!rootLoading && !isEmpty(columns) && isEmpty(items)}
        icon="search"
        label1="No item found"
      />
    </>
  );
};

export default GridPlaceholder;
