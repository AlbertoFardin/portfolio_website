import * as React from "react";
import FieldSearch from "../../FieldSearch";
import { ContextDispatchDetail } from "../contexts";
import { ACT_DETAIL } from "./reducer";

interface ISearchAttribute {
  searchAttributeValue: string;
  disabled?: boolean;
}

const SearchAttribute = ({
  searchAttributeValue,
  disabled,
}: ISearchAttribute) => {
  const dispatchDetail = React.useContext(ContextDispatchDetail);
  const onChange = React.useCallback(
    (value: string) => {
      dispatchDetail({
        type: ACT_DETAIL.SEARCH_ATTRIBUTE_VALUE,
        value,
      });
    },
    [dispatchDetail]
  );

  return (
    <FieldSearch
      autofocus
      style={{ alignSelf: "center", margin: "9px 4px" }}
      value={searchAttributeValue}
      placeholder="Search attributes..."
      onChange={onChange}
      disabled={disabled}
    />
  );
};

export default SearchAttribute;
