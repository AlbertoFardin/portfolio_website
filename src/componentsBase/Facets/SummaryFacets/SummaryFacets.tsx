import Popover from "@material-ui/core/Popover";
import makeStyles from "@material-ui/core/styles/makeStyles";
import isEmpty from "lodash-es/isEmpty";
import * as React from "react";
import Btn from "../../Btn";
import * as Colors from "../../style/Colors";
import clearFilters from "../utils/clearFilters";
import Chip from "./ChipFilter";
import getChipsProps from "./getChipProps";
import getFiltersChanged from "./getFiltersChanged";
import IChipProps from "./IChipProps";
import IChipRender from "./IChipRender";
import IFiltersSummary from "./ISummaryFacets";

const useStyle = makeStyles({
  summary: {
    display: "flex",
    "border-radius": 50,
    "white-space": "nowrap",
    overflow: "hidden",
    "text-overflow": "ellipsis",
    "align-items": "center",
  },
  divWithAllChipsOutsideUi: {
    position: "absolute",
    bottom: -1000,
    right: -1000,
    "align-items": "center",
    display: "inline-flex",
    "flex-direction": "column",
  },
  popoverPaper: {
    padding: 10,
    "max-width": 350,
  },
  toolbar: {
    padding: "0 10px",
    "min-width": 210,
  },
  hide: {
    opacity: 0,
  },
});

/**
 *  **FiltersSummary** is a container of chips, any chips rappresent a facets value.
 */
const SummaryFacets = ({
  facets,
  dateFormat,
  onChange,
  maxWidth,
  maxChipVisible,
  buttonClearAll = true,
}: IFiltersSummary) => {
  const btnClearRef = React.useRef(null);
  const btnPopoverRef = React.useRef(null);
  const classes = useStyle({});
  const newChipsProps = getChipsProps(facets, dateFormat);
  const [chipsRender, setChipsRender] = React.useState([] as IChipRender[]);
  const [popoverAnchorEl, setPopoverAnchorEl] = React.useState(null);
  const [chipsProps, setChipsProps] = React.useState(
    newChipsProps as IChipProps[]
  );
  const chipsVisibled = [];
  const chipsNotVisibled = [];
  chipsRender.reduce((acc, chipRender: IChipRender) => {
    const chipProp = chipsProps.find(
      ({ id }: IChipProps) => id === chipRender.id
    );
    if (!chipProp) return acc;

    const btnClearWidth = !btnClearRef.current
      ? 0
      : btnClearRef.current.clientWidth;
    const btnPopoverWidth = !btnPopoverRef.current
      ? 0
      : btnPopoverRef.current.clientWidth;
    const chipWidth = chipRender.width;
    const chipVisibled =
      acc + chipWidth + btnClearWidth + btnPopoverWidth < maxWidth;

    if (
      chipVisibled &&
      (maxChipVisible === undefined || chipsVisibled.length < maxChipVisible)
    ) {
      chipsVisibled.push(chipProp);
    } else {
      chipsNotVisibled.push(chipProp);
    }
    return acc + chipWidth;
  }, 0);
  const cbOnRender = React.useCallback(
    (id, width, height) => {
      const renderIds = new Set(chipsRender.map(({ id }) => id));
      if (!renderIds.has(id)) {
        const newChipsRender = Array.from(chipsRender);
        newChipsRender.push({
          id,
          width,
          height,
        });
        setChipsRender(newChipsRender);
      }
    },
    [chipsRender]
  );
  const cbOnClear = React.useCallback(() => {
    onChange(clearFilters(facets));
    setPopoverAnchorEl(null);
  }, [facets, onChange]);
  const cbOnMenuOpen = React.useCallback((event) => {
    setPopoverAnchorEl(event.target);
  }, []);
  const cbOnMenuClose = React.useCallback(() => {
    setPopoverAnchorEl(null);
  }, []);
  const cbOnChipClick = React.useCallback(
    (id, value, filter) => {
      const filtersChanged = getFiltersChanged({
        chipId: id,
        chipValue: value,
        chipFilter: filter,
        filters: facets,
      });
      onChange(filtersChanged);
      if (chipsNotVisibled.length === 1) setPopoverAnchorEl(null);
    },
    [chipsNotVisibled.length, facets, onChange]
  );
  const getChips = React.useCallback(
    (chips: IChipProps[]) => {
      return chips.map((c: IChipProps) => (
        <Chip
          key={c.id}
          id={c.id}
          filter={c.filter}
          value={c.value}
          label={c.label}
          onClick={cbOnChipClick}
        />
      ));
    },
    [cbOnChipClick]
  );
  const serializedChips = JSON.stringify(chipsProps.map(({ id }) => id));
  const serializedChipsNew = JSON.stringify(newChipsProps.map(({ id }) => id));

  React.useEffect(() => {
    if (serializedChipsNew !== serializedChips) {
      setChipsProps(newChipsProps);
    }
  }, [newChipsProps, serializedChips, serializedChipsNew]);

  return (
    <>
      <div
        // this div is render outside the UI
        // I need this to get chips dimensions
        className={classes.divWithAllChipsOutsideUi}
      >
        {chipsProps.map((c: IChipProps) => (
          <Chip
            key={c.id}
            id={c.id}
            filter={c.filter}
            value={c.value}
            label={c.label}
            onRender={cbOnRender}
          />
        ))}
      </div>

      {isEmpty(chipsProps) ? null : (
        <div className={classes.summary} style={{ maxWidth }}>
          {!buttonClearAll ? null : (
            <div ref={btnClearRef}>
              <Btn label="Clear all" onClick={cbOnClear} />
            </div>
          )}
          {getChips(chipsVisibled)}
          <div ref={btnPopoverRef}>
            {isEmpty(chipsNotVisibled) ? null : (
              <Btn
                variant="bold"
                label={`+${chipsNotVisibled.length}`}
                onClick={cbOnMenuOpen}
                tooltip="Filters valued"
                color={Colors.Purple}
              />
            )}
          </div>
        </div>
      )}

      <Popover
        open={!!popoverAnchorEl}
        onClose={cbOnMenuClose}
        anchorEl={popoverAnchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          className: classes.popoverPaper,
        }}
        children={getChips(chipsNotVisibled)}
      />
    </>
  );
};

export default SummaryFacets;
