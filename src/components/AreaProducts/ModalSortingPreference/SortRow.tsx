import {
  FormControlLabel,
  Popover,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import Icon from "@material-ui/core/Icon/Icon";
import Btn from "../../../componentsBase/Btn";
import BtnBadge from "../../../componentsBase/BtnBadge/BtnBadge";
import TypographyEllipsis from "../../../componentsBase/TypographyEllipsis/TypographyEllipsis";
import * as React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { IContentSort } from "../../../interfaces";
import { ISortOrder } from "../../../componentsBase/StickyGrid";
import FieldSelect from "../../../componentsBase/Field/FieldSelect/FieldSelect";
import { IFieldSelectItem } from "../../../componentsBase/Field/FieldSelect";
import mixColors from "../../../componentsBase/utils/mixColors";

const badgeSize = 16;

interface IStyles {
  showReplaceField: boolean;
}

const useStyles = makeStyles(({ palette }) => {
  const colorMain = palette.primary.main;
  return {
    badge: {
      top: -5,
      left: -5,
      "min-height": `${badgeSize}px !important`,
      "min-width": `${badgeSize}px !important`,
      "border-width": 1,
      "border-color": colorMain,
    },
    badgeLabel: {
      "font-size": 10,
    },
    attributeCell: {
      display: "flex",
      flexDirection: "row",
      padding: 4,
      width: "70px",
      borderStyle: "solid",
      borderRadius: "4px",
      borderWidth: "thin",
      backgroundColor: ({ showReplaceField }: IStyles) =>
        !showReplaceField ? "lightgrey" : mixColors(0.15, "#fff", colorMain),
      borderColor: "gray",
    },
  };
});

const SortRow = ({
  index,
  item,
  onSortingChange,
  onReplace,
  onDelete,
  optionsWithoutRows,
  deletionDisabled = false,
}: {
  index: number;
  item: IContentSort;
  onSortingChange: (item: IContentSort) => void;
  onReplace: (oldItem: IContentSort, newItem: IContentSort) => void;
  onDelete: (k: string) => void;
  optionsWithoutRows: { id: string; label: string }[];
  deletionDisabled?: boolean;
}) => {
  const [showReplaceField, setShowReplaceField] = React.useState(false);

  const classes = useStyles({ showReplaceField });
  const ref = React.useRef(null);

  const handleChange = React.useCallback(
    (e, value) => {
      onSortingChange({ ...item, order: value });
    },
    [item, onSortingChange]
  );
  const onClickDelete = React.useCallback(() => {
    onDelete(item.id);
  }, [item.id, onDelete]);
  const [searchValue, setSearchValue] = React.useState("");

  const options = React.useMemo(
    () =>
      optionsWithoutRows.filter(
        ({ label }) =>
          label.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
      ),
    [optionsWithoutRows, searchValue]
  );

  const handleClose = React.useCallback(() => setShowReplaceField(false), []);
  const onClick = React.useCallback(() => setShowReplaceField(true), []);

  const onSearch = React.useCallback((val) => {
    setSearchValue(val);
  }, []);
  const onChangeRow = React.useCallback(
    (i: IFieldSelectItem) => {
      const newItem = { id: i.id, label: i.label, order: ISortOrder.ASC };
      onReplace(item, newItem);
    },
    [item, onReplace]
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
      ref={ref}
    >
      <Icon
        children={"drag_indicator"}
        style={{
          width: 30,
        }}
      />
      <TypographyEllipsis
        style={{
          width: 50,
        }}
      >
        {index === 0 ? "Sort by" : "Then by"}
      </TypographyEllipsis>
      <div
        role="button"
        tabIndex={index}
        style={{
          width: 90,
          display: "flex",
          alignItems: "center",
        }}
        onKeyPress={onClick}
        onClick={onClick}
      >
        <div
          style={{
            position: "absolute",
          }}
        >
          <BtnBadge
            className={classes.badge}
            labelClassName={classes.badgeLabel}
            label={`${index + 1}`}
          />

          <div className={classes.attributeCell}>
            <TypographyEllipsis
              style={{
                paddingLeft: 2,
                flex: 1,
              }}
            >
              {item.label}
            </TypographyEllipsis>

            <Icon
              children={"arrow_drop_down"}
              style={{
                width: 20,
              }}
            />
          </div>
        </div>
      </div>
      <RadioGroup
        aria-label="sortorder"
        name="sortorder"
        value={item.order}
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "row",
          padding: 5,
        }}
        onChange={handleChange}
      >
        <FormControlLabel
          value={ISortOrder.ASC}
          style={{ flex: 1, width: 20 }}
          control={<Radio />}
          label="A Z"
        />
        <FormControlLabel
          value={ISortOrder.DESC}
          style={{ flex: 1, width: 20 }}
          control={<Radio />}
          label="Z A"
        />
      </RadioGroup>
      <Btn icon="cancel" onClick={onClickDelete} disabled={deletionDisabled} />
      <Popover
        open={showReplaceField}
        anchorEl={ref.current}
        style={{
          marginTop: -15,
          marginRight: -20,
        }}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <FieldSelect
          style={{
            marginTop: 0,
            marginBottom: 0,
            width: 400,
          }}
          placeholder="Replace attribute..."
          searchable
          onChange={onChangeRow}
          onSearch={onSearch}
          options={options}
          itemsSelectedMaxLength={1}
          value={[{ id: item.id, label: item.label }]}
          adornmentIcon="search"
        />
      </Popover>
    </div>
  );
};

export default SortRow;
