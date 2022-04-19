import List from "@material-ui/core/List";
import makeStyles from "@material-ui/core/styles/makeStyles";
import isEmpty from "lodash-es/isEmpty";
import * as React from "react";
import FacetBase from "../utils/FacetBase";
import FieldSearch from "./utils/FieldSearch";
import IFacetMultiSelection, { IItem } from "./IFacetMultiSelection";
import FacetMultiSelectionItem from "./utils/Item";
import IFacetType from "../IFacetType";
import useDebounce from "../../utils/useDebounce";
import getNewValue from "./utils/getNewValue";
import { emptyFn } from "../../utils/common";

const useStyle = makeStyles({
  content: {
    padding: "0 15px",
  },
  list: {
    overflow: "auto",
    "max-height": 220,
  },
});

/**
 * **FacetMultiSelection** è una faccetta che gestisce diversi items selezionabili.
 */
const FacetMultiSelection = ({
  className,
  style,
  disabled,
  disabledInfo,
  i18n: i18nCustom,
  type = IFacetType.MULTISELECTION,
  id,
  initCollapse,
  value = [],
  valueMax,
  options = [],
  optionsMore = 0,
  label,
  subLabel,
  onChange = emptyFn,
  onSearch,
}: IFacetMultiSelection) => {
  const i18n = {
    clear: "clear",
    search: "Search...",
    itemNotFound: "No results found",
    moreResults: `${optionsMore} more results...`,
    ...i18nCustom,
  };
  const classes = useStyle({});
  const searching = React.useRef(false);
  const [inputValue, setInputValue] = React.useState("");
  const inputValueDebounced = useDebounce(inputValue, 500);
  const itemEmpty = React.useMemo(
    () => (
      <FacetMultiSelectionItem
        disabled
        label={i18n.itemNotFound}
        id="undefined"
      />
    ),
    [i18n.itemNotFound]
  );
  const itemMoreResult = React.useMemo(
    () => (
      <FacetMultiSelectionItem
        disabled
        label={i18n.moreResults}
        id="undefined"
      />
    ),
    [i18n.moreResults]
  );
  const onClickItem = React.useCallback(
    (item: IItem) => {
      onChange({
        id,
        type,
        value: getNewValue({ value, valueMax, item }),
      });
    },
    [id, onChange, type, value, valueMax]
  );
  const onSearchInput = React.useCallback((text: string) => {
    setInputValue(text);
    searching.current = true;
  }, []);

  React.useEffect(() => {
    if (!disabled && onSearch && searching.current) {
      onSearch(inputValueDebounced);
      searching.current = false;
    }
  }, [disabled, onSearch, inputValueDebounced]);

  return (
    <FacetBase
      badgeCount={value.length}
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
      <div className={classes.content}>
        {!onSearch ? null : (
          <FieldSearch
            placeholder={i18n.search}
            value={inputValue}
            onChange={onSearchInput}
          />
        )}
        <List className={classes.list}>
          {isEmpty(options)
            ? itemEmpty
            : options.map((item: IItem) => (
                <FacetMultiSelectionItem
                  key={item.id}
                  id={item.id}
                  valueMax={valueMax}
                  disabled={disabled}
                  selected={value.some(({ id }) => id === item.id)}
                  count={item.count}
                  label={item.label}
                  labelSearch={inputValue}
                  onClick={onClickItem}
                />
              ))}
          {!!optionsMore ? itemMoreResult : null}
        </List>
      </div>
    </FacetBase>
  );
};

export default FacetMultiSelection;
