import * as React from "react";
import Pagination from "../../../componentsBase/Pagination";
import { ACT_VPORT, PAGINATION_SIZES } from "../reducer";
import { ContextDispatchViewport } from "../contexts";
import Typography from "@material-ui/core/Typography";

interface IGridPagination {
  itemsTotal: number;
  paginationSize: number;
  paginationValue: number;
  loadOnlySelected: boolean;
}

const GridPagination = ({
  itemsTotal,
  paginationSize,
  paginationValue,
  loadOnlySelected,
}: IGridPagination) => {
  const dispatchViewport = React.useContext(ContextDispatchViewport);

  const onPaginationChangeSize = React.useCallback(
    (sizes) => {
      const newSize = sizes.find(({ selected }) => selected).value;
      dispatchViewport({
        type: ACT_VPORT.PAGINATION_SET_SIZE,
        payload: newSize,
      });
    },
    [dispatchViewport]
  );
  const onPaginationChangeValue = React.useCallback(
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

  if (loadOnlySelected) {
    return (
      <Typography
        variant="body1"
        style={{ margin: "0 10px" }}
        children={`${itemsTotal} items`}
      />
    );
  }

  return (
    <Pagination
      pageCurrent={paginationValue}
      pageSizes={PAGINATION_SIZES.map((n) => ({
        value: n,
        label: `${n} Rows`,
        selected: n === paginationSize,
      }))}
      onChangeCurrent={onPaginationChangeValue}
      onChangeSizes={onPaginationChangeSize}
      itemsCount={itemsTotal}
      labelAdornmentEnd={`of ${itemsTotal} items`}
    />
  );
};

export default GridPagination;
