import * as React from "react";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import classnames from "classnames";
import IFacetType from "../../../componentsBase/Facets/IFacetType";
import Collapse from "@material-ui/core/Collapse";
import TypographyEllipsis from "../../../componentsBase/TypographyEllipsis";
import IconCollapse from "../../../componentsBase/IconCollapse";
import FacetSelectionStickyItem from "./FacetLevelsItem";
import isEmpty from "lodash-es/isEmpty";
import { IEntityType } from "../../../interfaces";
import Cookies from "js-cookie";
import { ENTITYTYPE_CLOSE, ENTITYTYPE_VALUE } from "../../../constants";

const type = IFacetType.SELECTION;
const defaultId = "all";
const useStyle = makeStyles({
  facet: {
    position: "relative",
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
    margin: "0 10px 5px",
    overflow: "hidden",
  },
  facetHeader: {
    "padding-left": 10,
    flex: 1,
    cursor: "pointer",
    "min-height": 40,
    display: "flex",
    position: "relative",
    "align-items": "center",
    "flex-direction": "row",
  },
  accordionContent: {
    padding: "0 30px 10px 30px",
    display: "flex",
    "flex-direction": "column",
    "align-items": "stretch",
  },
});

interface IItem {
  id: string;
  label: string;
  sizeValue: number;
  sizeTotal: number;
}

interface IChange {
  id: string;
  type: IFacetType;
  value: IItem[];
}

interface IFacetLevels {
  className?: string;
  id: string;
  value?: IItem[];
  options?: IEntityType[];
  label?: string;
  onChange: (changes: IChange) => void;
}

const FacetLevels = ({
  className,
  id,
  value = [],
  options = [],
  label,
  onChange,
}: IFacetLevels) => {
  const classes = useStyle({});
  const [close, setClose] = React.useState(
    Cookies.get(ENTITYTYPE_CLOSE) === "true"
  );

  const listItems: IItem[] = React.useMemo(() => {
    const sizeTotal = options.length;

    const array = options.map(({ id, label, level }) => ({
      id,
      label: label.toLocaleUpperCase(),
      sizeValue: level,
      sizeTotal,
    }));

    array.splice(0, 0, {
      id: defaultId,
      label: "ALL",
      sizeValue: 0,
      sizeTotal,
    });

    return array;
  }, [options]);

  const onClose = React.useCallback(() => {
    const newClose = !close;
    setClose(newClose);
    Cookies.set(ENTITYTYPE_CLOSE, "" + newClose);
  }, [close]);
  const onClick = React.useCallback(
    (newId: string) => {
      onChange({
        id,
        type,
        value:
          newId === defaultId ? [] : [listItems.find((l) => l.id === newId)],
      });
      Cookies.set(ENTITYTYPE_VALUE, newId);
    },
    [id, listItems, onChange]
  );
  const selectedId = React.useMemo(() => {
    const valueInCookie = Cookies.get(ENTITYTYPE_VALUE);
    if (!!valueInCookie) return valueInCookie;
    if (!isEmpty(value)) return value[0].id;
    return defaultId;
  }, [value]);

  React.useEffect(() => {
    if (!value.length && selectedId !== defaultId) {
      onClick(selectedId);
    }
  }, [selectedId, onClick, value.length]);

  return (
    <div
      className={classnames({
        [classes.facet]: true,
        [className]: !!className,
      })}
    >
      <div
        role="presentation"
        className={classes.facetHeader}
        onClick={onClose}
      >
        <IconCollapse collapse={close} />
        <Typography
          variant="subtitle2"
          children={!close ? label : `${label}:`}
          style={{ marginRight: 5 }}
        />
        {!close ? null : (
          <TypographyEllipsis
            variant="subtitle1"
            children={listItems.find((a) => a.id === selectedId).label}
          />
        )}
      </div>
      <Collapse in={!close} timeout="auto" unmountOnExit mountOnEnter>
        <div className={classes.accordionContent}>
          {listItems.map(({ id, label, sizeValue, sizeTotal }: IItem) => (
            <FacetSelectionStickyItem
              key={id}
              value={id}
              label={label}
              selected={selectedId === id}
              sizeTotal={sizeTotal}
              sizeValue={sizeValue}
              onClick={onClick}
            />
          ))}
        </div>
      </Collapse>
    </div>
  );
};

export default FacetLevels;
