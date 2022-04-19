import * as React from "react";
import Btn from "../../../../componentsBase/Btn/Btn";
import { ContextDispatchDetail } from "../../contexts";
import { ACT_DETAIL } from "../reducer";
import SearchAttribute from "../SearchAttribute";

interface IBtnSearchAttribute {
  fullscreen: boolean;
  searchAttributeOpen: boolean;
  searchAttributeValue: string;
  disabled?: boolean;
}

const BtnSearchAttribute = ({
  fullscreen,
  searchAttributeOpen,
  searchAttributeValue,
  disabled,
}: IBtnSearchAttribute) => {
  const dispatchDetail = React.useContext(ContextDispatchDetail);
  const onClick = React.useCallback(() => {
    dispatchDetail({
      type: ACT_DETAIL.SEARCH_ATTRIBUTE_OPEN,
      value: !searchAttributeOpen,
    });
  }, [dispatchDetail, searchAttributeOpen]);

  return (
    <>
      {fullscreen && searchAttributeOpen ? (
        <SearchAttribute
          searchAttributeValue={searchAttributeValue}
          disabled={disabled}
        />
      ) : null}
      <Btn
        selected={searchAttributeOpen}
        icon={searchAttributeOpen ? "search_off" : "search"}
        tooltip="Search attribute"
        onClick={onClick}
        disabled={disabled}
      />
    </>
  );
};

export default BtnSearchAttribute;
