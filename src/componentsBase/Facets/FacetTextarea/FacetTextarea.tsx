import * as React from "react";
import FieldText from "../../Field/FieldText/FieldText";
import { emptyFn } from "../../utils/common";
import IFacetType from "../IFacetType";
import FacetBase from "../utils/FacetBase";
import IFacetTextarea from "./IFacetTextarea";
import { prepareBadge, prepareValue } from "./utils";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";

const i18nDefault = {
  clear: "clear",
  placeholder: "Write here...",
  noValue: "No value",
};
const type = IFacetType.TEXTAREA;

const getValueOnChange = (cartridgeSplit: boolean, t: string) =>
  !cartridgeSplit || !t ? t : t.split(/\r+|\n/);

/**
 * **FacetTextarea** è una faccetta che gestisce una stringa o un'array di stringhe.
 */
const FacetTextarea = ({
  cartridgeSplit = true,
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
  showCaseSensitiveSwitch,
  caseSensitiveSwitch,
  onCaseSensitiveSwitch = emptyFn,
  value = "",
}: IFacetTextarea) => {
  const i18n = {
    ...i18nDefault,
    ...i18nCustom,
  };

  const inputValueRef = React.useRef(null);

  const cbOnInputChange = React.useCallback(
    (t: string) => {
      onChange({
        id,
        type,
        value: getValueOnChange(cartridgeSplit, t),
        caseSensitive: caseSensitiveSwitch,
      });
      inputValueRef.current = t;
    },
    [cartridgeSplit, caseSensitiveSwitch, id, onChange]
  );

  const onChangeSwitch = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValueSwitch = event.target.checked;
      onCaseSensitiveSwitch(newValueSwitch);
      if (inputValueRef.current) {
        onChange({
          id,
          type,
          value: getValueOnChange(cartridgeSplit, inputValueRef.current),
          caseSensitive: newValueSwitch,
        });
      }
    },
    [cartridgeSplit, id, onCaseSensitiveSwitch, onChange]
  );

  return (
    <FacetBase
      badgeCount={prepareBadge(value)}
      badgeLabel={i18n.clear}
      onClickBadge={onChange}
      id={id}
      type={type}
      label={label}
      subLabel={subLabel}
      initCollapse={initCollapse}
      className={className}
      style={style}
      disabled={disabled}
      disabledInfo={disabledInfo}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          flex: 1,
          padding: "0 15px",
        }}
      >
        <FieldText
          style={{ margin: 0 }}
          multiline
          placeholder={i18n.placeholder}
          value={prepareValue(value)}
          onChange={cbOnInputChange}
          readOnly={disabled}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {showCaseSensitiveSwitch ? (
            <>
              <Switch
                checked={caseSensitiveSwitch}
                onChange={onChangeSwitch}
                size="small"
                color="primary"
              />
              <Typography variant="caption" style={{ paddingLeft: 5 }}>
                Case Sensitive {caseSensitiveSwitch ? "ON" : "OFF"}
              </Typography>
            </>
          ) : null}
        </div>
      </div>
    </FacetBase>
  );
};

export default FacetTextarea;
