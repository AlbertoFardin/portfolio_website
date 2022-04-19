import * as React from "react";
import FacetMultiSelection from "../FacetMultiSelection";
import IFacetType from "../IFacetType";
import IFacetBoolean from "./IFacetBoolean";
import isEmpty from "lodash-es/isEmpty";
import { emptyFn } from "../../utils/common";

const idYes = "yes";
const idNo = "no";
const i18nDefault = {
  clear: "clear",
  itemYesLabel: "Yes",
  itemYesCount: undefined,
  itemNoLabel: "No",
  itemNoCount: undefined,
};

/**
 * **FacetBoolean** è una faccetta che gestisce un booleano.
 */
const FacetBoolean = ({
  className,
  disabled,
  disabledInfo,
  i18n: i18nCustom,
  id,
  initCollapse,
  label,
  subLabel,
  onChange = emptyFn,
  style,
  value,
}: IFacetBoolean) => {
  const onCbChange = React.useCallback(
    ({ id, type, value }) => {
      onChange({
        id,
        type,
        // do per scontato che ci sia solo 1 value perchè è singleSelection
        value: isEmpty(value) ? undefined : value[0].id === idYes,
      });
    },
    [onChange]
  );
  const i18n = {
    ...i18nDefault,
    ...i18nCustom,
  };
  const optionsMemo = React.useMemo(() => {
    return [
      {
        label: i18n.itemYesLabel,
        count: i18n.itemYesCount,
        id: idYes,
      },
      {
        label: i18n.itemNoLabel,
        count: i18n.itemNoCount,
        id: idNo,
      },
    ];
  }, [
    i18n.itemNoCount,
    i18n.itemNoLabel,
    i18n.itemYesCount,
    i18n.itemYesLabel,
  ]);
  const valueMemo = React.useMemo(() => {
    if (value === false) {
      return [
        {
          label: i18n.itemNoLabel,
          count: i18n.itemNoCount,
          id: idNo,
        },
      ];
    }
    if (value === true) {
      return [
        {
          label: i18n.itemYesLabel,
          count: i18n.itemYesCount,
          id: idYes,
        },
      ];
    }
    return undefined;
  }, [
    i18n.itemNoCount,
    i18n.itemNoLabel,
    i18n.itemYesCount,
    i18n.itemYesLabel,
    value,
  ]);

  return (
    <FacetMultiSelection
      type={IFacetType.BOOLEAN}
      id={id}
      style={style}
      className={className}
      disabled={disabled}
      disabledInfo={disabledInfo}
      i18n={i18n}
      initCollapse={initCollapse}
      label={label}
      subLabel={subLabel}
      value={valueMemo}
      valueMax={1}
      options={optionsMemo}
      onChange={onCbChange}
    />
  );
};

export default FacetBoolean;
