import * as React from "react";
import PaginationLibrary from "../../../componentsBase/Pagination";
import { ACT_VPORT } from "../reducer";
import { PAGINATIONS } from "../constants";
import { ContextDispatchViewport } from "../contexts";

interface IPagination {
  paginationSize: number;
  paginationValue: number;
  itemsTotal: number;
}

const Pagination = ({
  paginationSize,
  paginationValue,
  itemsTotal,
}: IPagination) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);
  const onPaginationSizeChange = React.useCallback(
    (sizes) => {
      const newSize = sizes.find(({ selected }) => selected).value;
      dispatchViewport({
        type: ACT_VPORT.PAGINATION_SET_SIZE,
        payload: newSize,
      });
    },
    [dispatchViewport]
  );
  const onPaginationValueChange = React.useCallback(
    (newPage: number) => {
      if (newPage) {
        dispatchViewport({
          type: ACT_VPORT.PAGINATION_SET_VALUE,
          payload: newPage,
        });
      }
    },
    [dispatchViewport]
  );

  return (
    <PaginationLibrary
      pageCurrent={paginationValue}
      pageSizes={PAGINATIONS.map((n) => ({
        value: n,
        label: `${n} Rows`,
        selected: n === paginationSize,
      }))}
      onChangeCurrent={onPaginationValueChange}
      onChangeSizes={onPaginationSizeChange}
      itemsCount={itemsTotal}
      labelAdornmentEnd={`of ${itemsTotal} items`}
    />
  );
};

export default Pagination;
