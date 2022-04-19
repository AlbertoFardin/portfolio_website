import FacetTextarea, {
  IFacetTextarea,
} from "../../../componentsBase/Facets/FacetTextarea";
import * as React from "react";

const FacetTextAreaSwitch = (p: IFacetTextarea) => {
  const { showCaseSensitiveSwitch = true } = p;
  const [caseSensitive, setCaseSensitive] = React.useState(false);
  const onCaseSensitiveSwitch = React.useCallback((nV) => {
    setCaseSensitive(nV);
  }, []);

  return (
    <FacetTextarea
      {...p}
      showCaseSensitiveSwitch={showCaseSensitiveSwitch}
      caseSensitiveSwitch={caseSensitive}
      onCaseSensitiveSwitch={onCaseSensitiveSwitch}
    />
  );
};

export default FacetTextAreaSwitch;
